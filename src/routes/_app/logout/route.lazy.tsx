import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/logout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/logout"!</div>
}
