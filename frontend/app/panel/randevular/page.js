"use client";
import { useState, useEffect } from "react";
import { getAppointments, createAppointment, deleteAppointment, updateConfirmation, updatePersonnel, getServices, getPersonnel } from "@/lib/api";

export default function Randevular() {
  const [data, setData] = useState([]);
  const [hiz, setHiz] = useState([]);
  const [per, setPer] = useState([]);
  const [lod, setLod] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({customerName:"",customerPhone:"",serviceId:"",personnelId:"",appointmentTime:"",notes:""});
  const [pModal, setPModal] = useState(null);

  useEffect(()=>{yukle()},[]);
  async function yukle(){
    try{
      const [r,h,p]=await Promise.all([getAppointments(),getServices(),getPersonnel()]);
      setData(r.data||[]); const t=[]; Object.values(h.data||{}).forEach(a=>t.push(...a)); setHiz(t); setPer(p.data||[]);
    }catch(e){console.error(e)} finally{setLod(false)}
  }
  async function kaydet(e){e.preventDefault(); const r=await createAppointment(form); if(r.success){msg("Randevu oluşturuldu","success"); setModal(null); setForm({customerName:"",customerPhone:"",serviceId:"",personnelId:"",appointmentTime:"",notes:""}); yukle();} else msg(r.message||"Hata","error");}
  async function sil(id){if(!confirm("Silmek istediğinize emin misiniz?"))return; const r=await deleteAppointment(id); if(r.success){msg("Silindi","success"); yukle();}}
  async function onayla(id,d){const r=await updateConfirmation(id,d); if(r.success){msg(d==="onaylandi"?"Onaylandı":"İptal edildi","success"); yukle();}}
  async function pAta(aId,pId){const r=await updatePersonnel(aId,pId); if(r.success){msg("Personel güncellendi","success"); setPModal(null); yukle();}}
  function msg(m,t){setToast({m,t}); setTimeout(()=>setToast(null),3000);}
  const dr=s=>({onaylandi:"success",iptal:"danger",tamamlandi:"info",beklemede:"warning"}[s]||"warning");
  if(lod) return <div className="loading"><div className="spinner"></div></div>;

  return(<div>
    <div className="page-header page-header-row"><div><h1>Randevular</h1><p>Oluşturun, onaylayın ve yönetin</p></div><button className="btn btn-primary" onClick={()=>setModal("y")}>+ Yeni Randevu</button></div>
    {data.length===0?<div className="card empty-state"><p>Henüz randevu yok</p><button className="btn btn-primary" onClick={()=>setModal("y")}>İlk Randevuyu Oluştur</button></div>:
    <div className="card" style={{overflow:"auto"}}><table><thead><tr><th>Müşteri</th><th>Telefon</th><th>Hizmet</th><th>Personel</th><th>Tarih / Saat</th><th>Durum</th><th style={{width:200}}>İşlem</th></tr></thead><tbody>
      {data.map(r=>(<tr key={r._id}><td style={{fontWeight:600}}>{r.customerName}</td><td>{r.customerPhone}</td><td>{r.serviceId?.name||"-"}</td>
        <td><span style={{cursor:"pointer",borderBottom:"1px dashed var(--green)"}} onClick={()=>setPModal(r._id)}>{r.personnelId?.name||"-"}</span></td>
        <td>{new Date(r.appointmentTime).toLocaleString("tr-TR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</td>
        <td><span className={`badge badge-${dr(r.status)}`}>{r.status}</span></td>
        <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {r.status==="beklemede"&&<><button className="btn btn-sm btn-success" onClick={()=>onayla(r._id,"onaylandi")}>Onayla</button><button className="btn btn-sm btn-danger" onClick={()=>onayla(r._id,"iptal")}>İptal</button></>}
          <button className="btn btn-sm btn-danger" onClick={()=>sil(r._id)}>Sil</button>
        </div></td></tr>))}
    </tbody></table></div>}

    {modal==="y"&&<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>Yeni Randevu</h2><form onSubmit={kaydet}>
      <div className="form-group"><label>Müşteri Adı</label><input type="text" required value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Ad Soyad"/></div>
      <div className="form-group"><label>Telefon</label><input type="text" required value={form.customerPhone} onChange={e=>setForm({...form,customerPhone:e.target.value})} placeholder="05XX XXX XXXX"/></div>
      <div className="form-row"><div className="form-group"><label>Hizmet</label><select required value={form.serviceId} onChange={e=>setForm({...form,serviceId:e.target.value})}><option value="">Seçin</option>{hiz.map(h=><option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
      <div className="form-group"><label>Personel</label><select required value={form.personnelId} onChange={e=>setForm({...form,personnelId:e.target.value})}><option value="">Seçin</option>{per.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}</select></div></div>
      <div className="form-group"><label>Tarih ve Saat</label><input type="datetime-local" required value={form.appointmentTime} onChange={e=>setForm({...form,appointmentTime:e.target.value})}/></div>
      <div className="form-group"><label>Not</label><textarea rows="2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Ek not..."/></div>
      <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-primary">Oluştur</button></div>
    </form></div></div>}

    {pModal&&<div className="modal-overlay" onClick={()=>setPModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>Personel Değiştir</h2>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>{per.map(p=>(<button key={p._id} className="btn btn-outline" style={{justifyContent:"flex-start"}} onClick={()=>pAta(pModal,p._id)}>{p.name} <span style={{fontSize:11,color:"var(--text-light)",marginLeft:8}}>{p.specialties?.join(", ")}</span></button>))}</div>
      <div className="modal-actions"><button className="btn btn-outline" onClick={()=>setPModal(null)}>Kapat</button></div>
    </div></div>}

    {toast&&<div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}
