import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locationSlug/$tableNumber/feedback')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locationSlug/$tableNumber/feedback"!</div>
}
