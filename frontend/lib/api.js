const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rand-es.vercel.app/api/v1";

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();
  return data;
}

// Hizmetler
export const getServices = () => fetchAPI("/services");
export const createService = (data) =>
  fetchAPI("/services", { method: "POST", body: JSON.stringify(data) });

// Personel
export const getPersonnel = () => fetchAPI("/personnel");
export const createPersonnel = (data) =>
  fetchAPI("/personnel", { method: "POST", body: JSON.stringify(data) });

// Randevular
export const getAppointments = () => fetchAPI("/appointments");
export const createAppointment = (data) =>
  fetchAPI("/appointments", { method: "POST", body: JSON.stringify(data) });
export const deleteAppointment = (id) =>
  fetchAPI(`/appointments/${id}`, { method: "DELETE" });
export const updateConfirmation = (id, status) =>
  fetchAPI(`/appointments/${id}/confirmation`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
export const updatePersonnel = (appointmentId, personnelId) =>
  fetchAPI(`/appointments/${appointmentId}/personnel`, {
    method: "PUT",
    body: JSON.stringify({ personnelId }),
  });
export const getUnconfirmed = () => fetchAPI("/appointments/unconfirmed");

// Personel Bildirimleri & Kazanç
export const getNotifications = (personnelId) =>
  fetchAPI(`/personnel/notifications${personnelId ? `?personnelId=${personnelId}` : ""}`);
export const getEarnings = (params) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/personnel/earnings${query ? `?${query}` : ""}`);
};

// Değerlendirme
export const sendReview = (appointmentId) =>
  fetchAPI("/reviews/request", { method: "POST", body: JSON.stringify({ appointmentId }) });

// AI
export const analyzeRisk = () => fetchAPI("/ai/customer-risk", { method: "POST" });

// Seed
export const seedData = () => fetchAPI("/seed", { method: "POST" });
