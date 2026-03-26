"use client";
import { useState, useEffect } from "react";
import { getAppointments } from "@/lib/api";
export default function Degerlendirme(){
  const[data,setData]=useState([]);const[lod,setLod]=useState(true);
  useEffect(()=>{yukle()},[]);
  async function yukle(){try{const r=await getAppointments();const tamamlanan=(r.data||[]).filter(a=>a.status==="tamamlandi"&&!a.reviewSentAt);setData(tamamlanan)}catch(e){console.error(e)}finally{setLod(false)}}

  function waLink(apt){
    const tel=apt.customerPhone?.replace(/\s/g,"").replace(/^0/,"90");
    const mesaj=`Merhaba ${apt.customerName}! 😊 Bugün yaptırdığınız ${apt.serviceId?.name||"işlem"} hizmetinden memnun kaldıysanız bizi Google üzerinden değerlendirmeniz bizi çok mutlu eder. Teşekkür ederiz! ⭐`;
    return `https://wa.me/${tel}?text=${encodeURIComponent(mesaj)}`;
  }

  if(lod)return <div className="ld"><div className="sp"></div></div>;
  return(<div>
    <div className="ph"><h1>Değerlendirmeler</h1><p>Tamamlanan işlemler için müşterilerinize değerlendirme isteği gönderin</p></div>
    {data.length===0?<div className="card empty"><p>Değerlendirme bekleyen işlem yok</p></div>:
    <div className="card-g">{data.map(a=>(<div className="card" key={a._id}>
      <h4 style={{fontSize:14,fontWeight:600,marginBottom:4}}>{a.customerName}</h4>
      <p style={{fontSize:12,color:"var(--text-light)",marginBottom:4}}>{a.customerPhone}</p>
      <p style={{fontSize:12,color:"var(--text-light)",marginBottom:12}}>{a.serviceId?.name} · {new Date(a.appointmentTime).toLocaleDateString("tr-TR")}</p>
      <a href={waLink(a)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm" style={{width:"100%",justifyContent:"center"}}>WhatsApp ile Gönder</a>
    </div>))}</div>}
  </div>);
}
