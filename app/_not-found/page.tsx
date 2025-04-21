// app/not-found.tsx or app/_not-found/page.tsx

import { Suspense } from "react"
import NotFoundClient from "./not-found-page"

export default function NotFoundPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Page Not Found</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <NotFoundClient />
      </Suspense>
    </div>
  )
}
