# 📚 HƯỚNG DẪN ĐỒNG BỘ CRUD - CHI TIẾT KỸ THUẬT

## 🎯 MỤC LỤC

1. [Tổng quan kiến trúc CRUD](#1-tổng-quan-kiến-trúc)
2. [Backend API Pattern](#2-backend-api-pattern)
3. [Frontend Form Pattern](#3-frontend-form-pattern)
4. [Data Flow Complete](#4-data-flow-complete)
5. [Best Practices & Optimization](#5-best-practices)

---

## 1. TỔNG QUAN KIẾN TRÚC

### 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ Admin Pages  │ ───▶ │ Form Components│              │
│  └──────────────┘      └──────────────┘                │
│         │                      │                        │
│         ▼                      ▼                        │
│  ┌─────────────────────────────────────┐               │
│  │     Fetch API (HTTP Requests)       │               │
│  └─────────────────────────────────────┘               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTP (JSON)
                   │
┌──────────────────▼──────────────────────────────────────┐
│                BACKEND (Next.js API)                    │
│  ┌─────────────────────────────────────────┐           │
│  │        API Route Handlers               │           │
│  │  GET, POST, PUT, DELETE                 │           │
│  └────────────┬────────────────────────────┘           │
│               │                                         │
│               ▼                                         │
│  ┌─────────────────────────────────────────┐           │
│  │      Mongoose Models (Schema)           │           │
│  └────────────┬────────────────────────────┘           │
└───────────────┼─────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────┐
│              MongoDB Atlas Database                   │
│  Collections: projects, skills, about, etc.           │
└───────────────────────────────────────────────────────┘
```

### 📊 **CRUD Operations Map**

| Operation    | HTTP Method | Route               | Purpose                |
| ------------ | ----------- | ------------------- | ---------------------- |
| **Create**   | POST        | `/api/[model]`      | Tạo document mới       |
| **Read All** | GET         | `/api/[model]`      | Lấy tất cả documents   |
| **Read One** | GET         | `/api/[model]/[id]` | Lấy 1 document theo ID |
| **Update**   | PUT         | `/api/[model]/[id]` | Cập nhật document      |
| **Delete**   | DELETE      | `/api/[model]/[id]` | Xóa document           |

---

## 2. BACKEND API PATTERN

### 🔵 **A. CREATE (POST) - Tạo mới**

**File:** `admin-backend/src/app/api/[model]/route.ts`

```typescript
import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Model from "@/src/lib/models/Model";

export async function POST(req: Request) {
  // 1. Connect to database
  await connectDB();

  // 2. Parse request body (JSON from frontend)
  const body = await req.json();

  try {
    // 3. Create document using Mongoose
    const document = await Model.create(body);

    // 4. Return created document (with _id, timestamps)
    return NextResponse.json(document);
  } catch (error: any) {
    // 5. Handle errors (validation, duplicate, etc.)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**🔍 Giải thích từng bước:**

1. **`await connectDB()`**:
   - Kết nối MongoDB Atlas
   - Singleton pattern - chỉ connect 1 lần
   - Reuse connection cho requests sau

2. **`await req.json()`**:
   - Parse JSON body từ HTTP request
   - Example input: `{ title: "My Project", tech: ["React"] }`
   - Async operation vì body có thể lớn

3. **`Model.create(body)`**:
   - Mongoose method tạo document
   - Tự động validate theo schema
   - Tự động thêm `_id`, `createdAt`, `updatedAt`

4. **`NextResponse.json(document)`**:
   - Return created document về frontend
   - Status 200 (default)
   - Frontend nhận được object với `_id`

5. **Error Handling**:
   - Catch validation errors (required fields)
   - Duplicate key errors (unique fields)
   - Return status 500 + error message

---

### 🔵 **B. READ ALL (GET) - Lấy tất cả**

```typescript
export async function GET() {
  // 1. Connect database
  await connectDB();

  // 2. Find all documents (no filter = all)
  const documents = await Model.find();

  // 3. Return array of documents
  return NextResponse.json(documents);
}
```

**🔍 Giải thích:**

- **`Model.find()`**:
  - No arguments = lấy tất cả
  - Return array: `[{_id: "...", ...}, {...}]`
  - Sorted by `_id` (insertion order) by default

**⚡ Optimization Options:**

```typescript
// Sort by newest first
const documents = await Model.find().sort({ createdAt: -1 });

// Limit results
const documents = await Model.find().limit(100);

// Select specific fields only
const documents = await Model.find().select("title tech");

// Pagination
const page = 1,
  limit = 10;
const documents = await Model.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

---

### 🔵 **C. READ ONE (GET) - Lấy 1 document**

**File:** `admin-backend/src/app/api/[model]/[id]/route.ts`

```typescript
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  // 1. Extract ID from URL params (Next.js 15 pattern)
  const { id } = await context.params;

  // 2. Find document by MongoDB _id
  const document = await Model.findById(id);

  // 3. Handle not found case
  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4. Return found document
  return NextResponse.json(document);
}
```

**🔍 Giải thích:**

1. **`context.params`**:
   - Next.js 15+ returns Promise
   - Must `await` to get actual params object
   - Contains URL dynamic segments: `[id]`

2. **`findById(id)`**:
   - Mongoose helper = `find({ _id: id })`
   - Automatically converts string to ObjectId
   - Returns `null` if not found

3. **404 Handling**:
   - Important for UX
   - Frontend can show "Project not found" message
   - Different from 500 (server error)

**⚠️ Common Mistake:**

```typescript
// ❌ Old Next.js pattern (Next.js 13-14)
const { id } = context.params; // Error in Next.js 15!

// ✅ New Next.js 15 pattern
const { id } = await context.params;
```

---

### 🔵 **D. UPDATE (PUT) - Cập nhật**

```typescript
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  // 1. Get ID from URL
  const { id } = await context.params;

  // 2. Get update data from body
  const body = await req.json();

  // 3. Update and return NEW document
  const updated = await Model.findByIdAndUpdate(
    id, // Which document to update
    body, // What to update
    { new: true }, // Return updated doc (not old)
  );

  // 4. Return updated document
  return NextResponse.json(updated);
}
```

**🔍 Giải thích:**

1. **`findByIdAndUpdate(id, body, options)`**:
   - **id**: Document cần update
   - **body**: Fields cần thay đổi (partial update OK)
   - **options**: `{ new: true }` = return updated doc

2. **Partial Update**:

   ```javascript
   // Frontend chỉ gửi fields cần update:
   {
     title: "New Title";
   }

   // Mongoose chỉ update field đó, giữ nguyên các fields khác
   ```

3. **Automatic `updatedAt`**:
   - Mongoose tự động update timestamp
   - Nếu schema có `timestamps: true`

**⚡ Advanced Options:**

```typescript
// With validation
const updated = await Model.findByIdAndUpdate(id, body, {
  new: true,
  runValidators: true, // Run schema validators on update
});

// Upsert (create if not exist)
const updated = await Model.findByIdAndUpdate(id, body, {
  new: true,
  upsert: true, // Create if ID not found
});
```

---

### 🔵 **E. DELETE - Xóa**

```typescript
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();

  // 1. Get ID
  const { id } = await context.params;

  // 2. Delete document
  await Model.findByIdAndDelete(id);

  // 3. Return success message
  return NextResponse.json({
    message: "Deleted successfully",
  });
}
```

**🔍 Giải thích:**

- **`findByIdAndDelete(id)`**:
  - Find và delete trong 1 operation
  - Return deleted document (có thể ignore)
  - Không throw error nếu ID không tồn tại

**⚡ Alternative Pattern (với error check):**

```typescript
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await context.params;

  // Get document trước khi xóa
  const document = await Model.findByIdAndDelete(id);

  // Check if existed
  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Deleted successfully",
    deleted: document, // Return deleted data
  });
}
```

---

## 3. FRONTEND FORM PATTERN

### 🟢 **A. Form Component Structure**

**File:** `admin-backend/src/components/forms/[Model]Form.tsx`

```typescript
"use client";
import React, { useState } from "react";

// 1. Define TypeScript type for form data
export type ProjectFormData = {
  title: string;
  description: string;
  tech: string[];      // Array of technologies
  codeUrl: string;
  liveUrl: string;
};

// 2. Props interface
type Props = {
  initialData?: Partial<ProjectFormData>;  // For edit mode
  onSubmit: (data: ProjectFormData) => Promise<void> | void;
  submitLabel?: string;  // "Create" or "Update"
  disabled?: boolean;
};

export default function ProjectForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: Props) {
  // 3. Form state (controlled components)
  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    techText: initialData?.tech?.join(", ") ?? "",  // Array to string
    codeUrl: initialData?.codeUrl ?? "",
    liveUrl: initialData?.liveUrl ?? "",
  });

  // 4. UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 5. Generic change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 6. Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      // Transform data (string to array)
      const payload: ProjectFormData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tech: formData.techText
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),  // Remove empty strings
        codeUrl: formData.codeUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
      };

      // Call parent handler (async)
      await onSubmit(payload);

    } catch (err: any) {
      setError(err?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  // 7. JSX Form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 p-3 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project title"
          className="border p-2 w-full rounded"
          disabled={disabled || loading}
          required
        />
      </div>

      {/* More fields... */}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        disabled={disabled || loading}
      >
        {loading ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
```

**🔍 Giải thích chi tiết từng phần:**

#### **1. TypeScript Type Definition**

```typescript
export type ProjectFormData = {
  title: string;
  description: string;
  tech: string[];
  codeUrl: string;
  liveUrl: string;
};
```

**Tại sao cần:**

- Type safety: Prevent bugs at compile time
- IntelliSense: VS Code autocomplete
- Documentation: Self-documenting code
- Reusability: Share types giữa form và pages

**Best Practice:**

```typescript
// ✅ Export type để reuse
export type ProjectFormData = {...}

// ✅ Match với Mongoose schema
// Model: { title: String, tech: [String] }
// Type:  { title: string, tech: string[] }
```

#### **2. Props Interface**

```typescript
type Props = {
  initialData?: Partial<ProjectFormData>; // Optional, for edit
  onSubmit: (data: ProjectFormData) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
};
```

**Giải thích:**

- **`initialData?: Partial<...>`**:
  - `?` = Optional (undefined OK for create mode)
  - `Partial<T>` = All fields optional (TypeScript utility)
  - Use case: Edit mode truyền existing data

- **`onSubmit: (data) => Promise<void> | void`**:
  - Function prop nhận data
  - Can be async (Promise) hoặc sync (void)
  - Parent component handle API call

- **`submitLabel?: string`**:
  - Customize button text: "Create" vs "Update"
  - Default: "Save"

#### **3. Form State**

```typescript
const [formData, setFormData] = useState({
  title: initialData?.title ?? "",
  techText: initialData?.tech?.join(", ") ?? "",
  // ...
});
```

**Pattern:**

- **Single object state** (không phải multiple useState)
- **Optional chaining**: `initialData?.title` (safe navigation)
- **Nullish coalescing**: `?? ""` (fallback to empty string)

**Tại sao không dùng multiple useState:**

```typescript
// ❌ Bad: Too many states
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [tech, setTech] = useState("");
// ...

// ✅ Good: Single state object
const [formData, setFormData] = useState({...});
```

**Lợi ích:**

- Ít re-renders
- Easy to reset form: `setFormData(initialState)`
- One source of truth

#### **4. UI State**

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

**Purpose:**

- **loading**: Show spinner, disable inputs during submit
- **error**: Display error message to user

**UX Pattern:**

```typescript
Submit clicked
  → setLoading(true)
  → Disable button
  → Call API
  → Success: Redirect
  → Error: setError(message)
  → setLoading(false)
```

#### **5. Generic Change Handler**

```typescript
const handleChange = (e: React.ChangeEvent<...>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

**Magic:**

- **`[e.target.name]`**: Dynamic key (computed property)
- Works với tất cả inputs có `name` attribute
- One handler for all fields!

**Example:**

```tsx
<input name="title" onChange={handleChange} />
// → updates formData.title

<input name="description" onChange={handleChange} />
// → updates formData.description
```

**Alternative (individual handlers):**

```typescript
// ❌ Verbose
const handleTitleChange = (e) => setTitle(e.target.value);
const handleDescChange = (e) => setDesc(e.target.value);

// ✅ DRY principle
const handleChange = (e) => {...};
```

#### **6. Submit Handler - Validation**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Stop browser default submit
  setError("");
  setLoading(true);

  try {
    // Client-side validation
    if (!formData.title.trim()) {
      throw new Error("Title is required");
    }

    // Transform data
    const payload: ProjectFormData = {
      title: formData.title.trim(),
      tech: formData.techText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      // ...
    };

    await onSubmit(payload);
  } catch (err: any) {
    setError(err?.message || "Submit failed");
  } finally {
    setLoading(false); // Always reset
  }
};
```

**Flow:**

1. **`e.preventDefault()`**:
   - Stop page reload
   - SPA behavior

2. **Reset error state**:
   - Clear previous error
   - Clean slate

3. **Set loading**:
   - UI feedback
   - Disable button

4. **Validation**:
   - Client-side (fast feedback)
   - Server will validate too (security)

5. **Data transformation**:

   ```javascript
   // UI: "React, Next.js, TypeScript"
   // → API: ["React", "Next.js", "TypeScript"]

   formData.techText
     .split(",") // ["React", " Next.js", " TypeScript"]
     .map((t) => t.trim()) // ["React", "Next.js", "TypeScript"]
     .filter(Boolean); // Remove empty strings
   ```

6. **Call parent**:
   - Parent có logic API call
   - Separation of concerns

7. **Error handling**:
   - Display message
   - Don't crash app

8. **Finally block**:
   - Always runs
   - Reset loading (cả success lẫn error)

---

### 🟢 **B. Page Components (Admin Pages)**

#### **CREATE Page**

**File:** `admin-backend/src/app/projects/new/page.tsx`

```typescript
"use client";
import { useRouter } from "next/navigation";
import ProjectForm, { ProjectFormData } from "@/src/components/forms/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();

  const handleCreate = async (data: ProjectFormData) => {
    // 1. Call API
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // 2. Handle errors
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Create failed");
    }

    // 3. Redirect on success
    router.push("/projects");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
      <ProjectForm
        onSubmit={handleCreate}
        submitLabel="Create"
      />
    </div>
  );
}
```

**Flow:**

```
User fills form
  ↓
Click "Create"
  ↓
handleCreate called
  ↓
POST /api/projects
  ↓
Success: Redirect to /projects list
Error: Show message in form
```

#### **UPDATE Page**

**File:** `admin-backend/src/app/projects/[id]/edit/page.tsx`

```typescript
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectForm, { ProjectFormData } from "@/src/components/forms/ProjectForm";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // 1. State for existing data
  const [initialData, setInitialData] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch existing data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load");

        const project = await res.json();
        setInitialData(project);
      } catch (err) {
        alert("Failed to load project");
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 3. Update handler
  const handleUpdate = async (data: ProjectFormData) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Update failed");
    }

    router.push("/projects");
  };

  // 4. Loading state
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // 5. Render form with initial data
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      {initialData && (
        <ProjectForm
          initialData={initialData}
          onSubmit={handleUpdate}
          submitLabel="Update"
        />
      )}
    </div>
  );
}
```

**Flow:**

```
Page loads
  ↓
useEffect runs
  ↓
GET /api/projects/[id]
  ↓
setInitialData
  ↓
Form renders with existing values
  ↓
User edits
  ↓
Click "Update"
  ↓
PUT /api/projects/[id]
  ↓
Redirect to list
```

---

## 4. DATA FLOW COMPLETE

### 🔄 **CREATE Flow (End-to-End)**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER INTERACTION                                         │
│    User fills form: { title: "My App", tech: "React" }     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FORM COMPONENT (ProjectForm.tsx)                        │
│    - Validate: title required                              │
│    - Transform: "React, Node" → ["React", "Node"]          │
│    - Call: onSubmit(payload)                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. PAGE COMPONENT (new/page.tsx)                           │
│    - Receive payload from form                             │
│    - HTTP POST /api/projects                               │
│    - Body: JSON.stringify(payload)                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Network (HTTP POST)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. API ROUTE (/api/projects/route.ts)                      │
│    - Parse: req.json()                                     │
│    - Connect: connectDB()                                  │
│    - Create: Project.create(body)                          │
│    - Return: NextResponse.json(document)                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. MONGOOSE MODEL (models/Project.ts)                      │
│    - Validate against schema                               │
│    - Add _id, timestamps                                   │
│    - Save to MongoDB                                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. DATABASE (MongoDB Atlas)                                │
│    - Insert document into "projects" collection            │
│    - Return: { _id: "...", title: "My App", ... }         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Response flows back up
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. PAGE COMPONENT                                           │
│    - Receive: res.json() → created document                │
│    - Success: router.push("/projects")                     │
│    - Redirect to list page                                 │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 **UPDATE Flow**

```
Page Load:
  GET /api/projects/[id]
    → Fetch existing data
    → Populate form with initialData

User Edits:
  User changes title: "My App" → "My Awesome App"
    → formData.title updates (controlled input)

User Submits:
  Click "Update"
    → Validate
    → PUT /api/projects/[id] with modified data
    → findByIdAndUpdate
    → Redirect to list
```

---

## 5. BEST PRACTICES

### ✅ **A. Error Handling Pattern**

#### **Backend:**

```typescript
// 1. Structured errors
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const doc = await Model.create(body);
    return NextResponse.json(doc);
  } catch (error: any) {
    console.error("Create error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message, fields: error.errors },
        { status: 400 },
      );
    }

    // Duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "Duplicate entry" }, { status: 409 });
    }

    // Generic error
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
```

#### **Frontend:**

```typescript
const handleCreate = async (data: FormData) => {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Check HTTP status
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    const created = await res.json();

    // Success
    router.push("/projects");
  } catch (err: any) {
    // Network error, JSON parse error, etc.
    console.error("Submit error:", err);
    throw err; // Re-throw to form component
  }
};
```

### ✅ **B. TypeScript Consistency**

```typescript
// 1. Mongoose Schema
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  tech: [String],
  codeUrl: String,
});

// 2. TypeScript Type (match schema)
export type ProjectFormData = {
  title: string; // Required in schema
  tech: string[]; // Array in schema
  codeUrl: string; // Optional in schema
};

// 3. API Response Type
export type ProjectDocument = ProjectFormData & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
```

### ✅ **C. Loading States**

```typescript
// List page with loading
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{/* Render projects */}</div>;
```

### ✅ **D. Optimistic Updates (Advanced)**

```typescript
const handleDelete = async (id: string) => {
  // 1. Optimistically remove from UI
  const backup = projects;
  setProjects((prev) => prev.filter((p) => p._id !== id));

  try {
    // 2. Call API
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
  } catch (err) {
    // 3. Rollback on error
    setProjects(backup);
    alert("Delete failed");
  }
};
```

### ✅ **E. Validation Layers**

```
Frontend Validation (Fast feedback)
  ↓
Backend Validation (Security)
  ↓
Database Constraints (Data integrity)
```

**Example:**

```typescript
// 1. Frontend (Form)
if (!formData.title.trim()) {
  throw new Error("Title is required");
}

// 2. Backend (API)
const body = await req.json();
if (!body.title) {
  return NextResponse.json({ error: "Title required" }, { status: 400 });
}

// 3. Database (Schema)
const schema = new Schema({
  title: { type: String, required: true, minlength: 3 },
});
```

---

## 📊 SUMMARY TABLE

| Layer          | Technology             | Responsibility                  |
| -------------- | ---------------------- | ------------------------------- |
| **Database**   | MongoDB Atlas          | Store data, enforce constraints |
| **Model**      | Mongoose               | Schema, validation, queries     |
| **API Routes** | Next.js Route Handlers | HTTP endpoints, business logic  |
| **Forms**      | React Components       | UI, client validation, state    |
| **Pages**      | Next.js Pages          | Layout, API calls, routing      |

**Data Types Flow:**

```
User Input (string)
  → Form State (controlled)
  → FormData Type (TypeScript)
  → JSON (HTTP)
  → Request Body (API)
  → Mongoose Model (validation)
  → MongoDB Document (BSON)
```

---

**Generated:** Chi tiết kỹ thuật CRUD đầy đủ  
**Purpose:** Giúp hiểu rõ từng layer, từng pattern trong stack  
**Next:** Apply pattern này cho tất cả models (Projects, Skills, About, etc.)
