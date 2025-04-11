import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import ReactDOM from "react-dom/client";
import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";

export type RouterContext = {
  auth: {
    token: string | undefined;
    getRole(): string;
  };
};

export const router = createRouter({
  routeTree,
  context: {} as RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
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
