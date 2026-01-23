"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in</p>;

  console.log("session in client", session.expires);

  return (
    <div>
      <h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </h1>

      <p>
        Go To <Link href="/profile/server">Server Profile</Link>
      </p>

      <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
        Logout
      </button>
    </div>
  );
}
