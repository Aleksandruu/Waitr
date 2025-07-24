import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { socket } from "./socket";
import { generateColorVars } from "./helpers/generateColorVars";

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
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    generateColorVars(localStorage.getItem("locationColor")!);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <Provider store={store}>
      <InnerApp />
      {isConnected}
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
