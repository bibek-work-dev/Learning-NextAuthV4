import NextAuth from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: { email: String; password: String }) {
        const res = await fetch("", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (!res.ok) {
          throw new Error("Login failed");
        }

        return {

        }
      },
    }),
    callbacks: {},
    session: {
    },
    pages: {}
  ],
});
