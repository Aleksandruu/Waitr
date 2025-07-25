import { Decorator } from "@storybook/react";
import {
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import React from "react";

export const RouterDecorator: Decorator = (Story) => {
  const rootRoute = createRootRoute({
    component: () => <Story />,
  });

  const routeTree = rootRoute;

  const router = createRouter({
    routeTree,
  });

  return <RouterProvider router={router} />;
};
