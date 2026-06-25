import CredentialsProvider from "next-auth/providers/credentials";

export default {
  providers: [
    CredentialsProvider({
      name: "Team Access",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@shbuilders.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded Role-Based Users (Bypasses broken database)
        const users = [
          { 
            id: "1", 
            name: "Admin User", 
            email: "admin@shbuilders.com", 
            password: process.env.PM_PASSWORD, // Uses the secure password from .env.local
            role: "ADMIN" 
          },
          { 
            id: "2", 
            name: "Field Team", 
            email: "team@shbuilders.com", 
            password: "fieldpassword123", // Viewer-only password
            role: "VIEWER" 
          }
        ];

        const user = users.find(
          u => u.email === credentials?.email && u.password === credentials?.password
        );

        if (user) {
          // Return user object WITHOUT the password
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }
        
        return null; // Invalid credentials
      }
    })
  ],
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
