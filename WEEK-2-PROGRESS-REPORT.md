# 📋 TUẦN 2 - PROGRESS REPORT & LEARNING GUIDE

**Ngày:** 25/01/2026  
**Mục tiêu:** Add TypeScript types + Backend validation + Error handling

---

## 🎯 ĐANG LÀM PHẦN NÀO?

### ✅ HOÀN THÀNH (30 phút đầu)

#### 1. TypeScript Types - DONE ✅

**File created:** `admin-backend/src/types/index.ts` (300+ dòng)

**Những gì đã làm:**

```typescript
// ĐÃ TẠO CÁC TYPES:

// 1. Base Types
BaseDocument; // _id, createdAt, updatedAt
ApiSuccessResponse<T>; // Wrapper cho API success
ApiErrorResponse; // Wrapper cho API error
ApiResponse<T>; // Union type

// 2. Model Types (cho mỗi model)
ProjectData; // Pure data (no MongoDB fields)
ProjectDocument; // Data + BaseDocument
ProjectFormData; // For forms
ProjectFormDataPartial; // For editing

// Tương tự cho: About, Skill, Experience, Education, Message

// 3. Component Props Types
FormProps<T>; // Generic form props
ProjectFormProps; // Specific form props
AboutFormProps;
SkillFormProps;
ExperienceFormProps;
EducationFormProps;

// 4. State Management Types
LoadingState; // isLoading, error
DataState<T>; // data + LoadingState
ListState<T>; // items[] + LoadingState + pagination

// 5. Validation Types
ValidationError; // {field, message}
ValidationErrors; // Record<string, string[]>
```

**Các file đã update để dùng types:**

- ✅ `ProjectForm.tsx` - Import từ `@/types`
- ✅ `AboutForm.tsx` - Import từ `@/types`
- ✅ `ExperienceForm.tsx` - Import từ `@/types`
- ✅ `EducationForm.tsx` - Import từ `@/types`
- ✅ `skillsForm.tsx` - Import từ `@/types`

**Đã fix:**

- ✅ `tsconfig.json` - Update path alias: `"@/*": ["./src/*"]`
- ✅ Remove duplicate type definitions trong mỗi form
- ✅ No TypeScript errors

---

### ⏳ ĐANG LÀM (Stopped tại đây)

#### 2. Install Zod - PENDING

**Lệnh cần chạy:**

```bash
cd admin-backend
npm install zod
```

**Status:** User cancelled terminal command

---

### 📝 CÒN LẠI (Chưa làm)

- [ ] Create Zod schemas cho validation
- [ ] Update API routes với Zod validation
- [ ] Improve Mongoose schemas
- [ ] Add frontend error handling

---

## 🔍 THAY ĐỔI NHỮNG GÌ?

### A. Trước khi refactor

**Form Components (Old):**

```typescript
// Mỗi file tự định nghĩa types riêng
// ProjectForm.tsx
export type ProjectFormData = {
  title: string;
  description: string;
  tech: string[];
  codeUrl: string;
  liveUrl: string;
};

type Props = {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
};
```

**Vấn đề:**

- ❌ Duplicate code (6 forms, 6 lần định nghĩa tương tự)
- ❌ Không consistent (mỗi form khác nhau)
- ❌ Khó maintain (sửa 1 chỗ phải sửa nhiều file)
- ❌ Không có types cho API responses
- ❌ Không có types cho MongoDB documents

### B. Sau khi refactor

**Centralized Types:**

```typescript
// admin-backend/src/types/index.ts (1 file duy nhất)

// Tách riêng Data vs Document
export interface ProjectData {
  title: string;
  description: string;
  tech: string[];
  codeUrl: string;
  liveUrl: string;
}

export interface ProjectDocument extends ProjectData, BaseDocument {
  // Tự động có: _id, createdAt, updatedAt
}

// Generic props pattern
export interface FormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export type ProjectFormProps = FormProps<ProjectFormData>;
```

**Form Components (New):**

```typescript
// ProjectForm.tsx
import type { ProjectFormData, ProjectFormProps } from "@/types";

type Props = ProjectFormProps; // Xong!
```

**Lợi ích:**

- ✅ DRY (Don't Repeat Yourself)
- ✅ Single Source of Truth
- ✅ Type safety toàn project
- ✅ Easy to maintain
- ✅ Scalable architecture

---

## 💡 VÌ SAO LẠI CHỌN CÁCH NÀY?

### 1. Centralized Types Pattern

**Lý do chọn:**

#### A. Industry Best Practice

```
Cấu trúc chuẩn trong React/Next.js projects:

src/
  types/
    index.ts      ← Central type definitions
  components/
    *.tsx         ← Import types
  app/
    api/
      *.ts        ← Import types
  lib/
    models/
      *.ts        ← Import types
```

**Tại sao tốt:**

- Mọi người biết tìm types ở đâu
- Consistent naming conventions
- Easy onboarding cho new developers

#### B. Type Reusability

**Ví dụ:**

```typescript
// 1 type definition → dùng ở nhiều chỗ

// types/index.ts
export interface ProjectData { ... }

// ↓ DÙNG Ở:

// Form component
import { ProjectData } from "@/types";

// API route
import { ProjectData } from "@/types";

// Frontend page
import { ProjectData } from "@/types";

// Service layer
import { ProjectData } from "@/types";
```

**Lợi ích:**

- Sửa 1 lần, apply toàn project
- Không bao giờ bị mismatch
- TypeScript compile-time checking

#### C. Separation of Concerns

**Pattern:**

```typescript
// Data = Business logic
interface ProjectData {
  title: string;
  description: string;
  // ...
}

// Document = Data + Database metadata
interface ProjectDocument extends ProjectData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// FormData = Data + UI concerns
type ProjectFormData = ProjectData;

// FormProps = Component API
type ProjectFormProps = FormProps<ProjectFormData>;
```

**Tại sao tách:**

- **Data**: Pure business logic, không care DB hay UI
- **Document**: MongoDB-specific, có timestamps
- **FormData**: UI-specific, có thể khác Data
- **FormProps**: Component contract

**Ví dụ thực tế:**

```typescript
// Backend API trả về Document (có _id, timestamps)
GET /api/projects/123 → ProjectDocument

// Form chỉ cần Data (không cần _id khi tạo mới)
POST /api/projects → ProjectFormData

// Frontend component nhận Document để display
<ProjectCard project={doc} />

// Form component nhận FormData để edit
<ProjectForm initialData={data} />
```

### 2. Generic Types Pattern

**Trước:**

```typescript
// Mỗi form tự viết Props riêng
type ProjectFormProps = {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
};

type AboutFormProps = {
  initialData?: Partial<AboutFormData>;
  onSubmit: (data: AboutFormData) => Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
};
// ... 6 lần lặp lại
```

**Sau:**

```typescript
// Generic pattern - viết 1 lần
interface FormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

// Reuse với type parameter
type ProjectFormProps = FormProps<ProjectFormData>;
type AboutFormProps = FormProps<AboutFormData>;
// ...
```

**Tại sao dùng Generic:**

- **Type Parameter `<T>`**: Placeholder cho any type
- **Reusability**: Viết 1 lần, dùng nhiều lần
- **Type Safety**: Vẫn strongly typed
- **Flexibility**: Dễ extend

### 3. Path Alias (`@/types`)

**Trước:**

```typescript
// Relative imports - messy
import { ProjectFormData } from "../../../types";
import { AboutFormData } from "../../../../types/index";
```

**Sau:**

```typescript
// Absolute imports - clean
import { ProjectFormData } from "@/types";
import { AboutFormData } from "@/types";
```

**Config:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Lợi ích:**

- Không care về file structure depth
- Dễ move files around
- Dễ đọc, dễ hiểu
- Standard practice trong Next.js

---

## 📚 KIẾN THỨC CẦN ÔN

### 1. TypeScript Fundamentals ⭐⭐⭐

#### A. Basic Types

```typescript
// Primitive types
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;

// Arrays
let skills: string[] = ["React", "TypeScript"];
let numbers: Array<number> = [1, 2, 3];

// Objects
let user: { name: string; age: number } = {
  name: "John",
  age: 25,
};
```

#### B. Interfaces vs Types

```typescript
// Interface - for object shapes
interface User {
  name: string;
  email: string;
}

// Type - for aliases, unions, intersections
type Status = "active" | "inactive";
type ID = string | number;
```

**Khi nào dùng gì:**

- **Interface**: Object structures, extends, declaration merging
- **Type**: Unions, intersections, primitive aliases

#### C. Generic Types

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Box<T> {
  value: T;
}

// Usage
let numberBox: Box<number> = { value: 42 };
let stringBox: Box<string> = { value: "hello" };
```

**Tại sao cần:**

- Reusable code với type safety
- Avoid `any` type
- Better IDE autocomplete

#### D. Utility Types

```typescript
// Partial - make all properties optional
type ProjectPartial = Partial<ProjectData>;
// = { title?: string; description?: string; ... }

// Pick - select properties
type ProjectPreview = Pick<ProjectData, "title" | "description">;
// = { title: string; description: string }

// Omit - exclude properties
type ProjectWithoutId = Omit<ProjectDocument, "_id">;
// = ProjectData + timestamps (no _id)

// Required - make all required
type ProjectRequired = Required<ProjectPartial>;
```

**Utility types hay dùng:**

- `Partial<T>` - Optional fields (for editing)
- `Required<T>` - All required (for creation)
- `Pick<T, K>` - Select fields
- `Omit<T, K>` - Exclude fields
- `Record<K, V>` - Key-value map

#### E. Union & Intersection Types

```typescript
// Union - OR
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// Intersection - AND
type Document = Data & Timestamps;
// = { ...Data, ...Timestamps }

interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

interface ProjectData {
  title: string;
}

type ProjectDocument = ProjectData & Timestamps;
// = { title: string; createdAt: string; updatedAt: string }
```

### 2. TypeScript Advanced ⭐⭐

#### A. Type Inference

```typescript
// TypeScript tự suy luận type
let x = 5; // number
let y = "hello"; // string

// Return type inference
function add(a: number, b: number) {
  return a + b; // returns number
}
```

#### B. Type Assertions

```typescript
// as keyword
let value: unknown = "hello";
let str = value as string;

// Generic syntax (JSX conflicts)
let str2 = <string>value;
```

#### C. Index Signatures

```typescript
// Dynamic keys
interface ErrorMap {
  [field: string]: string[];
}

let errors: ErrorMap = {
  email: ["Invalid email", "Required"],
  password: ["Too short"],
};
```

### 3. React + TypeScript ⭐⭐⭐

#### A. Component Props

```typescript
// Functional component with props
interface Props {
  name: string;
  age?: number;
  onClick: () => void;
}

function User({ name, age, onClick }: Props) {
  return <div onClick={onClick}>{name}</div>;
}
```

#### B. Event Handlers

```typescript
// onChange handler
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// onClick handler
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

// Form submit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};
```

#### C. useState with Types

```typescript
// Type inference
const [count, setCount] = useState(0); // number

// Explicit type
const [user, setUser] = useState<User | null>(null);

// Complex state
interface FormState {
  name: string;
  email: string;
}

const [form, setForm] = useState<FormState>({
  name: "",
  email: "",
});
```

### 4. Next.js + TypeScript ⭐⭐

#### A. Page Props

```typescript
// Server component
interface PageProps {
  params: { id: string };
  searchParams: { query?: string };
}

export default function Page({ params, searchParams }: PageProps) {
  // ...
}
```

#### B. API Route Handlers

```typescript
// GET request
export async function GET(req: Request) {
  return NextResponse.json({ data: "..." });
}

// POST with body
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(body);
}

// Dynamic route with params
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return NextResponse.json({ id });
}
```

### 5. Path Aliases & Module Resolution ⭐

#### A. tsconfig.json paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

#### B. Import syntax

```typescript
// With @/ alias
import { ProjectForm } from "@/components/forms/ProjectForm";
import { connectDB } from "@/lib/db";
import type { ProjectData } from "@/types";

// Without alias (relative)
import { ProjectForm } from "../../../components/forms/ProjectForm";
```

### 6. Zod Validation (Coming next) ⭐⭐

**Tại sao cần Zod:**

- TypeScript chỉ check **compile-time**
- Runtime data cần validation (user input, API)
- Zod: Schema validation + TypeScript types

**Ví dụ cơ bản:**

```typescript
import { z } from "zod";

// Define schema
const ProjectSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string(),
  tech: z.array(z.string()),
  codeUrl: z.string().url("Invalid URL"),
  liveUrl: z.string().url("Invalid URL"),
});

// Infer TypeScript type from schema
type ProjectData = z.infer<typeof ProjectSchema>;

// Validate runtime data
const result = ProjectSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.errors); // Validation errors
}
```

---

## 🎓 TÓM TẮT KIẾN THỨC

### Cần biết NGAY:

1. **TypeScript Basics** ✅
   - Primitive types, objects, arrays
   - Interfaces vs Types
   - Generic types `<T>`
   - Utility types: `Partial`, `Pick`, `Omit`

2. **React + TypeScript** ✅
   - Component props typing
   - Event handler types
   - useState with types

3. **Next.js Specifics** ✅
   - API route handlers
   - Promise-based params (Next.js 15)

4. **Module System** ✅
   - Path aliases (`@/`)
   - Import/export

### Sẽ học TIẾP:

5. **Zod Validation** (Next task)
   - Schema definition
   - Runtime validation
   - Error handling

6. **Mongoose + TypeScript**
   - Schema types
   - Document types
   - Model types

---

## 📖 TÀI LIỆU HỌC

### TypeScript Official Docs

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- https://www.typescriptlang.org/docs/handbook/2/generics.html
- https://www.typescriptlang.org/docs/handbook/utility-types.html

### React TypeScript Cheatsheet

- https://react-typescript-cheatsheet.netlify.app/

### Next.js + TypeScript

- https://nextjs.org/docs/app/building-your-application/configuring/typescript

### Zod Documentation

- https://zod.dev/

---

## ✅ CHECKLIST TIẾP THEO

Sau khi hiểu concepts trên, làm tiếp:

1. **Install Zod**

   ```bash
   cd admin-backend
   npm install zod
   ```

2. **Create validation schemas** (`lib/validations/`)
   - projectSchema.ts
   - aboutSchema.ts
   - skillSchema.ts
   - experienceSchema.ts
   - educationSchema.ts

3. **Update API routes** với Zod validation
   - Validate input trước khi save DB
   - Return proper error messages

4. **Improve Mongoose schemas**
   - Add `required: true`
   - Add validators
   - Add default values

5. **Frontend error handling**
   - Display validation errors
   - Retry mechanism
   - Loading states

---

**Current Status:** 25% complete (Types done, Zod pending)  
**Time spent:** ~30 minutes  
**Estimated remaining:** ~15 hours
