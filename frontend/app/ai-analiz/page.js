"use client";
import { useState } from "react";
import { analyzeRisk } from "../../lib/api";

export default function AIAnalizPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function runAnalysis() {
    setLoading(true);
    try {
      const res = await analyzeRisk();
      if (res.success) {
        setResult(res);
      } else {
        showToast(res.message || "Analiz yapılamadı", "error");
      }
    } catch (err) {
      showToast("Analiz başarısız", "error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div>
      <div className="page-header">
        <h1>🤖 AI Müşteri Kayıp Analizi</h1>
        <p>Yapay zeka ile müşteri kayıp riskini analiz edin</p>
      </div>

      <div className="card" style={{ textAlign: "center", marginBottom: 32 }}>
        <p style={{ marginBottom: 16, color: "var(--text-light)" }}>
          Bu analiz, tamamlanmış randevuları inceleyerek hizmet yenileme süresini aşmış müşterileri tespit eder
          ve otomatik hatırlatma mesajı oluşturur.
        </p>
        <button className="btn btn-primary" onClick={runAnalysis} disabled={loading}>
          {loading ? "Analiz Yapılıyor..." : "🔍 Analizi Başlat"}
        </button>
      </div>

      {result && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{result.summary?.totalCustomers || 0}</div>
              <div className="stat-label">Toplam Müşteri</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--danger)" }}>{result.summary?.atRiskCount || 0}</div>
              <div className="stat-label">Risk Altında</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--success)" }}>{result.summary?.safeCount || 0}</div>
              <div className="stat-label">Güvende</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{result.summary?.riskRate || "0%"}</div>
              <div className="stat-label">Risk Oranı</div>
            </div>
          </div>

          {result.data?.atRisk?.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: "var(--danger)" }}>⚠️ Risk Altındaki Müşteriler</h2>
              <div className="card-grid">
                {result.data.atRisk.map((c, i) => (
                  <div className="card" key={i} style={{ borderLeft: `4px solid ${c.riskLevel === "yuksek" ? "var(--danger)" : "var(--warning)"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 16 }}>{c.customerName}</h3>
                      <span className={`badge badge-${c.riskLevel === "yuksek" ? "danger" : "warning"}`}>
                        {c.riskLevel === "yuksek" ? "Yüksek Risk" : "Orta Risk"}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 4 }}>
                      Son hizmet: {c.lastService}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 12 }}>
                      Son ziyaret: {c.daysSinceLastVisit} gün önce (limit: {c.renewalDays} gün, {c.daysOverdue} gün gecikmiş)
                    </p>
                    <div style={{ background: "var(--bg)", padding: 12, borderRadius: 12, fontSize: 13, lineHeight: 1.6 }}>
                      💌 {c.reminderMessage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.data?.safe?.length > 0 && (
            <div>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: "var(--success)" }}>✅ Güvendeki Müşteriler</h2>
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th>Müşteri</th><th>Son Hizmet</th><th>Son Ziyaret</th><th>Kalan Gün</th></tr>
                    </thead>
                    <tbody>
                      {result.data.safe.map((c, i) => (
                        <tr key={i}>
                          <td>{c.customerName}</td>
                          <td>{c.lastService}</td>
                          <td>{c.daysSinceLastVisit} gün önce</td>
                          <td><span className="badge badge-success">{c.daysUntilRenewal} gün</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
