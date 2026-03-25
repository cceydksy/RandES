"use client";
import { useState, useEffect } from "react";
import { getServices, createService } from "@/lib/api";

const KATEGORILER = ["Kirpik", "Saç", "Makyaj", "Tırnak", "Cilt Bakımı", "Diğer"];

export default function HizmetlerSayfasi() {
  const [hizmetler, setHizmetler] = useState({});
  const [kategoriler, setKategoriler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modal, setModal] = useState(false);
  const [bildirim, setBildirim] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Kirpik", price: "", durationMinutes: "", renewalDays: "", description: "" });

  useEffect(() => { yukle(); }, []);

  async function yukle() {
    try { const r = await getServices(); setHizmetler(r.data || {}); setKategoriler(r.categories || []); }
    catch (e) { console.error(e); } finally { setYukleniyor(false); }
  }

  async function kaydet(e) {
    e.preventDefault();
    const r = await createService({ ...form, price: Number(form.price), durationMinutes: Number(form.durationMinutes), renewalDays: Number(form.renewalDays) });
    if (r.success) { goster("Hizmet eklendi", "success"); setModal(false); setForm({ name: "", category: "Kirpik", price: "", durationMinutes: "", renewalDays: "", description: "" }); yukle(); }
    else goster(r.message || "Hata", "error");
  }

  function goster(m, t) { setBildirim({ m, t }); setTimeout(() => setBildirim(null), 3000); }

  if (yukleniyor) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header page-header-row">
        <div><h1>Hizmetler</h1><p>Salonunuzun hizmet listesi</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Yeni Hizmet</button>
      </div>

      {kategoriler.length === 0 ? (
        <div className="card empty-state"><p>Henüz hizmet eklenmemiş</p><button className="btn btn-primary" onClick={() => setModal(true)}>İlk Hizmeti Ekle</button></div>
      ) : (
        <div className="card">
          {kategoriler.map((kat) => (
            <div className="service-category" key={kat}>
              <h3>{kat}</h3>
              {(hizmetler[kat] || []).map((h) => (
                <div className="service-item" key={h._id}>
                  <div>
                    <div className="service-item-name">{h.name}</div>
                    <div className="service-item-desc">{h.description}</div>
                  </div>
                  <div className="service-item-meta">
                    <span className="service-item-duration">{h.durationMinutes} dk · Yenileme {h.renewalDays} gün</span>
                    <span className="service-item-price">{h.price}₺</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Yeni Hizmet Ekle</h2>
            <form onSubmit={kaydet}>
              <div className="form-group"><label>Hizmet Adı</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Örn: İpek Kirpik" /></div>
              <div className="form-group"><label>Kategori</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{KATEGORILER.map(k => <option key={k} value={k}>{k}</option>)}</select></div>
              <div className="form-row">
                <div className="form-group"><label>Fiyat (₺)</label><input type="number" required min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div className="form-group"><label>Süre (dk)</label><input type="number" required min="1" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Yenileme Süresi (gün)</label><input type="number" required min="1" value={form.renewalDays} onChange={e => setForm({ ...form, renewalDays: e.target.value })} /></div>
              <div className="form-group"><label>Açıklama</label><textarea rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Vazgeç</button><button type="submit" className="btn btn-primary">Kaydet</button></div>
            </form>
          </div>
        </div>
      )}

      {bildirim && <div className={`toast toast-${bildirim.t}`}>{bildirim.m}</div>}
    </div>
  );
}
