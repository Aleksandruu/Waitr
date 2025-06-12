import { createFileRoute } from "@tanstack/react-router";
import { useGetProductByIdQuery } from "waitr-fe/src/api/managerApi";
import CreateProduct from "waitr-fe/src/pages/Dashboard/Manager/CreateProduct/CreateProduct";

export const Route = createFileRoute(
  "/dashboard/manager/product/edit/$productId"
)({
  component: EditProductComponent,
});

function EditProductComponent() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);

  if (error || !product) {
    return (
      <div className="container">
        <div className="middle-column-container">
          <h1>Error</h1>
          <p>Nu s-a putut încărca produsul. Vă rugăm să încercați din nou.</p>
        </div>
      </div>
    );
  }

  return <CreateProduct product={product} isEditing={true} />;
}
