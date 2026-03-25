"use client";
import { useState, useEffect } from "react";
import { getAppointments, getServices, getPersonnel, getNotifications, getUnconfirmed } from "@/lib/api";

export default function Anasayfa() {
  const [stats, setStats] = useState({ randevu: 0, bugun: 0, hizmet: 0, personel: 0 });
  const [son, setSon] = useState([]);
  const [bildirimler, setBildirimler] = useState([]);
  const [onaysizlar, setOnaysizlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => { yukle(); }, []);

  async function yukle() {
    try {
      const [r, h, p, b, o] = await Promise.all([getAppointments(), getServices(), getPersonnel(), getNotifications(), getUnconfirmed()]);
      const bugun = new Date().toDateString();
      setStats({ randevu: r.count || 0, bugun: (r.data || []).filter(x => new Date(x.appointmentTime).toDateString() === bugun).length, hizmet: h.totalCount || 0, personel: p.count || 0 });
      setSon((r.data || []).slice(0, 5));
      setBildirimler((b.data || []).slice(0, 4));
      setOnaysizlar((o.data || []).slice(0, 3));
    } catch (e) { console.error(e); } finally { setYukleniyor(false); }
  }

  const durum = (s) => ({ onaylandi: "success", iptal: "danger", tamamlandi: "info", beklemede: "warning" }[s] || "warning");

  if (yukleniyor) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Anasayfa</h1><p>Salonunuzun genel durumu</p></div>

      <div className="stats-grid">
        {[["Toplam Randevu", stats.randevu], ["Bugün", stats.bugun], ["Hizmet", stats.hizmet], ["Personel", stats.personel]].map(([l, v]) => (
          <div className="stat-card" key={l}><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div>
        ))}
      </div>

      {onaysizlar.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 className="section-title">⚠️ Onay Bekleyen Randevular</h3>
          {onaysizlar.map((o) => (
            <div className="alert-card" key={o._id}>
              <p><strong>{o.customerName}</strong> — {o.serviceId?.name} · {new Date(o.appointmentTime).toLocaleString("tr-TR")} · Henüz onaylanmadı</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card">
          <h3 className="section-title">Son Randevular</h3>
          {son.length === 0 ? <p style={{ color: "var(--text-light)", fontSize: 13 }}>Randevu yok</p> :
            son.map((r) => (
              <div key={r._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{r.customerName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-light)" }}>{r.serviceId?.name} · {r.personnelId?.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text-light)" }}>{new Date(r.appointmentTime).toLocaleDateString("tr-TR")}</div>
                  <span className={`badge badge-${durum(r.status)}`}>{r.status}</span>
                </div>
              </div>
            ))
          }
        </div>

        <div className="card">
          <h3 className="section-title">Personel Bildirimleri</h3>
          {bildirimler.length === 0 ? <p style={{ color: "var(--text-light)", fontSize: 13 }}>Bugün bildirim yok</p> :
            bildirimler.map((b) => (
              <div key={b.appointmentId} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13 }}>{b.message}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
