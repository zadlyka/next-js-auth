import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { username, password }: any = credentials;
        let user: any = {};
        const accessToken = await fetch(`${process.env.API_URL}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
          }),
        })
          .then((res) => res.json())
          .then((data: any) => data.data.accessToken)
          .catch((error: any) => console.log(error));

        if (accessToken) {
          user = await fetch(`${process.env.API_URL}/auth`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => res.json())
            .then((data: any) => data.data)
            .catch((error: any) => console.log(error));

          return { ...user, accessToken };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account) {
        const { provider, id_token } = account;
        if (provider === "google") {
          const accessToken = await fetch(
            `${process.env.API_URL}/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: id_token,
              }),
            }
          )
            .then((res) => res.json())
            .then((data: any) => data.data.accessToken)
            .catch((error: any) => console.log(error));

          if (accessToken) {
            token.accessToken = accessToken;
            token.user = await fetch(`${process.env.API_URL}/auth`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            })
              .then((res) => res.json())
              .then((data: any) => data.data)
              .catch((error: any) => console.log(error));
          }
        } else if (provider === "credentials") {
          token.user = user;
          token.accessToken = user.accessToken;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      const { roles } = token.user;
      const data = roles.map(({ id, name, permissions }: any) => ({
        id,
        name,
        permissions,
      }));
      
      session.accessToken = token.accessToken;
      session.user = {
        id: token.user.id,
        name: token.user.name,
        email: token.user.email,
        roles: data,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
