'use client'
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-amber-500 text-xl text-black p-2 m-1 rounded-sm" onClick={() => signIn()}>Sign in</button>
    </>
  )
}