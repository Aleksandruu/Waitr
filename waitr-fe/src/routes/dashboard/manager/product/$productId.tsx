import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/manager/product/$productId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/manager/product/$productId"!</div>
}
