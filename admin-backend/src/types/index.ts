// ====================================
// BASE TYPES & UTILITIES
// ====================================

/**
 * Base document type with MongoDB fields
 */
export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response wrapper for success
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API Response wrapper for errors
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>; // Validation errors
}

/**
 * Generic API Response type
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ====================================
// PROJECT TYPES
// ====================================

/**
 * Project data without MongoDB fields
 */
export interface ProjectData {
  title: string;
  description: string;
  tech: string[];
  image: string;
  codeUrl: string;
  liveUrl: string;
}

/**
 * Complete Project document with MongoDB fields
 */
export interface ProjectDocument extends ProjectData, BaseDocument {}

/**
 * Form data for creating/editing projects
 * All fields are required for creation
 */
export type ProjectFormData = ProjectData;

/**
 * Partial form data for editing (all fields optional)
 */
export type ProjectFormDataPartial = Partial<ProjectFormData>;

// ====================================
// ABOUT TYPES
// ====================================

/**
 * About/Profile data without MongoDB fields
 */
export interface AboutData {
  name: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  experienceYears: number;
  projectsCompleted: number;
}

/**
 * Complete About document with MongoDB fields
 */
export interface AboutDocument extends AboutData, BaseDocument {}

/**
 * Form data for creating/editing about
 */
export type AboutFormData = AboutData;

/**
 * Partial form data for editing
 */
export type AboutFormDataPartial = Partial<AboutFormData>;

// ====================================
// SKILL TYPES
// ====================================

/**
 * Skill data without MongoDB fields
 */
export interface SkillData {
  name: string;
  level: number; // 0-100 percentage
}

/**
 * Complete Skill document with MongoDB fields
 */
export interface SkillDocument extends SkillData, BaseDocument {}

/**
 * Form data for creating/editing skills
 */
export type SkillFormData = SkillData;

/**
 * Partial form data for editing
 */
export type SkillFormDataPartial = Partial<SkillFormData>;

// ====================================
// EXPERIENCE TYPES
// ====================================

/**
 * Work experience data without MongoDB fields
 */
export interface ExperienceData {
  company: string;
  position: string;
  startDate: string; // ISO date string or YYYY-MM format
  endDate: string; // ISO date string, YYYY-MM format, or "Present"
  description: string;
  tags: string[];
}

/**
 * Complete Experience document with MongoDB fields
 */
export interface ExperienceDocument extends ExperienceData, BaseDocument {}

/**
 * Form data for creating/editing experience
 */
export type ExperienceFormData = ExperienceData;

/**
 * Partial form data for editing
 */
export type ExperienceFormDataPartial = Partial<ExperienceFormData>;

// ====================================
// EDUCATION TYPES
// ====================================

/**
 * Education data without MongoDB fields
 */
export interface EducationData {
  school: string;
  degree: string;
  field: string;
  startDate: string; // ISO date string or YYYY-MM format
  endDate: string; // ISO date string, YYYY-MM format, or "Present"
  description: string;
}

/**
 * Complete Education document with MongoDB fields
 */
export interface EducationDocument extends EducationData, BaseDocument {}

/**
 * Form data for creating/editing education
 */
export type EducationFormData = EducationData;

/**
 * Partial form data for editing
 */
export type EducationFormDataPartial = Partial<EducationFormData>;

// ====================================
// MESSAGE TYPES
// ====================================

/**
 * Contact message data without MongoDB fields
 */
export interface MessageData {
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
}

/**
 * Complete Message document with MongoDB fields
 */
export interface MessageDocument extends MessageData, BaseDocument {}

/**
 * Form data for creating messages (from contact form)
 */
export interface MessageFormData {
  name: string;
  email: string;
  subject: string;
  content: string;
}

/**
 * Unread messages summary
 */
export interface UnreadSummary {
  count: number;
  latestMessages: MessageDocument[];
}

// ====================================
// API REQUEST TYPES
// ====================================

/**
 * Common request params for single document operations
 */
export interface IdParam {
  id: string;
}

/**
 * Query params for listing with pagination
 */
export interface ListQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Query params for filtering messages
 */
export interface MessageQueryParams extends ListQueryParams {
  read?: boolean;
  search?: string;
}

// ====================================
// FORM PROPS TYPES
// ====================================

/**
 * Generic form component props
 */
export interface FormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  submitLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Specific form props for each model
 */
export type ProjectFormProps = FormProps<ProjectFormData>;
export type AboutFormProps = FormProps<AboutFormData>;
export type SkillFormProps = FormProps<SkillFormData>;
export type ExperienceFormProps = FormProps<ExperienceFormData>;
export type EducationFormProps = FormProps<EducationFormData>;
export type MessageFormProps = FormProps<MessageFormData>;

// ====================================
// COMPONENT STATE TYPES
// ====================================

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Data fetching state
 */
export interface DataState<T> extends LoadingState {
  data: T | null;
}

/**
 * List data fetching state
 */
export interface ListState<T> extends LoadingState {
  items: T[];
  total?: number;
  page?: number;
  hasMore?: boolean;
}

// ====================================
// VALIDATION ERROR TYPES
// ====================================

/**
 * Zod validation error format
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Grouped validation errors by field
 */
export type ValidationErrors = Record<string, string[]>;

// ====================================
// HTTP METHOD TYPES
// ====================================

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// ====================================
// THEME TYPES (for frontend)
// ====================================

export type Theme = "light" | "dark";

// ====================================
// NAVIGATION TYPES
// ====================================

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface SidebarSection {
  title?: string;
  items: NavItem[];
}
