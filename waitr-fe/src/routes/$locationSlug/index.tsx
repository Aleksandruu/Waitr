import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locationSlug/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$locationSlug/"!</div>
}
