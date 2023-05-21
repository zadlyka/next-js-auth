import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const response = await fetch(`http://localhost:5000/auth`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        })
          .then(async (response) => {
            const data = await response.json()
            return data;
          })
          .catch((error) => {
            return null;
          });
        return response;
      },
    }),
  ],
  callbacks: {
    async jwt({ account, token, user }: any) {
      if (user) {
        token.accessToken = user.data.accessToken;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },

    async signIn({ account, profile, user, credentials }: any) {
      if(account.provider === "google") {
        const { id_token } = account
        const response = await fetch(`http://localhost:5000/oauth/google/token`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: id_token
          }),
        })
          .then(async (response) => {
            const data = await response.json()
            return data;
          })
          .catch((error) => {
            return null;
          });

        if(response) {
          user.data = response.data
        }
      }
      return true;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
