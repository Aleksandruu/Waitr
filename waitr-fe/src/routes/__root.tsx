import {
  createRootRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

// Custom hook to handle API errors and redirect to 404
export const useApiErrorRedirect = () => {
  const navigate = useNavigate();

  return {
    handleApiError: (error: any) => {
      // Check if the error is a 404 response from the backend
      if (error?.response?.status === 404) {
        navigate({ to: "/404" });
        return true;
      }
      return false;
    },
  };
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    // Redirect to our custom 404 page for any unmatched routes
    const navigate = useNavigate();

    useEffect(() => {
      // Use replace: true to avoid adding to the history stack
      navigate({ to: "/404", replace: true });
    }, [navigate]);

    return null;
  },
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
