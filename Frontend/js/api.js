// Centralized API helper
const API_BASE = ""; 
// empty = same origin (works locally + on Render)

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ---- Public API functions ----
export function getProfile() {
  return request("/api/profile");
}

export function getSummary() {
  return request("/api/summary");
}

export function getProjects() {
  return request("/api/projects");
}

export function getExperience() {
  return request("/api/experience");
}

export function getSkills() {
  return request("/api/skills");
}

export function getCertifications() {
  return request("/api/certifications");
}

export function getAchievements() {
  return request("/api/achievements");
}

export function getVolunteer() {
  return request("/api/volunteer");
}
