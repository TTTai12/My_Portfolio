# ✅ CRUD SYNCHRONIZATION CHECKLIST

## 🎯 MỤC TIÊU

Đảm bảo TẤT CẢ models có CRUD operations nhất quán, chuẩn pattern

---

## 📋 MODELS CẦN ĐỒNG BỘ

### 1. ✅ Projects (HOÀN CHỈNH - PATTERN MẪU)

- [x] Backend API: CREATE, READ_ALL, READ_ONE, UPDATE, DELETE
- [x] Form Component: ProjectForm.tsx
- [x] Admin Pages: List, New, Edit
- [x] TypeScript Types: ProjectFormData
- [x] Pattern: Native HTML form, single state object

### 2. ⚠️ Skills (CẦN KIỂM TRA)

- [ ] Backend API: Verify all 5 operations
- [ ] Form: skillsForm.tsx (tên file lowercase - rename?)
- [ ] Pages: Complete?
- [ ] Types: Consistent?

### 3. ⚠️ Experience (CẦN FIX)

- [ ] Backend API: Check consistency
- [ ] Form: ExperienceForm.tsx
- [ ] Pages: Tags handling?
- [ ] Types: Match schema?

### 4. ⚠️ Education (CẦN KIỂM TRA)

- [ ] Backend API: Dates as strings?
- [ ] Form: EducationForm.tsx
- [ ] Pages: Complete?
- [ ] Types: Consistent?

### 5. ⚠️ About (CACHE ISSUE)

- [ ] Backend API: Singleton pattern?
- [ ] Form: AboutForm.tsx (UTF-8 error - skip for now)
- [ ] Pages: Handle single document?
- [ ] Types: All 8 fields?

### 6. ⏸️ Messages (READ-ONLY - No edit/update needed)

- [x] Backend API: GET, DELETE only
- [x] Mark as read functionality
- [ ] No form needed (public contact form)

---

## 🔍 KIỂM TRA CHI TIẾT

### A. BACKEND API ROUTES

#### Pattern chuẩn (theo Projects):

**File: `/api/[model]/route.ts`**

```typescript
✅ export async function POST(req: Request)
   - connectDB()
   - req.json()
   - Model.create(body)
   - Error handling

✅ export async function GET()
   - connectDB()
   - Model.find()
   - Return array
```

**File: `/api/[model]/[id]/route.ts`**

```typescript
✅ export async function GET(req, context: { params: Promise<{id}> })
   - await context.params (Next.js 15)
   - Model.findById(id)
   - 404 handling

✅ export async function PUT(req, context)
   - await context.params
   - req.json()
   - Model.findByIdAndUpdate(id, body, {new: true})

✅ export async function DELETE(req, context)
   - await context.params
   - Model.findByIdAndDelete(id)
   - Return success message
```

#### Checklist cho MỖI model:

- [ ] **Skills**
  - [ ] POST /api/skills - Create
  - [ ] GET /api/skills - Read all
  - [ ] GET /api/skills/[id] - Read one
  - [ ] PUT /api/skills/[id] - Update
  - [ ] DELETE /api/skills/[id] - Delete
  - [ ] Context params: `Promise<{id}>` pattern

- [ ] **Experience**
  - [ ] POST /api/experience
  - [ ] GET /api/experience
  - [ ] GET /api/experience/[id]
  - [ ] PUT /api/experience/[id]
  - [ ] DELETE /api/experience/[id]
  - [ ] Tags array handling

- [ ] **Education**
  - [ ] POST /api/education
  - [ ] GET /api/education
  - [ ] GET /api/education/[id]
  - [ ] PUT /api/education/[id]
  - [ ] DELETE /api/education/[id]
  - [ ] Date fields (startDate, endDate)

- [ ] **About**
  - [ ] POST /api/about (or skip if singleton)
  - [ ] GET /api/about
  - [ ] GET /api/about/[id]
  - [ ] PUT /api/about/[id]
  - [ ] DELETE /api/about/[id]
  - [ ] Singleton pattern? (only 1 about document)

---

### B. FORM COMPONENTS

#### Pattern chuẩn (theo ProjectForm):

```typescript
✅ "use client" directive
✅ export type [Model]FormData interface
✅ Props: initialData, onSubmit, submitLabel, disabled
✅ State: Single formData object
✅ State: loading, error
✅ handleChange: Generic handler với [e.target.name]
✅ handleSubmit: Validation, transformation, try/catch
✅ JSX: Accessible labels, disabled states
✅ Native HTML (không dùng UI libraries)
```

#### Checklist:

- [ ] **skillsForm.tsx**
  - [ ] Rename to SkillsForm.tsx (PascalCase)
  - [ ] Type: SkillFormData
  - [ ] Fields: name (string), level (number 0-100)
  - [ ] Validation: name required, level 0-100
  - [ ] Single state object

- [ ] **ExperienceForm.tsx**
  - [ ] Type: ExperienceFormData
  - [ ] Fields: company, position, dates, description, tags
  - [ ] Tags: String to array transformation
  - [ ] Date inputs: type="date"
  - [ ] Remove individual useState for each field

- [ ] **EducationForm.tsx**
  - [ ] Type: EducationFormData
  - [ ] Fields: school, degree, field, dates, description
  - [ ] Date handling consistent
  - [ ] Single state pattern

- [ ] **AboutForm.tsx**
  - [ ] Skip for now (UTF-8 cache issue)
  - [ ] Fix sau khi clear cache
  - [ ] Type: AboutFormData (8 fields)
  - [ ] avatar preview
  - [ ] Number inputs: experienceYears, projectsCompleted

---

### C. ADMIN PAGES

#### Pattern chuẩn:

**List Page: `/app/[model]/page.tsx`**

```typescript
✅ useEffect: Fetch data on mount
✅ State: items, loading, error
✅ Map items to cards/table
✅ Links: View, Edit, Delete buttons
✅ "Add New" button → /[model]/new
```

**Create Page: `/app/[model]/new/page.tsx`**

```typescript
✅ Import form component
✅ handleCreate: POST /api/[model]
✅ Success: router.push to list
✅ Error: Throw to form
```

**Edit Page: `/app/[model]/[id]/edit/page.tsx`**

```typescript
✅ useParams: Get id
✅ useEffect: Fetch existing data
✅ initialData state
✅ Loading state
✅ handleUpdate: PUT /api/[model]/[id]
✅ Success: router.push to list
```

#### Checklist:

- [ ] **Skills Pages**
  - [ ] /skills - List
  - [ ] /skills/new - Create
  - [ ] /skills/[id]/edit - Edit
  - [ ] Consistent routing

- [ ] **Experience Pages**
  - [ ] /experience - List
  - [ ] /experience/new - Create
  - [ ] /experience/[id]/edit - Edit
  - [ ] Display tags properly

- [ ] **Education Pages**
  - [ ] /education - List
  - [ ] /education/new - Create
  - [ ] /education/[id]/edit - Edit
  - [ ] Date formatting

- [ ] **About Pages**
  - [ ] /about - View/Edit (singleton)
  - [ ] No "new" page (only 1 about)
  - [ ] /about/[id]/edit - Edit

---

### D. TYPESCRIPT TYPES

#### Consistency check:

```typescript
// Mongoose Schema → TypeScript Type → Form Props

// Example: Skills
Schema: { name: String, level: Number }
  ↓
Type: { name: string, level: number }
  ↓
FormData: Same as Type
  ↓
Document: Type + { _id, createdAt, updatedAt }
```

#### Checklist:

- [ ] **Create types file**: `src/types/admin.ts`

  ```typescript
  // Common pattern
  export type BaseDocument = {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };

  export type SkillFormData = {
    name: string;
    level: number;
  };

  export type SkillDocument = SkillFormData & BaseDocument;
  ```

- [ ] **Import in forms**

  ```typescript
  import type { SkillFormData } from "@/types/admin";
  ```

- [ ] **Match all models**
  - [ ] ProjectFormData ✅
  - [ ] SkillFormData
  - [ ] ExperienceFormData
  - [ ] EducationFormData
  - [ ] AboutFormData
  - [ ] MessageDocument (read-only)

---

## 🔧 CÔNG VIỆC CẦN LÀM

### Priority 1: FIX INCONSISTENCIES

1. **Skills Form**

   ```bash
   # Rename file
   mv admin-backend/src/components/forms/skillsForm.tsx \
      admin-backend/src/components/forms/SkillsForm.tsx

   # Update imports in pages
   ```

2. **Experience Form**
   - Check tags transformation: string ↔ array
   - Ensure date inputs work
   - Verify all fields match schema

3. **Education Form**
   - Check date handling
   - Verify schema match

### Priority 2: CREATE MISSING PIECES

1. **Types File**

   ```typescript
   // admin-backend/src/types/admin.ts
   export type ProjectFormData = {...}
   export type SkillFormData = {...}
   // etc.
   ```

2. **Missing Pages**
   - Check if all models have: list, new, edit pages
   - Verify routing works

### Priority 3: TESTING

1. **Manual Testing Script**

   ```bash
   # Test each model:
   1. Create new item
   2. View in list
   3. Edit item
   4. Verify update
   5. Delete item
   6. Verify deletion
   ```

2. **API Testing**

   ```powershell
   # Projects
   curl http://localhost:3000/api/projects
   curl http://localhost:3000/api/projects/[id]

   # Skills
   curl http://localhost:3000/api/skills
   # etc.
   ```

---

## 📊 PROGRESS TRACKING

### Status:

| Model      | API | Form | Pages | Types | Status        |
| ---------- | --- | ---- | ----- | ----- | ------------- |
| Projects   | ✅  | ✅   | ✅    | ✅    | **COMPLETE**  |
| Skills     | ⚠️  | ⚠️   | ?     | ❌    | **60%**       |
| Experience | ⚠️  | ⚠️   | ?     | ❌    | **60%**       |
| Education  | ⚠️  | ⚠️   | ?     | ❌    | **60%**       |
| About      | ⚠️  | 🔴   | ?     | ❌    | **40%**       |
| Messages   | ✅  | N/A  | ✅    | ❌    | **READ-ONLY** |

**Legend:**

- ✅ Complete
- ⚠️ Needs verification
- ❌ Missing/Incomplete
- 🔴 Has errors
- ? Unknown status

---

## 🎯 NEXT STEPS

1. **Run this script để kiểm tra:**

   ```powershell
   # Check all API routes exist
   Get-ChildItem "admin-backend/src/app/api" -Recurse -Filter "route.ts" |
     Select-Object FullName

   # Check all forms
   Get-ChildItem "admin-backend/src/components/forms" -Filter "*Form.tsx"

   # Check all admin pages
   Get-ChildItem "admin-backend/src/app" -Recurse -Filter "page.tsx" |
     Where-Object { $_.FullName -notlike "*api*" }
   ```

2. **Fix theo thứ tự:**
   - Skills (simplest)
   - Education (similar to Skills)
   - Experience (tags handling)
   - About (singleton + cache issue)

3. **Test từng model một:**
   - Create → List → Edit → Delete
   - Verify data in MongoDB Atlas

---

**Generated:** Checklist đồng bộ CRUD  
**Purpose:** Track progress, ensure consistency  
**Goal:** 100% completion for all models
