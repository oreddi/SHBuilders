// Edge-safe config shared with middleware. The Credentials provider (which
// needs the database) is added in src/auth.js.
const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.sub;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/pm') || nextUrl.pathname.startsWith('/api/pm');
      
      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirects to login
      }
      return true;
    }
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true
};

export default authConfig;
