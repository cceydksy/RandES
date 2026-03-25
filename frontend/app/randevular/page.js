"use client";
import { useState, useEffect } from "react";
import { getAppointments, createAppointment, deleteAppointment, updateConfirmation, updatePersonnel, getServices, getPersonnel, sendReview } from "@/lib/api";

export default function RandevularSayfasi() {
  const [randevular, setRandevular] = useState([]);
  const [hizmetler, setHizmetler] = useState([]);
  const [personeller, setPersoneller] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modal, setModal] = useState(null);
  const [bildirim, setBildirim] = useState(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "" });
  const [personelModal, setPersonelModal] = useState(null);

  useEffect(() => { yukle(); }, []);

  async function yukle() {
    try {
      const [r, h, p] = await Promise.all([getAppointments(), getServices(), getPersonnel()]);
      setRandevular(r.data || []);
      const tum = []; Object.values(h.data || {}).forEach(a => tum.push(...a)); setHizmetler(tum);
      setPersoneller(p.data || []);
    } catch (e) { console.error(e); } finally { setYukleniyor(false); }
  }

  async function kaydet(e) {
    e.preventDefault();
    const res = await createAppointment(form);
    if (res.success) { goster("Randevu oluşturuldu", "success"); setModal(null); setForm({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "" }); yukle(); }
    else goster(res.message || "Hata", "error");
  }

  async function sil(id) { if (!confirm("Randevuyu silmek istediğinize emin misiniz?")) return; const r = await deleteAppointment(id); if (r.success) { goster("Silindi", "success"); yukle(); } }
  async function onayla(id, d) { const r = await updateConfirmation(id, d); if (r.success) { goster(d === "onaylandi" ? "Onaylandı" : "İptal edildi", "success"); yukle(); } }

  async function personelAta(aptId, pId) {
    const r = await updatePersonnel(aptId, pId);
    if (r.success) { goster("Personel güncellendi", "success"); setPersonelModal(null); yukle(); }
  }

  function goster(m, t) { setBildirim({ m, t }); setTimeout(() => setBildirim(null), 3000); }
  const dr = (s) => ({ onaylandi: "success", iptal: "danger", tamamlandi: "info", beklemede: "warning" }[s] || "warning");

  if (yukleniyor) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header page-header-row">
        <div><h1>Randevular</h1><p>Oluşturun, onaylayın ve yönetin</p></div>
        <button className="btn btn-primary" onClick={() => setModal("yeni")}>+ Yeni Randevu</button>
      </div>

      {randevular.length === 0 ? (
        <div className="card empty-state"><p>Henüz randevu yok</p><button className="btn btn-primary" onClick={() => setModal("yeni")}>İlk Randevuyu Oluştur</button></div>
      ) : (
        <div className="card" style={{ overflow: "auto" }}>
          <table>
            <thead><tr><th>Müşteri</th><th>Telefon</th><th>Hizmet</th><th>Personel</th><th>Tarih / Saat</th><th>Durum</th><th style={{ width: 200 }}>İşlem</th></tr></thead>
            <tbody>
              {randevular.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>{r.customerName}</td>
                  <td>{r.customerPhone}</td>
                  <td>{r.serviceId?.name || "-"}</td>
                  <td>
                    <span style={{ cursor: "pointer", borderBottom: "1px dashed var(--green)" }} onClick={() => setPersonelModal(r._id)}>
                      {r.personnelId?.name || "-"}
                    </span>
                  </td>
                  <td>{new Date(r.appointmentTime).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td><span className={`badge badge-${dr(r.status)}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {r.status === "beklemede" && (<><button className="btn btn-sm btn-success" onClick={() => onayla(r._id, "onaylandi")}>Onayla</button><button className="btn btn-sm btn-danger" onClick={() => onayla(r._id, "iptal")}>İptal</button></>)}
                      <button className="btn btn-sm btn-danger" onClick={() => sil(r._id)}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal === "yeni" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Yeni Randevu</h2>
            <form onSubmit={kaydet}>
              <div className="form-group"><label>Müşteri Adı</label><input type="text" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Ad Soyad" /></div>
              <div className="form-group"><label>Telefon</label><input type="text" required value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="05XX XXX XXXX" /></div>
              <div className="form-row">
                <div className="form-group"><label>Hizmet</label><select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}><option value="">Seçin</option>{hizmetler.map(h => <option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
                <div className="form-group"><label>Personel</label><select required value={form.personnelId} onChange={e => setForm({ ...form, personnelId: e.target.value })}><option value="">Seçin</option>{personeller.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
              </div>
              <div className="form-group"><label>Tarih ve Saat</label><input type="datetime-local" required value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })} /></div>
              <div className="form-group"><label>Not</label><textarea rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Ek not..." /></div>
              <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-primary">Oluştur</button></div>
            </form>
          </div>
        </div>
      )}

      {personelModal && (
        <div className="modal-overlay" onClick={() => setPersonelModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Personel Değiştir</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {personeller.map(p => (
                <button key={p._id} className="btn btn-outline" style={{ justifyContent: "flex-start" }} onClick={() => personelAta(personelModal, p._id)}>
                  {p.name} <span style={{ fontSize: 11, color: "var(--text-light)", marginLeft: 8 }}>{p.specialties?.join(", ")}</span>
                </button>
              ))}
            </div>
            <div className="modal-actions"><button className="btn btn-outline" onClick={() => setPersonelModal(null)}>Kapat</button></div>
          </div>
        </div>
      )}

      {bildirim && <div className={`toast toast-${bildirim.t}`}>{bildirim.m}</div>}
    </div>
  );
}
