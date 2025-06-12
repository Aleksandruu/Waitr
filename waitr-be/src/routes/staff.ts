import express, { Request, Response } from "express";
import { checkStaffRole } from "../middleware/roleMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";
import { getLocationFromRequest } from "../middleware/managerMiddleware";
import { UserModel, OrderProductDto } from "shared";
import jwt from "jsonwebtoken";
import pool from "../db";
import { getIo } from "../sockets";

const router = express.Router();

router.get(
  "/products",
  authenticateToken,
  checkStaffRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);
      const user: UserModel = jwt.decode(
        req.headers.authorization!.split(" ")[1]
      ) as UserModel;

      const targetStatus = user.role;

      const productsQuery = await pool.query(
        `SELECT 
          po.id as orderProductId,
          po.quantity,
          po.status,
          po.created_at as orderTime,
          po.preferences,
          p.name as productName,
          o.table_number as tableNumber
        FROM public.ProductOrder po
        JOIN public.Product p ON po.product_id = p.id
        JOIN public.Order o ON po.order_id = o.id
        WHERE o.location_id = $1 AND po.status = $2
        ORDER BY po.created_at ASC`,
        [locationId, targetStatus]
      );

      const products: OrderProductDto[] = productsQuery.rows.map((product) => ({
        orderTime: product.ordertime,
        orderProductId: product.orderproductid,
        productName: product.productname,
        tableNumber: product.tablenumber,
        quantity: product.quantity,
        status: product.status,
        preferences: product.preferences,
      }));

      res.status(200).json(products);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/ready",
  authenticateToken,
  checkStaffRole,
  async (req: Request, res: Response) => {
    try {
      const { orderProductId, tableNumber } = req.body;

      if (!orderProductId) {
        res.status(400).json({ error: "orderProductId is required" });
        return;
      }

      const user: UserModel = jwt.decode(
        req.headers.authorization!.split(" ")[1]
      ) as UserModel;

      const locationId = getLocationFromRequest(req);

      // Verifică dacă produsul există și are starea "preparing"
      const checkProductQuery = await pool.query(
        `SELECT status FROM public.ProductOrder WHERE id = $1`,
        [orderProductId]
      );

      if (checkProductQuery.rows.length === 0) {
        res.status(404).json({ error: "Product order not found" });
        return;
      }

      const currentStatus = checkProductQuery.rows[0].status;

      // Verifică dacă starea este "preparing"
      if (currentStatus !== user.role) {
        res.status(400).json({
          error: `Cannot mark as ready. Current status is "${currentStatus}", expected "${user.role}"`,
        });
        return;
      }

      // Actualizează starea la "ready"
      await pool.query(
        `UPDATE public.ProductOrder SET status = 'ready' WHERE id = $1`,
        [orderProductId]
      );

      const io = getIo();
      io.to(`waiter-${locationId}`).emit("order-ping", {
        table: tableNumber,
      });

      res.status(200).json({
        message: "Product status updated to ready successfully",
        orderProductId: orderProductId,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
