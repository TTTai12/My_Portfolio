# 📚 TUẦN 3 - AUTHENTICATION LEARNING GUIDE

**Mục tiêu:** Implement authentication system cho admin panel  
**Thời gian:** 16 giờ  
**Ngày bắt đầu:** 01/02/2026

---

## 🎯 OVERVIEW - AUTHENTICATION LÀ GÌ?

### Authentication vs Authorization

**Authentication (Xác thực):**

- "Bạn là ai?" - Verify identity
- Login với username/password
- Check credentials
- Issue token/session

**Authorization (Phân quyền):**

- "Bạn được làm gì?" - Verify permissions
- Check roles (admin, user, guest)
- Control access to resources
- Not implemented in Week 3 (future enhancement)

### Tại sao cần Authentication?

**Problem:**

```
❌ Hiện tại: Admin panel hoàn toàn public
   - Ai cũng vào được /projects, /skills, /about
   - Ai cũng có thể create, edit, delete
   - Không security, không tracking

✅ Sau Week 3: Bảo vệ admin panel
   - Chỉ admin login mới vào được
   - Guest redirect về login page
   - Tracking ai đang login
   - Secure session management
```

---

## 📋 ROADMAP CHI TIẾT

### Phase 1: Setup NextAuth (4 giờ) ✅

**Công việc:**

1. Install NextAuth.js library
2. Configure credentials provider
3. Setup API route handler
4. Create hardcoded user in .env
5. Configure session strategy

**Output:**

- Working authentication system
- API endpoint: `/api/auth/signin`, `/api/auth/signout`
- Session management

---

### Phase 2: Login Page (3 giờ)

**Công việc:**

1. Create login UI component
2. Handle form submission
3. Call NextAuth signIn
4. Handle success/error states
5. Implement redirects

**Output:**

- Beautiful login page
- Error messages
- Loading states
- Auto redirect after login

---

### Phase 3: Protect Routes (4 giờ)

**Công việc:**

1. Create middleware.ts
2. Check session on every request
3. Protect all admin routes
4. Add logout functionality
5. Handle unauthorized access

**Output:**

- Protected admin panel
- Auto redirect to login
- Logout button in header
- Session-based security

---

### Phase 4: Session Handling (3 giờ)

**Công việc:**

1. Display user info in header
2. Implement token refresh
3. Handle session expiry
4. Add client-side session check
5. Test full auth flow

**Output:**

- User info display
- Auto refresh tokens
- Handle expired sessions
- Smooth UX

---

### Phase 5: Environment Setup (2 giờ)

**Công việc:**

1. Create .env.example
2. Document all variables
3. Setup NEXTAUTH_SECRET
4. Security best practices
5. Git ignore setup

**Output:**

- Documented env vars
- Example files
- Security guidelines
- Team onboarding docs

---

## 🔍 NEXTAUTH.JS - DEEP DIVE

### Tại sao chọn NextAuth.js?

**Alternatives:**

```
1. Custom JWT authentication
   ❌ Phải tự code everything
   ❌ Security vulnerabilities
   ❌ Time-consuming

2. Firebase Auth
   ❌ External dependency
   ❌ Vendor lock-in
   ❌ Cost scaling

3. Auth0, Clerk
   ❌ Third-party service
   ❌ Monthly fees
   ❌ Complex setup

4. NextAuth.js ✅
   ✅ Built for Next.js
   ✅ Free, open-source
   ✅ Easy to setup
   ✅ Multiple providers support
   ✅ Production-ready
   ✅ Well documented
```

### NextAuth Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Login Form → Submit credentials                  │  │
│  │     ↓                                              │  │
│  │  signIn() from next-auth/react                    │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ POST /api/auth/callback/credentials
                        ↓
┌─────────────────────────────────────────────────────────┐
│              SERVER (Next.js API Routes)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  /api/auth/[...nextauth]/route.ts                 │  │
│  │     ↓                                              │  │
│  │  Credentials Provider                             │  │
│  │     ↓                                              │  │
│  │  authorize() function                             │  │
│  │     - Check username/password                     │  │
│  │     - Return user object or null                  │  │
│  │     ↓                                              │  │
│  │  Create Session                                   │  │
│  │     - Generate JWT token                          │  │
│  │     - Set secure cookie                           │  │
│  │     - Return session data                         │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ Session cookie (HTTP-only, Secure)
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  PROTECTED ROUTES                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware.ts                                    │  │
│  │     ↓                                              │  │
│  │  Check session cookie                             │  │
│  │     - Valid? → Allow access                       │  │
│  │     - Invalid? → Redirect to /auth/login          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Core Concepts

#### 1. Provider

**Là gì:**

- Cách thức authentication (Google, GitHub, Credentials, etc.)
- NextAuth hỗ trợ 50+ providers

**Ví dụ:**

```typescript
// Credentials Provider (username/password)
CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // Check credentials
    // Return user or null
  },
});
```

**Tuần 3 dùng:** Credentials Provider (đơn giản nhất)

#### 2. Session

**Là gì:**

- Data about logged-in user
- Stored in JWT token or database
- Accessible client-side and server-side

**Session Strategies:**

```typescript
// JWT Strategy (we'll use this)
session: {
  strategy: "jwt", // Store in encrypted JWT
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

// Database Strategy (alternative)
session: {
  strategy: "database", // Store in MongoDB
  maxAge: 30 * 24 * 60 * 60,
}
```

**Tại sao chọn JWT:**

- ✅ No database queries mỗi request
- ✅ Stateless (scalable)
- ✅ Fast
- ❌ Cannot revoke immediately (need expiry)

#### 3. Callbacks

**Là gì:**

- Functions called at specific points in auth flow
- Customize behavior

**Key Callbacks:**

```typescript
callbacks: {
  // Called when creating JWT
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },

  // Called when reading session
  async session({ session, token }) {
    session.user.id = token.id;
    session.user.role = token.role;
    return session;
  }
}
```

#### 4. Pages

**Là gì:**

- Custom auth pages (login, error, etc.)

```typescript
pages: {
  signIn: '/auth/login',  // Custom login page
  error: '/auth/error',   // Error page
  signOut: '/auth/logout' // Logout page
}
```

---

## 💻 CODE WALKTHROUGH

### 1. Installation

```bash
npm install next-auth
```

**Package bao gồm:**

- `next-auth` - Server-side logic
- `next-auth/react` - Client-side hooks
- `next-auth/jwt` - JWT utilities

### 2. Environment Variables

**File: `.env.local`**

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters

# Admin Credentials (Hardcoded for now)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**Giải thích:**

**`NEXTAUTH_URL`:**

- Base URL của app
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

**`NEXTAUTH_SECRET`:**

- Secret key để encrypt JWT
- Minimum 32 characters
- Generate: `openssl rand -base64 32`
- **CRITICAL:** Keep secret, never commit to git

**`ADMIN_USERNAME` & `ADMIN_PASSWORD`:**

- Hardcoded credentials (Week 3 only)
- Future: Move to database
- Use strong password

### 3. NextAuth Route Handler

**File: `app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verify credentials
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          // Return user object
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
            role: "admin",
          };
        }

        // Invalid credentials
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Code Breakdown:**

**Line 1-2:** Import NextAuth và types
**Line 5:** Export authOptions để reuse
**Line 6-21:** Credentials Provider configuration

- Define credentials fields
- `authorize()` function validates credentials
- Return user object if valid, null if invalid
  **Line 24-27:** Session configuration
- Use JWT strategy
- 30 days expiry
  **Line 29-42:** Callbacks
- `jwt()` - Add data to JWT token
- `session()` - Add data to session object
  **Line 44-46:** Custom pages
  **Line 48:** Secret for encryption
  **Line 51:** Export as GET and POST handlers

### 4. Login Page

**File: `app/auth/login/page.tsx`**

```typescript
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false, // Don't auto redirect
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else if (result?.ok) {
        // Success - redirect to dashboard
        router.push("/projects");
        router.refresh(); // Refresh to update session
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="w-full border p-2 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              className="w-full border p-2 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Key Points:**

**`signIn()` function:**

```typescript
signIn("credentials", {
  username: "...",
  password: "...",
  redirect: false, // Important!
});
```

- `"credentials"` - Provider name
- `redirect: false` - Manual redirect control
- Returns `{ ok: boolean, error: string }`

**Error Handling:**

- Show error message
- Disable form during loading
- Clear error on retry

### 5. Middleware Protection

**File: `middleware.ts` (root level)**

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Optional: Add custom logic
    console.log("Authenticated user:", req.nextauth.token);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if authorized
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/projects/:path*",
    "/skills/:path*",
    "/experience/:path*",
    "/education/:path*",
    "/about/:path*",
    "/messages/:path*",
  ],
};
```

**How it works:**

1. **Every request** to matched routes goes through middleware
2. **`authorized()` callback** checks if token exists
3. **If authorized:** Request proceeds
4. **If not authorized:** Auto redirect to `/auth/login`

**Matcher patterns:**

- `/projects/:path*` - Match `/projects`, `/projects/new`, `/projects/123/edit`, etc.
- No need to protect public routes (homepage, contact, etc.)

### 6. Session Usage

**Server Component:**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello, {session.user.name}</div>;
}
```

**Client Component:**

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not authenticated</div>;
  }

  return <div>Hello, {session.user.name}</div>;
}
```

### 7. Logout Button

```typescript
"use client";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="text-red-600 hover:underline"
    >
      Logout
    </button>
  );
}
```

---

## 📚 KIẾN THỨC CẦN ÔN

### 1. HTTP Cookies ⭐⭐⭐

**Là gì:**

- Small data stored in browser
- Sent with every HTTP request
- Used for session management

**Cookie Attributes:**

```
Set-Cookie: session=abc123;
  HttpOnly;        // Cannot access via JavaScript (XSS protection)
  Secure;          // Only send over HTTPS
  SameSite=Lax;    // CSRF protection
  Path=/;          // Available on all paths
  Max-Age=2592000  // Expire in 30 days
```

**Why Cookies:**

- Automatic inclusion in requests
- Secure storage
- Browser manages expiry

### 2. JWT (JSON Web Tokens) ⭐⭐⭐

**Structure:**

```
header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjEiLCJuYW1lIjoiQWRtaW4ifQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Parts:**

1. **Header:** Algorithm and type
2. **Payload:** User data (claims)
3. **Signature:** Verify integrity

**Decode vs Verify:**

```typescript
// Decode (anyone can do)
const decoded = jwt.decode(token);

// Verify (requires secret)
const verified = jwt.verify(token, secret);
```

**Security:**

- ✅ Stateless
- ✅ Cannot be modified without secret
- ❌ Cannot revoke until expiry
- ❌ Data is readable (base64, not encrypted)

### 3. Sessions vs Tokens

**Session-based (traditional):**

```
1. User logs in
2. Server creates session in database
3. Server sends session ID to client
4. Client sends session ID with requests
5. Server looks up session in DB
```

**Token-based (modern):**

```
1. User logs in
2. Server creates JWT token
3. Server sends token to client
4. Client sends token with requests
5. Server verifies token signature (no DB lookup)
```

**NextAuth JWT Strategy:**

- Uses token-based approach
- Token stored in secure cookie
- Best of both worlds

### 4. Environment Variables ⭐⭐

**Purpose:**

- Store secrets (API keys, passwords)
- Different values per environment
- Not committed to git

**Next.js Convention:**

```
.env.local        - Local development (gitignored)
.env.development  - Development defaults
.env.production   - Production defaults
.env              - Shared defaults
.env.example      - Template (committed to git)
```

**Access in code:**

```typescript
// Server-side only
process.env.NEXTAUTH_SECRET;

// Client-side (must prefix with NEXT_PUBLIC_)
process.env.NEXT_PUBLIC_API_URL;
```

### 5. Middleware in Next.js ⭐⭐

**Execution:**

```
User Request → Middleware → Route Handler → Response
               ↑
               Runs BEFORE route handler
```

**Use cases:**

- Authentication check
- Redirects
- Rewrite URLs
- Add headers
- Logging

**Performance:**

- Runs on Edge Runtime (fast)
- No Node.js APIs available
- Keep logic minimal

### 6. Client vs Server Components ⭐⭐⭐

**Server Components (default):**

```typescript
// No "use client" directive
export default async function ServerComponent() {
  const session = await getServerSession(authOptions);
  // Can access database directly
  // Cannot use hooks
  // Cannot use browser APIs
}
```

**Client Components:**

```typescript
"use client"; // Required
export default function ClientComponent() {
  const { data: session } = useSession();
  // Can use hooks
  // Can use browser APIs
  // Cannot access server-only modules
}
```

**When to use:**

- **Server:** Data fetching, security checks
- **Client:** Interactivity, user input, browser APIs

---

## 🔐 SECURITY BEST PRACTICES

### 1. Password Handling

**DO:**

```typescript
// Hash passwords before storing
import bcrypt from "bcrypt";
const hashedPassword = await bcrypt.hash(password, 10);

// Compare hashed passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

**DON'T:**

```typescript
// ❌ Never store plain text passwords
const user = { password: "123456" };

// ❌ Never compare plain text
if (password === user.password) {
}
```

**Week 3:** We use plain text (hardcoded in .env) for simplicity  
**Week 4+:** Move to database with hashed passwords

### 2. Secret Management

**DO:**

- Use strong, random secrets
- Different secrets per environment
- Rotate secrets periodically
- Never commit to git

**DON'T:**

- Use simple secrets
- Share secrets in code
- Reuse secrets across projects

### 3. Session Security

**DO:**

```typescript
session: {
  maxAge: 30 * 24 * 60 * 60, // Limit session duration
  updateAge: 24 * 60 * 60,   // Refresh session
}

cookies: {
  sessionToken: {
    name: "next-auth.session-token",
    options: {
      httpOnly: true,  // XSS protection
      sameSite: "lax", // CSRF protection
      path: "/",
      secure: true     // HTTPS only (production)
    }
  }
}
```

### 4. Input Validation

**Always validate:**

```typescript
async authorize(credentials) {
  // Validate input
  if (!credentials?.username || !credentials?.password) {
    return null;
  }

  // Sanitize input
  const username = credentials.username.trim().toLowerCase();

  // Check credentials
  // ...
}
```

---

## 🧪 TESTING CHECKLIST

### Manual Tests

**Login Flow:**

- [ ] Enter correct credentials → Should login
- [ ] Enter wrong password → Should show error
- [ ] Enter empty fields → Should show validation
- [ ] Click login → Should show loading state
- [ ] Successful login → Should redirect to dashboard

**Protected Routes:**

- [ ] Visit `/projects` without login → Redirect to login
- [ ] Login → Visit `/projects` → Should work
- [ ] Logout → Visit `/projects` → Redirect to login

**Session:**

- [ ] Login → Close browser → Reopen → Should still be logged in (cookie persists)
- [ ] Wait for session expiry → Should logout automatically
- [ ] Refresh page → Session should persist

**Edge Cases:**

- [ ] Multiple tabs → Logout in one → Should logout in all
- [ ] Network error during login → Should show error
- [ ] Session expires during browsing → Should redirect to login

---

## 📖 TÀI LIỆU THAM KHẢO

### Official Documentation

**NextAuth.js:**

- https://next-auth.js.org/getting-started/introduction
- https://next-auth.js.org/configuration/providers/credentials
- https://next-auth.js.org/configuration/callbacks

**Next.js Middleware:**

- https://nextjs.org/docs/app/building-your-application/routing/middleware

**JWT:**

- https://jwt.io/introduction

### Tutorials

**NextAuth Setup:**

- https://next-auth.js.org/tutorials/securing-pages-and-api-routes

**Authentication Patterns:**

- https://nextjs.org/docs/app/building-your-application/authentication

---

## ✅ DELIVERABLES - WEEK 3

### Code Files

**Created:**

- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `app/auth/login/page.tsx` - Login UI
- `middleware.ts` - Route protection
- `.env.example` - Environment template
- `components/LogoutButton.tsx` - Logout UI
- `lib/auth.ts` - Auth utilities

**Modified:**

- `components/layout/Header.tsx` - Add user info + logout
- `.gitignore` - Add .env.local

### Features

- ✅ Login with username/password
- ✅ Secure session management
- ✅ Protected admin routes
- ✅ Logout functionality
- ✅ User info display
- ✅ Auto redirect for unauthorized
- ✅ Error handling
- ✅ Loading states

### Documentation

- ✅ This learning guide
- ✅ Environment variables documented
- ✅ Setup instructions
- ✅ Security best practices

---

## 🎯 SUCCESS CRITERIA

**Week 3 là thành công khi:**

1. ✅ Admin login successfully với credentials
2. ✅ Cannot access admin routes without login
3. ✅ Auto redirect to login khi unauthorized
4. ✅ Logout works correctly
5. ✅ Session persists across page refreshes
6. ✅ User info displays in header
7. ✅ Error messages show correctly
8. ✅ No security vulnerabilities
9. ✅ Environment variables properly configured
10. ✅ Code is clean và documented

---

**Current Date:** 01/02/2026  
**Status:** Ready to begin implementation  
**Estimated Time:** 16 hours

Let's go! 🚀
