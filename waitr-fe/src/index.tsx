import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "./hooks/AuthProvider";
import React from "react";

export type RouterContext = {
  auth: {
    token: string | undefined;
    getRole(): string;
  };
};

const router = createRouter({
  routeTree,
  context: {} as RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

reportWebVitals();
