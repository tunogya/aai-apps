import NextAuth from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';

export const {
  handlers: {GET, POST},
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
    })
  ],
  callbacks: {
    jwt({token, profile}) {
      if (profile) {
        token.id = profile?.sub
        token.image = profile?.image
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property
  }
})