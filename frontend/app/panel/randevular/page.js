"use client";
import { useState, useEffect } from "react";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, updateConfirmation, updatePersonnel, getServices, getPersonnel } from "@/lib/api";

const DT = { "onaylandı": "Onaylandı", "iptal": "İptal", "tamamlandı": "Tamamlandı", "beklemede": "Beklemede" };
const RENKLER = ["#93bf85", "#455763", "#645d3b", "#d4a04a", "#b54a4a", "#7a5195", "#3498db"];
const SAATLER = Array.from({ length: 13 }, (_, i) => i + 8);
const GUNLER = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function haftaBaslangic(tarih) {
  const d = new Date(tarih);
  const gun = d.getDay();
  const fark = gun === 0 ? -6 : 1 - gun;
  d.setDate(d.getDate() + fark);
  d.setHours(0, 0, 0, 0);
  return d;
}

function haftaGunleri(baslangic) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baslangic);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function ayniGun(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Randevular() {
  const [data, setData] = useState([]); const [hiz, setHiz] = useState([]); const [hizGrup, setHizGrup] = useState({});
  const [per, setPer] = useState([]); const [lod, setLod] = useState(true); const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null); const [detay, setDetay] = useState(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "" });
  const [editForm, setEditForm] = useState({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "" });
  const [editId, setEditId] = useState(null);
  const [filtreliPersonel, setFiltreliPersonel] = useState([]);
  const [editFiltreliPersonel, setEditFiltreliPersonel] = useState([]);
  const [seciliPersonel, setSeciliPersonel] = useState("tumu");
  const [hafta, setHafta] = useState(haftaBaslangic(new Date()));

  useEffect(() => { yukle() }, []);
  async function yukle() {
    try {
      const [r, h, p] = await Promise.all([getAppointments(), getServices(), getPersonnel()]);
      setData(r.data || []);
      const t = []; const grp = h.data || {}; Object.values(grp).forEach(a => t.push(...a)); setHiz(t); setHizGrup(grp);
      setPer(p.data || []);
    } catch (e) { console.error(e) } finally { setLod(false) }
  }

  function hizmetSec(serviceId) {
    setForm(f => ({ ...f, serviceId, personnelId: "" }));
    if (!serviceId) { setFiltreliPersonel(per); return }
    let kategori = "";
    for (const [kat, liste] of Object.entries(hizGrup)) { if (liste.find(h => h._id === serviceId)) { kategori = kat; break } }
    if (!kategori) { setFiltreliPersonel(per); return }
    const uygun = per.filter(p => p.specialties?.some(s => s.toLowerCase() === kategori.toLowerCase()));
    setFiltreliPersonel(uygun);
  }

  function editHizmetSec(serviceId) {
    setEditForm(f => ({ ...f, serviceId, personnelId: "" }));
    if (!serviceId) { setEditFiltreliPersonel(per); return }
    let kategori = "";
    for (const [kat, liste] of Object.entries(hizGrup)) { if (liste.find(h => h._id === serviceId)) { kategori = kat; break } }
    if (!kategori) { setEditFiltreliPersonel(per); return }
    const uygun = per.filter(p => p.specialties?.some(s => s.toLowerCase() === kategori.toLowerCase()));
    setEditFiltreliPersonel(uygun);
  }

  function duzenleAc(apt) {
    const t = new Date(apt.appointmentTime);
    const tarih = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
    setEditForm({
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      serviceId: apt.serviceId?._id || "",
      personnelId: apt.personnelId?._id || "",
      appointmentTime: tarih,
      notes: apt.notes || ""
    });
    setEditId(apt._id);
    setEditFiltreliPersonel(per);
    setDetay(null);
    setModal("d");
  }

  function saatiDuzelt(t) {
    // datetime-local "2026-04-06T09:00" olarak gelir
    // Bunu local timezone ile ISO string'e çevir (UTC'ye dönüşmesin)
    if (!t) return t;
    const [tarih, saat] = t.split("T");
    const [yil, ay, gun] = tarih.split("-").map(Number);
    const [ss, dd] = saat.split(":").map(Number);
    const d = new Date(yil, ay - 1, gun, ss, dd, 0);
    // Timezone offset'i koruyarak ISO string oluştur
    const off = -d.getTimezoneOffset();
    const pad = n => String(Math.abs(n)).padStart(2, "0");
    const sign = off >= 0 ? "+" : "-";
    return `${yil}-${pad(ay)}-${pad(gun)}T${pad(ss)}:${pad(dd)}:00${sign}${pad(Math.floor(off / 60))}:${pad(off % 60)}`;
  }

  async function kaydet(e) {
    e.preventDefault();
    if (form.personnelId && filtreliPersonel.length > 0 && !filtreliPersonel.find(p => p._id === form.personnelId)) { msg("Seçilen personel bu hizmette uzman değil!", "e"); return }
    const veri = { ...form, appointmentTime: saatiDuzelt(form.appointmentTime) };
    const r = await createAppointment(veri); if (r.success) { msg("Randevu oluşturuldu", "s"); setModal(null); setForm({ customerName: "", customerPhone: "", serviceId: "", personnelId: "", appointmentTime: "", notes: "" }); yukle() } else msg(r.message || "Hata", "e")
  }

  async function guncelle(e) {
    e.preventDefault();
    const veri = { ...editForm, appointmentTime: saatiDuzelt(editForm.appointmentTime) };
    const r = await updateAppointment(editId, veri);
    if (r.success) { msg("Randevu güncellendi", "s"); setModal(null); setEditId(null); yukle() } else msg(r.message || "Güncelleme başarısız", "e")
  }

  async function sil(id) { if (!confirm("Silmek istediğinize emin misiniz?")) return; const r = await deleteAppointment(id); if (r.success) { msg("Silindi", "s"); setDetay(null); yukle() } }
  async function durumDegistir(id, d) { const r = await updateConfirmation(id, d); if (r.success) { msg(d === "onaylandı" ? "Onaylandı" : d === "iptal" ? "İptal edildi" : "Tamamlandı", "s"); setDetay(null); yukle() } else { msg(r.message || "Hata", "e") } }
  function msg(m, t) { setToast({ m, t }); setTimeout(() => setToast(null), 3000) }

  function oncekiHafta() { const d = new Date(hafta); d.setDate(d.getDate() - 7); setHafta(d) }
  function sonrakiHafta() { const d = new Date(hafta); d.setDate(d.getDate() + 7); setHafta(d) }
  function bugunHafta() { setHafta(haftaBaslangic(new Date())) }

  const gunler = haftaGunleri(hafta);
  const bugun = new Date();
  const filtreliData = seciliPersonel === "tumu" ? data : data.filter(r => r.personnelId?._id === seciliPersonel);
  const perRenk = {};
  per.forEach((p, i) => { perRenk[p._id] = RENKLER[i % RENKLER.length] });

  function randevuBul(gun, saat) {
    return filtreliData.filter(r => {
      const t = new Date(r.appointmentTime);
      return ayniGun(t, gun) && t.getHours() === saat;
    });
  }

  function bitis(apt) {
    if (!apt.serviceId?.durationMinutes) return "";
    const b = new Date(new Date(apt.appointmentTime).getTime() + apt.serviceId.durationMinutes * 60000);
    return b.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  function gecmisMi(apt) { return new Date(apt.appointmentTime) < new Date() }

  if (lod) return <div className="ld"><div className="sp"></div></div>;

  return (<div>
    <div className="ph ph-r">
      <div><h1>Randevular</h1><p>Takvim görünümü</p></div>
      <button className="btn btn-p" onClick={() => { setModal("y"); setFiltreliPersonel(per) }}>+ Yeni Randevu</button>
    </div>

    {/* Personel Filtreleri */}
    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
      <button className={`btn btn-sm ${seciliPersonel === "tumu" ? "btn-p" : "btn-o"}`} onClick={() => setSeciliPersonel("tumu")}>Tümü</button>
      {per.map((p, i) => (
        <button key={p._id} className={`btn btn-sm ${seciliPersonel === p._id ? "btn-p" : "btn-o"}`}
          style={seciliPersonel === p._id ? { background: perRenk[p._id], borderColor: perRenk[p._id], color: "#fff" } : {}}
          onClick={() => setSeciliPersonel(p._id)}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: perRenk[p._id], display: "inline-block" }}></span> {p.name}
        </button>
      ))}
    </div>

    {/* Hafta Navigasyonu */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <button className="btn btn-sm btn-o" onClick={oncekiHafta}>← Önceki Hafta</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{ fontFamily: "var(--fd)", fontSize: 18, color: "var(--moss)" }}>
          {gunler[0].toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
        </h3>
        <button className="btn btn-sm btn-o" onClick={bugunHafta}>Bugün</button>
      </div>
      <button className="btn btn-sm btn-o" onClick={sonrakiHafta}>Sonraki Hafta →</button>
    </div>

    {/* Takvim Grid */}
    <div className="card" style={{ padding: 0, overflow: "auto" }}>
      <table style={{ minWidth: 800 }}>
        <thead>
          <tr>
            <th style={{ width: 60, padding: "10px 8px", textAlign: "center", background: "var(--cream)", position: "sticky", left: 0, zIndex: 2 }}>Saat</th>
            {gunler.map((g, i) => (
              <th key={i} style={{ padding: "10px 8px", textAlign: "center", background: ayniGun(g, bugun) ? "var(--olive)" : "var(--cream)", color: ayniGun(g, bugun) ? "#fff" : "var(--text-light)", borderRadius: ayniGun(g, bugun) ? 4 : 0, minWidth: 100 }}>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{GUNLER[i]}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{g.getDate()}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SAATLER.map(saat => (
            <tr key={saat}>
              <td style={{ padding: "4px 8px", textAlign: "center", fontSize: 11, color: "var(--text-light)", background: "var(--cream)", position: "sticky", left: 0, zIndex: 1, borderRight: "1px solid var(--border)" }}>{String(saat).padStart(2, "0")}:00</td>
              {gunler.map((g, gi) => {
                const randevular = randevuBul(g, saat);
                return (
                  <td key={gi} style={{ padding: 2, verticalAlign: "top", height: 52, borderRight: "1px solid var(--border)", background: ayniGun(g, bugun) ? "rgba(69,87,99,0.03)" : "transparent" }}>
                    {randevular.map(r => {
                      const renk = perRenk[r.personnelId?._id] || "#645d3b";
                      return (
                        <div key={r._id} onClick={() => setDetay(r)}
                          style={{ background: renk, color: "#fff", padding: "3px 6px", borderRadius: 6, fontSize: 10, marginBottom: 2, cursor: "pointer", lineHeight: 1.3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                          <div style={{ fontWeight: 700 }}>{r.customerName}</div>
                          <div style={{ opacity: 0.85 }}>{r.serviceId?.name}</div>
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Randevu Detay Modal */}
    {detay && <div className="mo-ov" onClick={() => setDetay(null)}><div className="mo" onClick={e => e.stopPropagation()}>
      <h2>Randevu Detayı</h2>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Müşteri</div><div style={{ fontSize: 14, fontWeight: 600 }}>{detay.customerName}</div></div>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Telefon</div><div style={{ fontSize: 14 }}>{detay.customerPhone}</div></div>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Hizmet</div><div style={{ fontSize: 14 }}>{detay.serviceId?.name}</div></div>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Personel</div><div style={{ fontSize: 14 }}>{detay.personnelId?.name}</div></div>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Başlangıç</div><div style={{ fontSize: 14 }}>{new Date(detay.appointmentTime).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div></div>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Bitiş</div><div style={{ fontSize: 14 }}>{bitis(detay)}</div></div>
          <div><div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase" }}>Durum</div><span className={`badge badge-${({ "onaylandı": "s", "iptal": "d", "tamamlandı": "i", "beklemede": "w" })[detay.status] || "w"}`}>{DT[detay.status] || detay.status}</span></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {detay.status === "beklemede" && !gecmisMi(detay) && <><button className="btn btn-sm btn-s" onClick={() => durumDegistir(detay._id, "onaylandı")}>Onayla</button><button className="btn btn-sm btn-d" onClick={() => durumDegistir(detay._id, "iptal")}>İptal</button></>}
        {detay.status === "beklemede" && gecmisMi(detay) && <><button className="btn btn-sm btn-s" onClick={() => durumDegistir(detay._id, "tamamlandı")}>Tamamlandı</button><button className="btn btn-sm btn-d" onClick={() => durumDegistir(detay._id, "iptal")}>İptal</button></>}
        {detay.status === "onaylandı" && gecmisMi(detay) && <button className="btn btn-sm btn-s" onClick={() => durumDegistir(detay._id, "tamamlandı")}>Tamamlandı</button>}
        {detay.status === "onaylandı" && <button className="btn btn-sm btn-d" onClick={() => durumDegistir(detay._id, "iptal")}>İptal</button>}
        <button className="btn btn-sm btn-p" onClick={() => duzenleAc(detay)}>Düzenle</button>
        <button className="btn btn-sm btn-d" onClick={() => sil(detay._id)}>Sil</button>
      </div>
      <div className="mo-a"><button className="btn btn-o" onClick={() => setDetay(null)}>Kapat</button></div>
    </div></div>}

    {/* Yeni Randevu Modal */}
    {modal === "y" && <div className="mo-ov" onClick={() => setModal(null)}><div className="mo" onClick={e => e.stopPropagation()}><h2>Yeni Randevu</h2><form onSubmit={kaydet}>
      <div className="fg"><label>Müşteri Adı</label><input type="text" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Ad Soyad" /></div>
      <div className="fg"><label>Telefon</label><input type="text" required value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="05XX XXX XXXX" /></div>
      <div className="fr">
        <div className="fg"><label>Hizmet</label><select required value={form.serviceId} onChange={e => hizmetSec(e.target.value)}><option value="">Seçin</option>{hiz.map(h => <option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
        <div className="fg"><label>Personel</label><select required value={form.personnelId} onChange={e => setForm({ ...form, personnelId: e.target.value })}>
          <option value="">Seçin</option>{filtreliPersonel.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
          {form.serviceId && filtreliPersonel.length === 0 && <p style={{ fontSize: 10, color: "var(--danger)", marginTop: 4 }}>Bu hizmet için uygun personel yok</p>}
          {form.serviceId && filtreliPersonel.length > 0 && filtreliPersonel.length < per.length && <p style={{ fontSize: 10, color: "var(--success)", marginTop: 4 }}>Bu hizmette uzman {filtreliPersonel.length} personel</p>}
        </div>
      </div>
      <div className="fg"><label>Tarih ve Saat</label><input type="datetime-local" required value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })} /></div>
      <div className="fg"><label>Not</label><textarea rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Ek not..." /></div>
      <div className="mo-a"><button type="button" className="btn btn-o" onClick={() => setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-p">Oluştur</button></div>
    </form></div></div>}

    {/* Randevu Düzenle Modal */}
    {modal === "d" && <div className="mo-ov" onClick={() => setModal(null)}><div className="mo" onClick={e => e.stopPropagation()}><h2>Randevuyu Düzenle</h2><form onSubmit={guncelle}>
      <div className="fg"><label>Müşteri Adı</label><input type="text" required value={editForm.customerName} onChange={e => setEditForm({ ...editForm, customerName: e.target.value })} placeholder="Ad Soyad" /></div>
      <div className="fg"><label>Telefon</label><input type="text" required value={editForm.customerPhone} onChange={e => setEditForm({ ...editForm, customerPhone: e.target.value })} placeholder="05XX XXX XXXX" /></div>
      <div className="fr">
        <div className="fg"><label>Hizmet</label><select required value={editForm.serviceId} onChange={e => editHizmetSec(e.target.value)}><option value="">Seçin</option>{hiz.map(h => <option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
        <div className="fg"><label>Personel</label><select required value={editForm.personnelId} onChange={e => setEditForm({ ...editForm, personnelId: e.target.value })}>
          <option value="">Seçin</option>{editFiltreliPersonel.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select></div>
      </div>
      <div className="fg"><label>Tarih ve Saat</label><input type="datetime-local" required value={editForm.appointmentTime} onChange={e => setEditForm({ ...editForm, appointmentTime: e.target.value })} /></div>
      <div className="fg"><label>Not</label><textarea rows="2" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Ek not..." /></div>
      <div className="mo-a"><button type="button" className="btn btn-o" onClick={() => setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-p">Güncelle</button></div>
    </form></div></div>}

    {toast && <div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}