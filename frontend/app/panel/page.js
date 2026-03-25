"use client";
import { useState, useEffect } from "react";
import { getAppointments, getServices, getPersonnel, getNotifications, getUnconfirmed } from "@/lib/api";

export default function PanelAnasayfa() {
  const [s, setS] = useState({ r: 0, b: 0, h: 0, p: 0 });
  const [son, setSon] = useState([]);
  const [bild, setBild] = useState([]);
  const [onaysiz, setOnaysiz] = useState([]);
  const [lod, setLod] = useState(true);

  useEffect(() => { yukle(); }, []);
  async function yukle() {
    try {
      const [r, h, p, b, o] = await Promise.all([getAppointments(), getServices(), getPersonnel(), getNotifications(), getUnconfirmed()]);
      const bug = new Date().toDateString();
      setS({ r: r.count||0, b: (r.data||[]).filter(x => new Date(x.appointmentTime).toDateString()===bug).length, h: h.totalCount||0, p: p.count||0 });
      setSon((r.data||[]).slice(0,5)); setBild((b.data||[]).slice(0,4)); setOnaysiz((o.data||[]).slice(0,3));
    } catch(e){console.error(e)} finally{setLod(false)}
  }
  const dr = s => ({onaylandi:"success",iptal:"danger",tamamlandi:"info",beklemede:"warning"}[s]||"warning");
  if(lod) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Anasayfa</h1><p>Salonunuzun genel durumu</p></div>
      <div className="stats-grid">
        {[["Toplam Randevu",s.r],["Bugün",s.b],["Hizmet",s.h],["Personel",s.p]].map(([l,v])=>(
          <div className="stat-card" key={l}><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div>
        ))}
      </div>
      {onaysiz.length>0 && <div style={{marginBottom:20}}><h3 className="section-title">Onay Bekleyen Randevular</h3>
        {onaysiz.map(o=>(<div className="alert-card" key={o._id}><p><strong>{o.customerName}</strong> — {o.serviceId?.name} · {new Date(o.appointmentTime).toLocaleString("tr-TR")}</p></div>))}
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div className="card"><h3 className="section-title">Son Randevular</h3>
          {son.length===0?<p style={{color:"var(--text-light)",fontSize:13}}>Randevu yok</p>:
          son.map(r=>(<div key={r._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            <div><div style={{fontWeight:600,fontSize:13}}>{r.customerName}</div><div style={{fontSize:11,color:"var(--text-light)"}}>{r.serviceId?.name} · {r.personnelId?.name}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"var(--text-light)"}}>{new Date(r.appointmentTime).toLocaleDateString("tr-TR")}</div><span className={`badge badge-${dr(r.status)}`}>{r.status}</span></div>
          </div>))}
        </div>
        <div className="card"><h3 className="section-title">Personel Bildirimleri</h3>
          {bild.length===0?<p style={{color:"var(--text-light)",fontSize:13}}>Bugün bildirim yok</p>:
          bild.map(b=>(<div key={b.appointmentId} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}><div style={{fontSize:13}}>{b.message}</div></div>))}
        </div>
      </div>
    </div>
  );
}
