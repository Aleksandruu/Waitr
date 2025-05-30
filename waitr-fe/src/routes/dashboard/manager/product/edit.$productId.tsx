import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/manager/product/edit/$productId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/manager/product/edit/$productId"!</div>
}
