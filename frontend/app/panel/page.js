"use client";
import { useState, useEffect } from "react";
import { getAppointments, getServices, getPersonnel, getNotifications, getUnconfirmed } from "@/lib/api";
const DT={"onaylandi":"Onaylandı","iptal":"İptal","tamamlandi":"Tamamlandı","beklemede":"Beklemede"};
const DC={"onaylandi":"s","iptal":"d","tamamlandi":"i","beklemede":"w"};
export default function PanelHome(){
  const[s,setS]=useState({r:0,b:0,h:0,p:0});const[son,setSon]=useState([]);const[bild,setBild]=useState([]);const[onz,setOnz]=useState([]);const[lod,setLod]=useState(true);
  useEffect(()=>{yukle()},[]);
  async function yukle(){try{
    const[r,h,p,b]=await Promise.all([getAppointments(),getServices(),getPersonnel(),getNotifications()]);
    const bug=new Date().toDateString();
    const now=new Date();
    setS({r:r.count||0,b:(r.data||[]).filter(x=>new Date(x.appointmentTime).toDateString()===bug).length,h:h.totalCount||0,p:p.count||0});
    setSon((r.data||[]).slice(0,5));
    setBild((b.data||[]).slice(0,4));
    // Sadece bugün ve gelecek tarihli beklemede randevuları göster
    const onayBekleyen=(r.data||[]).filter(x=>x.status==="beklemede"&&new Date(x.appointmentTime)>=new Date(now.getFullYear(),now.getMonth(),now.getDate()));
    setOnz(onayBekleyen.slice(0,5));
  }catch(e){console.error(e)}finally{setLod(false)}}
  if(lod)return <div className="ld"><div className="sp"></div></div>;
  return(<div>
    <div className="ph"><h1>Anasayfa</h1><p>Salonunuzun genel durumu</p></div>
    <div className="st-g">{[["Toplam Randevu",s.r],["Bugün",s.b],["Hizmet",s.h],["Personel",s.p]].map(([l,v])=>(<div className="st-c" key={l}><div className="st-l">{l}</div><div className="st-v">{v}</div></div>))}</div>
    {onz.length>0&&<div style={{marginBottom:20}}><h3 className="sec-t">Onay Bekleyen Randevular</h3>{onz.map(o=>(<div className="alert" key={o._id}><p><strong>{o.customerName}</strong> — {o.serviceId?.name} · {new Date(o.appointmentTime).toLocaleString("tr-TR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p></div>))}</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div className="card"><h3 className="sec-t">Son Randevular</h3>{son.length===0?<p style={{color:"var(--text-light)",fontSize:13}}>Randevu yok</p>:son.map(r=>(<div key={r._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}><div><div style={{fontWeight:600,fontSize:13}}>{r.customerName}</div><div style={{fontSize:11,color:"var(--text-light)"}}>{r.serviceId?.name} · {r.personnelId?.name}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,color:"var(--text-light)"}}>{new Date(r.appointmentTime).toLocaleDateString("tr-TR")}</div><span className={`badge badge-${DC[r.status]||"w"}`}>{DT[r.status]||r.status}</span></div></div>))}</div>
      <div className="card"><h3 className="sec-t">Personel Bildirimleri</h3>{bild.length===0?<p style={{color:"var(--text-light)",fontSize:13}}>Bugün bildirim yok</p>:bild.map(b=>(<div key={b.appointmentId} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}><div style={{fontSize:13}}>{b.message}</div></div>))}</div>
    </div>
  </div>);
}
