// API Service Layer - Centralized API calls
// Dev: proxy qua Vite config (localhost:3000). Production: set VITE_API_URL trên Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Generic fetch wrapper with error handling
 * Handles the new API response format: { success: true, data: ... }
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message ||
          error.error ||
          `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const json = await response.json();

    // New API format: { success: true, data: ... }
    // Return the data field if it exists, otherwise return the whole response
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ==================== PROJECTS API ====================

/**
 * Get all projects
 * @returns {Promise<Array>} Array of project objects
 */
export async function getProjects() {
  return fetchAPI("/projects");
}

/**
 * Get single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Project object
 */
export async function getProject(id) {
  return fetchAPI(`/projects/${id}`);
}

/**
 * Create new project (admin only)
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project
 */
export async function createProject(projectData) {
  return fetchAPI("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

// ==================== ABOUT API ====================

/**
 * Get all about entries (usually just 1)
 * @returns {Promise<Array>} Array of about objects
 */
export async function getAbout() {
  return fetchAPI("/about");
}

/**
 * Get single about entry by ID
 * @param {string} id - About ID
 * @returns {Promise<Object>} About object
 */
export async function getAboutById(id) {
  return fetchAPI(`/about/${id}`);
}

// ==================== SKILLS API ====================

/**
 * Get all skills
 * @returns {Promise<Array>} Array of skill objects with name and level
 */
export async function getSkills() {
  return fetchAPI("/skills");
}

/**
 * Get single skill by ID
 * @param {string} id - Skill ID
 * @returns {Promise<Object>} Skill object
 */
export async function getSkill(id) {
  return fetchAPI(`/skills/${id}`);
}

// ==================== EXPERIENCE API ====================

/**
 * Get all work experiences
 * @returns {Promise<Array>} Array of experience objects
 */
export async function getExperience() {
  return fetchAPI("/experience");
}

/**
 * Get single experience by ID
 * @param {string} id - Experience ID
 * @returns {Promise<Object>} Experience object
 */
export async function getExperienceById(id) {
  return fetchAPI(`/experience/${id}`);
}

// ==================== EDUCATION API ====================

/**
 * Get all education entries
 * @returns {Promise<Array>} Array of education objects
 */
export async function getEducation() {
  return fetchAPI("/education");
}

/**
 * Get single education entry by ID
 * @param {string} id - Education ID
 * @returns {Promise<Object>} Education object
 */
export async function getEducationById(id) {
  return fetchAPI(`/education/${id}`);
}

// ==================== CONTACT/MESSAGES API ====================

/**
 * Send contact form message
 * @param {Object} messageData - { name, email, subject, content }
 * @returns {Promise<Object>} Response with success message
 */
export async function sendMessage(messageData) {
  return fetchAPI("/messages", {
    method: "POST",
    body: JSON.stringify(messageData),
  });
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format date range for display
 * @param {string} startDate - Start date (YYYY-MM-DD or YYYY)
 * @param {string} endDate - End date (YYYY-MM-DD or YYYY), empty = Present
 * @returns {string} Formatted range like "2022 - Present"
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate) return "";

  const startYear = startDate.includes("-")
    ? new Date(startDate).getFullYear()
    : startDate;

  if (!endDate || endDate === "") {
    return `${startYear} - Present`;
  }

  const endYear = endDate.includes("-")
    ? new Date(endDate).getFullYear()
    : endDate;

  return `${startYear} - ${endYear}`;
}

/**
 * Check if API is available
 * @returns {Promise<boolean>} True if API is reachable
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return response.ok;
  } catch (error) {
    console.warn("API not available:", error);
    return false;
  }
}
