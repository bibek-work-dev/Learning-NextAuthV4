import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// The philosopny of next auth is you tell me who the user is. I'll handle session plumbing.
// authorize run once. callbacks run forever
// jwt is token lifecycle
// session is client exposure.

// authorize → jwt → session → client
// jwt acts as a source of truth
// session is just a projection of jwt for the browser

// Cookie → jwt() → session() → client

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // authorize is not a controller, token validator or session creator
      // It is just like give me some credentails Like user object or return null/throw
      // Next auth expects one of the three outcomes.
      // either return null or throw a error or return the truthy object which means auth success
      // The minimun requirement to return is { id: string } everything else is optional
      // (We reutrn accessToken, refreshToken and things like that. we did for out convenience, Next auth doesn't care about that)
      // and that return object is user
      // in the eye of next auth and pass it into jwt function and session function later. The return object is just input to the
      // callback pipeling. that is it.

      // authorize()
      //   ↓ (return user)
      // jwt({ token, user })   ← first time ONLY
      //   ↓
      // jwt({ token })         ← on every request
      //   ↓
      // session({ session, token })

      // Thing authorize shouldn't not do
      // call refresh endpoints, know anything about expiry, decode JWT's, manage session, store cookies (this should happen in jwt and session. and they are both called callbacks)

      async authorize(credentials) {
        // it should return true or user object.
        // runs only one time in sign-in that is it. token that we return from here must be manualy copied into the JWT
        console.log("credentials", credentials);

        const query = `
        mutation Mutation($loginInput: LoginInput!) {
          login(loginInput: $loginInput) {
              accessToken
              refreshToken
              user {
                id
                name
                email
              }
            }
          }
            `;

        console.log(
          "authorize",
          query,
          process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        );

        const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            variables: {
              loginInput: {
                email: credentials?.email,
                password: credentials?.password,
              },
            },
          }),
        });

        console.log("res", res);

        const json = await res.json();

        console.log("json", json);

        if (!res.ok || json.errors) {
          throw new Error(json.errors?.[0]?.message || "Login failed");
        }

        const data = json.data.login;

        // there lot will acts as a user in jwt also.(it will act as a user depsite not being it). From next auth POV, whatever we return is user.
        return {
          id: data.user.id, // this is the bare minimum that shouyld be returned. Whatever other than id is return, it is our personal choice to do that.()
          name: data.user.name,
          email: data.user.email,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // From NextAuth POV, it is a hook that let us define what get presisted between requests So it isn't any other things like
    // token verification logic, jwt signing logic, cryptography, etc.
    // when the data comes here, it is already encrypted. We only decide what data should live inside it. That is it.
    async jwt({
      token, // persisted state and it is also jwt payload.
      user, // only on login // first time we just see whatever is returned from authorize
    }) {
      // token lives here, expiry is checked here, refresh is also triggered here
      // revocation logic hooks lives here, session length is controlled here
      console.log("user and token in callbacks", user, token);
      if (user) {
        // you see since you see user just in login, anything we want later
        // must be copied to token and next auth will data system field like iat, exp and other itself.
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    // the goal of session is just to expose what clieht in browser can see. that is it.
    // It is just a projection layer. tha goal is to copy from token to session.
    // Here nothing should be done at all. ok, just projection that is it.
    async session({ session, token }) {
      console.log("session in callbacks ", session, token);
      // there are options to hide the accessToken to client or not. Le't say if
      // forntend task to backend using route handler then no need to expose AT
      // but what if frontend calls external API directly ? then we do need to
      // expose accessToken directly
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },
  session: {
    strategy: "jwt", // or database, it means where the session truth will live
  },

  // It is like if you even need to send the user to a built in page, use this route instead
  pages: {
    // it is aobut not showing NextAuth's ugly default screen. We are telling NextAuth to use our screen byt this.
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/welcome",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
