"use client";
import { useState, useEffect } from "react";
import { getAppointments, createAppointment, deleteAppointment, updateConfirmation, getServices, getPersonnel, sendReview } from "../../lib/api";

export default function RandevularPage() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "",
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [aptRes, svcRes, prsRes] = await Promise.all([
        getAppointments(), getServices(), getPersonnel(),
      ]);
      setAppointments(aptRes.data || []);
      // Flatten services
      const allServices = [];
      Object.values(svcRes.data || {}).forEach((arr) => allServices.push(...arr));
      setServices(allServices);
      setPersonnel(prsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await createAppointment(form);
      if (res.success) {
        showToast("Randevu oluşturuldu!", "success");
        setShowModal(false);
        setForm({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "" });
        loadData();
      } else {
        showToast(res.message || "Hata oluştu", "error");
      }
    } catch (err) {
      showToast("Randevu oluşturulamadı", "error");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bu randevuyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await deleteAppointment(id);
      if (res.success) {
        showToast("Randevu silindi", "success");
        loadData();
      }
    } catch (err) {
      showToast("Randevu silinemedi", "error");
    }
  }

  async function handleConfirm(id, status) {
    try {
      const res = await updateConfirmation(id, status);
      if (res.success) {
        showToast(`Randevu ${status === "onaylandi" ? "onaylandı" : "iptal edildi"}`, "success");
        loadData();
      }
    } catch (err) {
      showToast("İşlem başarısız", "error");
    }
  }

  async function handleReview(id) {
    try {
      const res = await sendReview(id);
      if (res.success) {
        showToast("Değerlendirme isteği gönderildi!", "success");
      } else {
        showToast(res.message || "Hata oluştu", "error");
      }
    } catch (err) {
      showToast("Mesaj gönderilemedi", "error");
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function getStatusBadge(status) {
    const map = { onaylandi: "success", iptal: "danger", tamamlandi: "info", beklemede: "warning" };
    return map[status] || "warning";
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Randevular</h1>
          <p>Randevuları oluşturun ve yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Yeni Randevu</button>
      </div>

      {appointments.length === 0 ? (
        <div className="card empty-state">
          <p>Henüz randevu bulunmuyor</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>İlk Randevuyu Oluştur</button>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Müşteri</th>
                  <th>Telefon</th>
                  <th>Hizmet</th>
                  <th>Personel</th>
                  <th>Tarih/Saat</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td><strong>{apt.customerName}</strong></td>
                    <td>{apt.customerPhone}</td>
                    <td>{apt.serviceId?.name || "-"}</td>
                    <td>{apt.personnelId?.name || "-"}</td>
                    <td>{new Date(apt.appointmentTime).toLocaleString("tr-TR")}</td>
                    <td><span className={`badge badge-${getStatusBadge(apt.status)}`}>{apt.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {apt.status === "beklemede" && (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => handleConfirm(apt._id, "onaylandi")}>✓ Onayla</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleConfirm(apt._id, "iptal")}>✕ İptal</button>
                          </>
                        )}
                        {apt.status === "tamamlandi" && !apt.reviewSentAt && (
                          <button className="btn btn-sm btn-outline" onClick={() => handleReview(apt._id)}>⭐ Değerlendir</button>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(apt._id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Yeni Randevu Oluştur</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Müşteri Adı</label>
                <input type="text" required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Ad Soyad" />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input type="text" required value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} placeholder="05XX XXX XXXX" />
              </div>
              <div className="form-group">
                <label>Hizmet</label>
                <select required value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
                  <option value="">Hizmet seçin</option>
                  {services.map((s) => <option key={s._id} value={s._id}>{s.name} - {s.price}₺</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Personel</label>
                <select required value={form.personnelId} onChange={(e) => setForm({ ...form, personnelId: e.target.value })}>
                  <option value="">Personel seçin</option>
                  {personnel.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Randevu Tarihi ve Saati</label>
                <input type="datetime-local" required value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Not (opsiyonel)</label>
                <textarea rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ek notlar..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
