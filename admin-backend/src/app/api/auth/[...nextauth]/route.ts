import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth configuration
 * Week 3: Simple credentials authentication with hardcoded user
 * Future: Expand to database-backed users with roles
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check against environment variables (Week 3 - hardcoded)
        // Future: Check against database with bcrypt password comparison
        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Return user object
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          };
        }

        // Invalid credentials
        return null;
      },
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt", // Use JWT tokens (stateless)
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  // Callbacks to customize behavior
  callbacks: {
    /**
     * JWT callback - called whenever JWT is created or updated
     * Add custom fields to JWT token
     */
    async jwt({ token, user }) {
      // Initial sign in - user object is available
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Type assertion for custom field
      }
      return token;
    },

    /**
     * Session callback - called whenever session is checked
     * Add custom fields to session object (available client-side)
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  // Custom pages
  pages: {
    signIn: "/auth/login", // Custom login page
    error: "/auth/error", // Error page (optional)
  },

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
};

// Export GET and POST handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
