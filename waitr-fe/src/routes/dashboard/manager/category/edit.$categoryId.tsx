import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/manager/category/edit/$categoryId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/manager/category/edit/$categoryId"!</div>
}
