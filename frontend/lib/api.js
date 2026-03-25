const API = process.env.NEXT_PUBLIC_API_URL || "https://rand-es.vercel.app/api/v1";

async function f(ep, opt = {}) {
  const c = { headers: { "Content-Type": "application/json" }, ...opt };
  if (c.body && typeof c.body === "object") c.body = JSON.stringify(c.body);
  const r = await fetch(`${API}${ep}`, c);
  return await r.json();
}

export const getServices = () => f("/services");
export const createService = (d) => f("/services", { method: "POST", body: d });
export const getPersonnel = () => f("/personnel");
export const createPersonnel = (d) => f("/personnel", { method: "POST", body: d });
export const getAppointments = () => f("/appointments");
export const createAppointment = (d) => f("/appointments", { method: "POST", body: d });
export const deleteAppointment = (id) => f(`/appointments/${id}`, { method: "DELETE" });
export const updateConfirmation = (id, s) => f(`/appointments/${id}/confirmation`, { method: "PUT", body: { status: s } });
export const updatePersonnel = (a, p) => f(`/appointments/${a}/personnel`, { method: "PUT", body: { personnelId: p } });
export const getUnconfirmed = () => f("/appointments/unconfirmed");
export const getNotifications = (p) => f(`/personnel/notifications${p ? `?personnelId=${p}` : ""}`);
export const getEarnings = (p) => { const q = new URLSearchParams(p).toString(); return f(`/personnel/earnings${q ? `?${q}` : ""}`); };
export const sendReview = (id) => f("/reviews/request", { method: "POST", body: { appointmentId: id } });
export const analyzeRisk = () => f("/ai/customer-risk", { method: "POST" });
export const seedData = () => f("/seed", { method: "POST" });
