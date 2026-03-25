"use client";
import { useState, useEffect } from "react";
import { getPersonnel, createPersonnel, getEarnings } from "@/lib/api";

const UZ = ["Kirpik","Saç","Makyaj","Tırnak","Cilt Bakımı","Diğer"];

export default function Personel() {
  const [per, setPer] = useState([]);
  const [kaz, setKaz] = useState([]);
  const [lod, setLod] = useState(true);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("liste");
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({name:"",phone:"",specialties:[],commissionRate:30});

  useEffect(()=>{yukle()},[]);
  async function yukle(){try{const[p,k]=await Promise.all([getPersonnel(),getEarnings({})]); setPer(p.data||[]); setKaz(k.data||[]);}catch(e){console.error(e)} finally{setLod(false)}}
  async function kaydet(e){e.preventDefault(); const r=await createPersonnel({...form,commissionRate:Number(form.commissionRate)}); if(r.success){msg("Personel eklendi","success"); setModal(false); setForm({name:"",phone:"",specialties:[],commissionRate:30}); yukle();}else msg(r.message||"Hata","error")}
  function uz(u){setForm(f=>({...f,specialties:f.specialties.includes(u)?f.specialties.filter(s=>s!==u):[...f.specialties,u]}))}
  function msg(m,t){setToast({m,t}); setTimeout(()=>setToast(null),3000)}
  if(lod) return <div className="loading"><div className="spinner"></div></div>;

  return(<div>
    <div className="page-header page-header-row"><div><h1>Personel</h1><p>Çalışanlarınızı yönetin</p></div><button className="btn btn-primary" onClick={()=>setModal(true)}>+ Yeni Personel</button></div>
    <div style={{display:"flex",gap:8,marginBottom:20}}><button className={`btn ${tab==="liste"?"btn-primary":"btn-outline"}`} onClick={()=>setTab("liste")}>Personel Listesi</button><button className={`btn ${tab==="kazanc"?"btn-primary":"btn-outline"}`} onClick={()=>setTab("kazanc")}>Hak Ediş</button></div>

    {tab==="liste"&&(per.length===0?<div className="card empty-state"><p>Henüz personel yok</p></div>:
      <div className="card-grid">{per.map(p=>(<div className="card" key={p._id}><h4 style={{fontSize:15,fontWeight:600,marginBottom:4}}>{p.name}</h4><p style={{fontSize:12,color:"var(--text-light)",marginBottom:10}}>{p.phone}</p>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>{p.specialties?.map(u=><span className="tag" key={u}>{u}</span>)}</div>
        <div style={{fontSize:13,fontWeight:600,color:"var(--brown-light)"}}>Prim: %{p.commissionRate}</div></div>))}</div>)}

    {tab==="kazanc"&&(kaz.length===0?<div className="card empty-state"><p>Bu dönem kazanç verisi yok</p></div>:
      kaz.map(k=>(<div className="card" key={k.personnelId} style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h4 style={{fontSize:15,fontWeight:600}}>{k.personnelName}</h4><span className="badge badge-info">Prim %{k.commissionRate}</span></div>
        <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:14}}>
          <div className="stat-card"><div className="stat-label">İşlem</div><div className="stat-value" style={{fontSize:20}}>{k.totalAppointments}</div></div>
          <div className="stat-card"><div className="stat-label">Gelir</div><div className="stat-value" style={{fontSize:20}}>{k.totalRevenue}₺</div></div>
          <div className="stat-card"><div className="stat-label">Kazanç</div><div className="stat-value" style={{fontSize:20,color:"var(--success)"}}>{k.totalEarnings.toFixed(0)}₺</div></div>
        </div>
        <table><thead><tr><th>Tarih</th><th>Hizmet</th><th>Müşteri</th><th>Fiyat</th><th>Prim</th></tr></thead><tbody>
          {k.services.map((s,i)=>(<tr key={i}><td>{new Date(s.date).toLocaleDateString("tr-TR")}</td><td>{s.serviceName}</td><td>{s.customerName}</td><td>{s.price}₺</td><td style={{color:"var(--success)",fontWeight:600}}>{s.commission.toFixed(0)}₺</td></tr>))}
        </tbody></table></div>)))}

    {modal&&<div className="modal-overlay" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>Yeni Personel</h2><form onSubmit={kaydet}>
      <div className="form-group"><label>Ad Soyad</label><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Personel adı"/></div>
      <div className="form-group"><label>Telefon</label><input type="text" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="05XX XXX XXXX"/></div>
      <div className="form-group"><label>Uzmanlık</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{UZ.map(u=>(<button type="button" key={u} className={`btn btn-sm ${form.specialties.includes(u)?"btn-primary":"btn-outline"}`} onClick={()=>uz(u)}>{u}</button>))}</div></div>
      <div className="form-group"><label>Prim (%)</label><input type="number" required min="0" max="100" value={form.commissionRate} onChange={e=>setForm({...form,commissionRate:e.target.value})}/></div>
      <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setModal(false)}>Vazgeç</button><button type="submit" className="btn btn-primary">Kaydet</button></div>
    </form></div></div>}
    {toast&&<div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}
