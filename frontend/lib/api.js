const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rand-es.vercel.app/api/v1";

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = { headers: { "Content-Type": "application/json" }, ...options };
  if (config.body && typeof config.body === "object") config.body = JSON.stringify(config.body);
  const res = await fetch(url, config);
  return await res.json();
}

export const getServices = () => fetchAPI("/services");
export const createService = (data) => fetchAPI("/services", { method: "POST", body: data });
export const getPersonnel = () => fetchAPI("/personnel");
export const createPersonnel = (data) => fetchAPI("/personnel", { method: "POST", body: data });
export const getAppointments = () => fetchAPI("/appointments");
export const createAppointment = (data) => fetchAPI("/appointments", { method: "POST", body: data });
export const deleteAppointment = (id) => fetchAPI(`/appointments/${id}`, { method: "DELETE" });
export const updateConfirmation = (id, status) => fetchAPI(`/appointments/${id}/confirmation`, { method: "PUT", body: { status } });
export const updatePersonnel = (aptId, personnelId) => fetchAPI(`/appointments/${aptId}/personnel`, { method: "PUT", body: { personnelId } });
export const getUnconfirmed = () => fetchAPI("/appointments/unconfirmed");
export const getNotifications = (pid) => fetchAPI(`/personnel/notifications${pid ? `?personnelId=${pid}` : ""}`);
export const getEarnings = (params) => { const q = new URLSearchParams(params).toString(); return fetchAPI(`/personnel/earnings${q ? `?${q}` : ""}`); };
export const sendReview = (appointmentId) => fetchAPI("/reviews/request", { method: "POST", body: { appointmentId } });
export const analyzeRisk = () => fetchAPI("/ai/customer-risk", { method: "POST" });
export const seedData = () => fetchAPI("/seed", { method: "POST" });
