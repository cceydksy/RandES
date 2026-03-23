"use client";
import { useState, useEffect } from "react";
import { getPersonnel, createPersonnel } from "../../lib/api";

const SPECIALTIES = ["Kirpik", "Saç", "Makyaj", "Tırnak", "Cilt Bakımı", "Diğer"];

export default function PersonelPage() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", specialties: [], commissionRate: 30 });

  useEffect(() => { loadPersonnel(); }, []);

  async function loadPersonnel() {
    try {
      const res = await getPersonnel();
      setPersonnel(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await createPersonnel({ ...form, commissionRate: Number(form.commissionRate) });
      if (res.success) {
        showToast("Personel başarıyla eklendi!", "success");
        setShowModal(false);
        setForm({ name: "", phone: "", specialties: [], commissionRate: 30 });
        loadPersonnel();
      } else {
        showToast(res.message || "Hata oluştu", "error");
      }
    } catch (err) {
      showToast("Personel eklenemedi", "error");
    }
  }

  function toggleSpecialty(spec) {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter((s) => s !== spec)
        : [...prev.specialties, spec],
    }));
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Personel</h1>
          <p>Salon personellerinizi yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Yeni Personel</button>
      </div>

      {personnel.length === 0 ? (
        <div className="card empty-state">
          <p>Henüz personel eklenmemiş</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>İlk Personeli Ekle</button>
        </div>
      ) : (
        <div className="card-grid">
          {personnel.map((p) => (
            <div className="card" key={p._id}>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 12 }}>{p.phone}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {p.specialties?.map((s) => (
                  <span className="category-tag" key={s}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
                Prim Oranı: %{p.commissionRate}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Yeni Personel Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Personel adı" />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input type="text" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XX XXX XXXX" />
              </div>
              <div className="form-group">
                <label>Uzmanlık Alanları</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SPECIALTIES.map((spec) => (
                    <button type="button" key={spec}
                      className={`btn btn-sm ${form.specialties.includes(spec) ? "btn-primary" : "btn-outline"}`}
                      onClick={() => toggleSpecialty(spec)}>
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Prim Oranı (%)</label>
                <input type="number" required min="0" max="100" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
