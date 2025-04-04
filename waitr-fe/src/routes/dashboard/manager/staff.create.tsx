import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/manager/staff/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/manager/staff/create"!</div>
}
