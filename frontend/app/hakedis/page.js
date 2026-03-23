"use client";
import { useState, useEffect } from "react";
import { getEarnings, getPersonnel } from "../../lib/api";

export default function HakedisPage() {
  const [earnings, setEarnings] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    personnelId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [earnRes, prsRes] = await Promise.all([
        getEarnings(filters), getPersonnel(),
      ]);
      setEarnings(earnRes.data || []);
      setPersonnel(prsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFilter() {
    setLoading(true);
    try {
      const res = await getEarnings(filters);
      setEarnings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>💰 Personel Hak Ediş</h1>
        <p>Aylık personel kazanç takibi</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Personel</label>
            <select value={filters.personnelId} onChange={(e) => setFilters({ ...filters, personnelId: e.target.value })}>
              <option value="">Tümü</option>
              {personnel.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Ay</label>
            <select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Yıl</label>
            <input type="number" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={handleFilter}>Filtrele</button>
        </div>
      </div>

      {earnings.length === 0 ? (
        <div className="card empty-state">
          <p>Bu dönem için hak ediş verisi bulunamadı</p>
        </div>
      ) : (
        earnings.map((e) => (
          <div className="card" key={e.personnelId} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18 }}>{e.personnelName}</h3>
              <span className="badge badge-info">Prim: %{e.commissionRate}</span>
            </div>
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              <div className="stat-card">
                <div className="stat-value">{e.totalAppointments}</div>
                <div className="stat-label">İşlem Sayısı</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{e.totalRevenue}₺</div>
                <div className="stat-label">Toplam Gelir</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--success)" }}>{e.totalEarnings.toFixed(0)}₺</div>
                <div className="stat-label">Kazanç (Prim)</div>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Tarih</th><th>Hizmet</th><th>Müşteri</th><th>Fiyat</th><th>Prim</th></tr>
                </thead>
                <tbody>
                  {e.services.map((s, i) => (
                    <tr key={i}>
                      <td>{new Date(s.date).toLocaleDateString("tr-TR")}</td>
                      <td>{s.serviceName}</td>
                      <td>{s.customerName}</td>
                      <td>{s.price}₺</td>
                      <td style={{ color: "var(--success)", fontWeight: 600 }}>{s.commission.toFixed(0)}₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
