import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admins/location/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/create"!</div>
}
