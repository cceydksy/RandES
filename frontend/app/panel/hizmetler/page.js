"use client";
import { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService } from "@/lib/api";

const KAT = ["Kirpik","Saç","Makyaj","Tırnak","Cilt Bakımı","Diğer"];

export default function Hizmetler() {
  const [data, setData] = useState({});
  const [cats, setCats] = useState([]);
  const [lod, setLod] = useState(true);
  const [modal, setModal] = useState(null); // null | "ekle" | {edit obj}
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({name:"",category:"Kirpik",price:"",durationMinutes:"",renewalDays:"",description:""});

  useEffect(()=>{yukle()},[]);
  async function yukle(){try{const r=await getServices(); setData(r.data||{}); setCats(r.categories||[]);}catch(e){console.error(e)} finally{setLod(false)}}

  function formAc(h) {
    if (h) { setForm({name:h.name,category:"",price:h.price,durationMinutes:h.durationMinutes,renewalDays:h.renewalDays,description:h.description||""}); setModal({id:h._id}); }
    else { setForm({name:"",category:"Kirpik",price:"",durationMinutes:"",renewalDays:"",description:""}); setModal("ekle"); }
  }

  async function kaydet(e) {
    e.preventDefault();
    const d = {...form,price:Number(form.price),durationMinutes:Number(form.durationMinutes),renewalDays:Number(form.renewalDays)};
    let r;
    if (modal === "ekle") r = await createService(d);
    else r = await updateService(modal.id, d);
    if(r.success){msg(modal==="ekle"?"Hizmet eklendi":"Hizmet güncellendi","success"); setModal(null); yukle();}
    else msg(r.message||"Hata","error");
  }

  async function sil(id) {
    if(!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    const r = await deleteService(id);
    if(r.success){msg("Hizmet silindi","success"); yukle();}
    else msg(r.message||"Silinemedi","error");
  }

  function msg(m,t){setToast({m,t}); setTimeout(()=>setToast(null),3000)}
  if(lod) return <div className="loading"><div className="spinner"></div></div>;

  return(<div>
    <div className="page-header page-header-row"><div><h1>Hizmetler</h1><p>Hizmet ekleyin, düzenleyin veya kaldırın</p></div><button className="btn btn-primary" onClick={()=>formAc(null)}>+ Yeni Hizmet</button></div>
    {cats.length===0?<div className="card empty-state"><p>Henüz hizmet yok</p><button className="btn btn-primary" onClick={()=>formAc(null)}>İlk Hizmeti Ekle</button></div>:
    <div className="card">{cats.map(c=>(<div className="svc-cat" key={c}><h3>{c}</h3>
      {(data[c]||[]).map(h=>(<div className="svc-row" key={h._id}>
        <div><div className="svc-name">{h.name}</div><div className="svc-desc">{h.description} · Yenileme {h.renewalDays} gün</div></div>
        <div className="svc-meta">
          <span className="svc-dur">{h.durationMinutes} dk</span>
          <span className="svc-price">{h.price}₺</span>
          <button className="btn btn-sm btn-outline" onClick={()=>formAc(h)}>Düzenle</button>
          <button className="btn btn-sm btn-danger" onClick={()=>sil(h._id)}>Sil</button>
        </div>
      </div>))}
    </div>))}</div>}

    {modal&&<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <h2>{modal==="ekle"?"Yeni Hizmet":"Hizmeti Düzenle"}</h2><form onSubmit={kaydet}>
      <div className="form-group"><label>Hizmet Adı</label><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Örn: İpek Kirpik"/></div>
      {modal==="ekle"&&<div className="form-group"><label>Kategori</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{KAT.map(k=><option key={k} value={k}>{k}</option>)}</select></div>}
      <div className="form-row"><div className="form-group"><label>Fiyat (₺)</label><input type="number" required min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
      <div className="form-group"><label>Süre (dk)</label><input type="number" required min="1" value={form.durationMinutes} onChange={e=>setForm({...form,durationMinutes:e.target.value})}/></div></div>
      <div className="form-group"><label>Yenileme (gün)</label><input type="number" required min="1" value={form.renewalDays} onChange={e=>setForm({...form,renewalDays:e.target.value})}/></div>
      <div className="form-group"><label>Açıklama</label><textarea rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
      <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-primary">{modal==="ekle"?"Ekle":"Güncelle"}</button></div>
    </form></div></div>}
    {toast&&<div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}
