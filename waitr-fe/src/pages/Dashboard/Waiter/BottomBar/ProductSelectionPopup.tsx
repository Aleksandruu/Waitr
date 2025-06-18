import { useState, useEffect } from "react";
import styles from "./ProductSelectionPopup.module.scss";
import {
  useWaiterGetProductsQuery,
  useWaiterCreateOrderMutation,
} from "waitr-fe/src/api/waiterApi";
import { CategoryWithProductsDto, ProductResponseDto } from "shared";
import Button from "waitr-fe/src/base_components/Button/Button";

type ProductSelectionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number;
};

type SelectedProductType = {
  id: string;
  quantity: number;
};

const ProductSelectionPopup = ({
  isOpen,
  onClose,
  tableNumber,
}: ProductSelectionPopupProps) => {
  const { data: categories, isLoading } = useWaiterGetProductsQuery();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useWaiterCreateOrderMutation();

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<
    SelectedProductType[]
  >([]);

  // Reset selected products when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProducts([]);
    }
  }, [isOpen]);

  // Set first category as expanded when data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !expandedCategory) {
      setExpandedCategory(categories[0].categoryId);
    }
  }, [categories, expandedCategory]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setSelectedProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (p) => p.id === productId
      );

      if (existingProductIndex >= 0) {
        const updatedProducts = [...prevProducts];
        const newQuantity =
          updatedProducts[existingProductIndex].quantity + change;

        if (newQuantity <= 0) {
          // Remove product if quantity is 0 or negative
          return updatedProducts.filter((p) => p.id !== productId);
        } else {
          // Update quantity
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: newQuantity,
          };
          return updatedProducts;
        }
      } else if (change > 0) {
        // Add new product if it doesn't exist and change is positive
        return [...prevProducts, { id: productId, quantity: change }];
      }

      return prevProducts;
    });
  };

  const getProductQuantity = (productId: string): number => {
    const product = selectedProducts.find((p) => p.id === productId);
    return product ? product.quantity : 0;
  };

  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0 || !tableNumber) return;

    try {
      await createOrder({
        table: tableNumber,
        products: selectedProducts,
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const totalSelectedProducts = selectedProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h2>Adaugă produse la masa {tableNumber}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.categoriesContainer}>
          {isLoading ? (
            <p>Se încarcă produsele...</p>
          ) : categories && categories.length > 0 ? (
            categories.map((category: CategoryWithProductsDto) => (
              <div
                key={category.categoryId}
                className={styles.categoryAccordion}
              >
                <div
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category.categoryId)}
                >
                  <h3>{category.categoryName}</h3>
                  <span className={styles.expandIcon}>
                    {expandedCategory === category.categoryId ? "▼" : "►"}
                  </span>
                </div>

                {expandedCategory === category.categoryId && (
                  <div className={styles.productsContainer}>
                    {category.products.map((product: ProductResponseDto) => (
                      <div key={product.id} className={styles.productItem}>
                        <div className={styles.productInfo}>
                          <h4>{product.name}</h4>
                          <p className={styles.productPrice}>
                            {product.price.toFixed(2)} lei
                          </p>
                        </div>

                        <div className={styles.quantityControls}>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange(product.id, -1)}
                            disabled={getProductQuantity(product.id) === 0}
                          >
                            -
                          </button>
                          <span className={styles.quantity}>
                            {getProductQuantity(product.id)}
                          </span>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange(product.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nu există produse disponibile.</p>
          )}
        </div>

        <div className={styles.popupFooter}>
          <div className={styles.orderSummary}>
            <span>Produse selectate: {totalSelectedProducts}</span>
          </div>
          <Button
            text="Adaugă produsele la comandă"
            color="brand"
            wider
            tall
            onClick={handleCreateOrder}
            loading={isCreatingOrder}
            disabled={selectedProducts.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionPopup;
