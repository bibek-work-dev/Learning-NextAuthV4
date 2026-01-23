import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import LogoutButton from "./Logout-button";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) return <p>Not logged in</p>;
  console.log("here in server components");

  return (
    <div>
      <h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </h1>

      <p>
        Go to <Link href="/profile/client">Client Profile</Link>
      </p>

      <Link href="/auth/login">
        <LogoutButton></LogoutButton>
      </Link>
    </div>
  );
}
