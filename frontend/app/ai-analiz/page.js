"use client";
import { useState } from "react";
import { analyzeRisk } from "@/lib/api";

export default function AIAnalizSayfasi() {
  const [sonuc, setSonuc] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function baslat() {
    setYukleniyor(true);
    try { const r = await analyzeRisk(); if (r.success) setSonuc(r); }
    catch (e) { console.error(e); } finally { setYukleniyor(false); }
  }

  return (
    <div>
      <div className="page-header"><h1>AI Müşteri Analizi</h1><p>Müşteri kayıp riskini yapay zeka ile analiz edin</p></div>

      <div className="card" style={{ textAlign: "center", marginBottom: 24 }}>
        <p style={{ color: "var(--text-light)", fontSize: 13, marginBottom: 16, maxWidth: 500, margin: "0 auto 16px" }}>
          Tamamlanmış randevuları analiz ederek yenileme süresi geçen müşterileri tespit eder ve otomatik hatırlatma mesajı oluşturur.
        </p>
        <button className="btn btn-primary" onClick={baslat} disabled={yukleniyor}>{yukleniyor ? "Analiz yapılıyor..." : "Analizi Başlat"}</button>
      </div>

      {sonuc && (
        <>
          <div className="stats-grid">
            {[["Toplam Müşteri", sonuc.summary?.totalCustomers, null], ["Risk Altında", sonuc.summary?.atRiskCount, "var(--danger)"], ["Güvende", sonuc.summary?.safeCount, "var(--success)"], ["Risk Oranı", sonuc.summary?.riskRate, null]].map(([l, v, c]) => (
              <div className="stat-card" key={l}><div className="stat-label">{l}</div><div className="stat-value" style={c ? { color: c } : {}}>{v || 0}</div></div>
            ))}
          </div>

          {sonuc.data?.atRisk?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 className="section-title" style={{ color: "var(--danger)" }}>Risk Altındaki Müşteriler</h3>
              <div className="card-grid">
                {sonuc.data.atRisk.map((m, i) => (
                  <div className="card" key={i} style={{ borderLeft: `3px solid ${m.riskLevel === "yuksek" ? "var(--danger)" : "var(--warning)"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600 }}>{m.customerName}</h4>
                      <span className={`badge badge-${m.riskLevel === "yuksek" ? "danger" : "warning"}`}>{m.riskLevel === "yuksek" ? "Yüksek" : "Orta"}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 10 }}>Son: {m.lastService} · {m.daysSinceLastVisit} gün önce · {m.daysOverdue} gün gecikmiş</p>
                    <div style={{ background: "var(--cream)", padding: 12, borderRadius: 8, fontSize: 12, lineHeight: 1.6 }}>{m.reminderMessage}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sonuc.data?.safe?.length > 0 && (
            <div>
              <h3 className="section-title" style={{ color: "var(--success)" }}>Güvendeki Müşteriler</h3>
              <div className="card">
                <table><thead><tr><th>Müşteri</th><th>Son Hizmet</th><th>Son Ziyaret</th><th>Kalan</th></tr></thead>
                <tbody>{sonuc.data.safe.map((m, i) => (
                  <tr key={i}><td>{m.customerName}</td><td>{m.lastService}</td><td>{m.daysSinceLastVisit} gün önce</td><td><span className="badge badge-success">{m.daysUntilRenewal} gün</span></td></tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
