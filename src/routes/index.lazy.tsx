import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: () => <div className='w-20 bg-amber-950'>Hello!</div>,
})
