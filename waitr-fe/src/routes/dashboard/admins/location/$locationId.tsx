import { createFileRoute } from '@tanstack/react-router'
import LocationPage from '../../../../pages/dashboard/admin/locationPage/LocationPage'

export const Route = createFileRoute('/dashboard/admins/location/$locationId')({
  component: LocationPage
})




