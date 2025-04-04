import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locationSlug/$tableNumber/order')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locationSlug/$tableNumber/order"!</div>
}
