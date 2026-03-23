"use client";
import { useState, useEffect } from "react";
import { getNotifications, getPersonnel } from "../../lib/api";

export default function BildirimlerPage() {
  const [notifications, setNotifications] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [notifRes, prsRes] = await Promise.all([
        getNotifications(), getPersonnel(),
      ]);
      setNotifications(notifRes.data || []);
      setPersonnel(prsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function filterByPersonnel(personnelId) {
    setSelectedPersonnel(personnelId);
    setLoading(true);
    try {
      const res = await getNotifications(personnelId);
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>🔔 Personel Bildirimleri</h1>
        <p>Bugünkü randevu bildirimleri</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <select className="btn btn-outline" style={{ padding: "10px 16px", fontSize: 14 }}
          value={selectedPersonnel} onChange={(e) => filterByPersonnel(e.target.value)}>
          <option value="">Tüm Personel</option>
          {personnel.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      {notifications.length === 0 ? (
        <div className="card empty-state">
          <p>Bugün için bildirim bulunmuyor</p>
        </div>
      ) : (
        <div className="card-grid">
          {notifications.map((n) => (
            <div className="card" key={n.appointmentId}>
              <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, marginBottom: 8 }}>
                {n.personnelName}
              </div>
              <p style={{ fontSize: 15, marginBottom: 12, lineHeight: 1.6 }}>{n.message}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-light)" }}>
                <span>Müşteri: {n.customerName}</span>
                <span className={`badge badge-${n.status === "onaylandi" ? "success" : "warning"}`}>{n.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
