import { useApiErrorRedirect } from "../routes/__root";
import { useEffect } from "react";
import { router } from "../index";

/**
 * Custom hook to automatically handle API errors and redirect to 404 page when needed
 *
 * @param error The error object from an API call
 * @returns An object with the handled status
 */
export const useAutoErrorHandler = (error: any) => {
  const { handleApiError } = useApiErrorRedirect();

  useEffect(() => {
    if (error) {
      // Only handle the error in the effect to avoid double handling
      if (is404Error(error)) {
        handleApiError(error);
      }
    }
  }, [error, handleApiError]);

  // Don't return the result of handleApiError directly to avoid double navigation
  return {
    wasHandled: error ? is404Error(error) : false,
  };
};

/**
 * Utility function to check if an error is a 404 error
 *
 * @param error The error object to check
 * @returns boolean indicating if it's a 404 error
 */
export const is404Error = (error: any): boolean => {
  return error?.response?.status === 404;
};

/**
 * Utility function to check if an error is a network error
 *
 * @param error The error object to check
 * @returns boolean indicating if it's a network error
 */
export const isNetworkError = (error: any): boolean => {
  return error?.message === "Network Error" || !error?.response;
};

/**
 * Navigate to the 404 page programmatically
 * This can be used outside of React components
 */
export const navigateTo404 = () => {
  router.navigate({ to: "/404", replace: true });
};
