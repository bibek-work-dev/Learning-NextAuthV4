import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const server = await getServerSession(authOptions);
  return (
    <div>
      {server ? (
        <h1>You are logged in {server.user.email}</h1>
      ) : (
        <h1>You are n't logged in</h1>
      )}
    </div>
  );
}
