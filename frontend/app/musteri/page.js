"use client";
import { useState, useEffect } from "react";
import { getServices, getPersonnel, createAppointment } from "@/lib/api";

const GALERI = [
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop", baslik: "Profesyonel Bakım" },
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop", baslik: "Kirpik Uygulaması" },
  { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop", baslik: "Tırnak Tasarımı" },
  { src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop", baslik: "Saç Bakımı" },
  { src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", baslik: "Cilt Bakımı" },
  { src: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop", baslik: "Makyaj" },
  { src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&h=400&fit=crop", baslik: "Gelin Makyajı" },
  { src: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop", baslik: "Pedikür" },
];

export default function MusteriSayfasi() {
  const [hizmetler, setHizmetler] = useState({});
  const [kategoriler, setKategoriler] = useState([]);
  const [personeller, setPersoneller] = useState([]);
  const [tumHizmetler, setTumHizmetler] = useState([]);
  const [modal, setModal] = useState(false);
  const [bildirim, setBildirim] = useState(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "" });

  useEffect(() => { yukle(); }, []);

  async function yukle() {
    const [h, p] = await Promise.all([getServices(), getPersonnel()]);
    setHizmetler(h.data || {});
    setKategoriler(h.categories || []);
    const tum = []; Object.values(h.data || {}).forEach(a => tum.push(...a)); setTumHizmetler(tum);
    setPersoneller(p.data || []);
  }

  async function kaydet(e) {
    e.preventDefault();
    const r = await createAppointment(form);
    if (r.success) {
      setBildirim({ m: "Randevunuz oluşturuldu! En kısa sürede onaylanacaktır.", t: "success" });
      setModal(false);
      setForm({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "" });
    } else {
      setBildirim({ m: r.message || "Bir hata oluştu", t: "error" });
    }
    setTimeout(() => setBildirim(null), 4000);
  }

  return (
    <div className="customer-page">
      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <h1>rand<span>ES</span></h1>
          <p>Güzellik & Bakım Salonu</p>
          <button className="hero-btn" onClick={() => setModal(true)}>Randevu Al</button>
        </div>
      </div>

      {/* NAV */}
      <div className="customer-nav">
        <a href="#galeri">Galeri</a>
        <a href="#hizmetler">Hizmetler</a>
        <a href="#randevu">Randevu</a>
        <a href="#iletisim">İletişim</a>
      </div>

      {/* GALERİ - KAYAN SLIDER */}
      <div className="slider" id="galeri">
        <h2>Çalışmalarımız</h2>
        <div className="slider-track">
          {[...GALERI, ...GALERI].map((g, i) => (
            <div className="slider-item" key={i}>
              <img src={g.src} alt={g.baslik} loading="lazy" />
              <div className="slider-caption">{g.baslik}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HİZMETLER */}
      <div className="customer-section" id="hizmetler">
        <h2>Hizmetlerimiz</h2>
        {kategoriler.map((kat) => (
          <div className="service-category" key={kat}>
            <h3>{kat}</h3>
            {(hizmetler[kat] || []).map((h) => (
              <div className="service-item" key={h._id}>
                <div>
                  <div className="service-item-name">{h.name}</div>
                  <div className="service-item-desc">{h.description} · Yenileme {h.renewalDays} gün</div>
                </div>
                <div className="service-item-meta">
                  <span className="service-item-duration">{h.durationMinutes} dk</span>
                  <span className="service-item-price">{h.price}₺</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* RANDEVU AL */}
      <div className="customer-section" id="randevu" style={{ background: "var(--green-pale)", borderRadius: 20, padding: "48px 32px", maxWidth: 600, margin: "0 auto 48px" }}>
        <h2 style={{ marginBottom: 24 }}>Randevu Al</h2>
        <form onSubmit={kaydet}>
          <div className="form-group"><label>Adınız Soyadınız</label><input type="text" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Ad Soyad" /></div>
          <div className="form-group"><label>Telefon Numaranız</label><input type="text" required value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="05XX XXX XXXX" /></div>
          <div className="form-group"><label>Hizmet</label><select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}><option value="">Hizmet seçin</option>{tumHizmetler.map(h => <option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
          <div className="form-group"><label>Personel Tercihi</label><select value={form.personnelId} onChange={e => setForm({ ...form, personnelId: e.target.value })}><option value="">Fark etmez</option>{personeller.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
          <div className="form-group"><label>Tarih ve Saat</label><input type="datetime-local" required value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })} /></div>
          <button type="submit" className="hero-btn" style={{ width: "100%", textAlign: "center", marginTop: 8 }}>Randevu Oluştur</button>
        </form>
      </div>

      {/* FOOTER */}
      <div className="customer-footer" id="iletisim">
        <h3>randES</h3>
        <p>Güzellik & Bakım Salonu</p>
        <p style={{ marginTop: 8 }}>© 2026 Ceyda Nur Aksoy · Tüm hakları saklıdır</p>
      </div>

      {/* RANDEVU MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Hızlı Randevu</h2>
            <form onSubmit={kaydet}>
              <div className="form-group"><label>Adınız</label><input type="text" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} /></div>
              <div className="form-group"><label>Telefon</label><input type="text" required value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} /></div>
              <div className="form-group"><label>Hizmet</label><select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}><option value="">Seçin</option>{tumHizmetler.map(h => <option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
              <div className="form-group"><label>Personel</label><select value={form.personnelId} onChange={e => setForm({ ...form, personnelId: e.target.value })}><option value="">Fark etmez</option>{personeller.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
              <div className="form-group"><label>Tarih/Saat</label><input type="datetime-local" required value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })} /></div>
              <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Kapat</button><button type="submit" className="btn btn-primary">Randevu Al</button></div>
            </form>
          </div>
        </div>
      )}

      {bildirim && <div className={`toast toast-${bildirim.t}`}>{bildirim.m}</div>}
    </div>
  );
}
