import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locationSlug/$tableNumber/place-order')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/$locationSlug/$tableNumber/place-order"!</div>
}
