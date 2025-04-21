"use client"

import { useSearchParams } from "next/navigation"

export default function NotFoundClient() {
  const params = useSearchParams()
  const query = params?.get("q") ?? ""

  return <p>Couldn't find anything for: <strong>{query}</strong></p>
}
