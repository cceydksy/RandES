"use client";
import { useState, useEffect } from "react";
import { getAppointments } from "@/lib/api";

const VARSAYILAN = {
  degerlendirme: "Merhaba {musteri}! 😊 Bugün yaptırdığınız {hizmet} hizmetinden memnun kaldıysanız bizi Google üzerinden değerlendirmeniz bizi çok mutlu eder. Teşekkür ederiz! ⭐",
  hatirlatma: "Merhaba {musteri}! 🌸 {hizmet} hizmetinizin yenileme zamanı geldi. Sizi tekrar salonumuzda görmek isteriz. Randevu almak için bize ulaşabilirsiniz!",
  onay: "Merhaba {musteri}! 📅 {tarih} tarihinde saat {saat}'da {hizmet} randevunuz bulunmaktadır. Randevunuzu onaylıyor musunuz?",
  iptal: "Merhaba {musteri}, {tarih} tarihindeki {hizmet} randevunuz iptal edilmiştir. Yeni randevu almak için bizimle iletişime geçebilirsiniz.",
};

export default function Degerlendirme(){
  const[data,setData]=useState([]);const[lod,setLod]=useState(true);
  const[tab,setTab]=useState("gonder");const[toast,setToast]=useState(null);
  const[sab,setSab]=useState(VARSAYILAN);
  const[ek,setEk]=useState(null);const[ev,setEv]=useState("");

  useEffect(()=>{
    const s=localStorage.getItem("randes_sablonlar");
    if(s)setSab(JSON.parse(s));
    yukle();
  },[]);

  async function yukle(){try{const r=await getAppointments();setData((r.data||[]).filter(a=>a.status==="tamamlandi"))}catch(e){console.error(e)}finally{setLod(false)}}

  function waLink(apt,sab){
    const tel=apt.customerPhone?.replace(/\s/g,"").replace(/^0/,"90");
    const tarih=new Date(apt.appointmentTime).toLocaleDateString("tr-TR");
    const saat=new Date(apt.appointmentTime).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});
    const m=sab.replace("{musteri}",apt.customerName).replace("{hizmet}",apt.serviceId?.name||"işlem").replace("{tarih}",tarih).replace("{saat}",saat);
    return `https://wa.me/${tel}?text=${encodeURIComponent(m)}`;
  }

  function kaydet(){const y={...sab,[ek]:ev};setSab(y);localStorage.setItem("randes_sablonlar",JSON.stringify(y));setEk(null);msg("Şablon güncellendi","s")}
  function sifirla(){setSab(VARSAYILAN);localStorage.setItem("randes_sablonlar",JSON.stringify(VARSAYILAN));msg("Varsayılana sıfırlandı","s")}
  function msg(m,t){setToast({m,t});setTimeout(()=>setToast(null),3000)}

  const ad={degerlendirme:"Değerlendirme Mesajı",hatirlatma:"Hatırlatma Mesajı",onay:"Randevu Onay Mesajı",iptal:"İptal Mesajı"};

  if(lod)return <div className="ld"><div className="sp"></div></div>;
  return(<div>
    <div className="ph"><h1>Değerlendirmeler & Mesajlar</h1><p>Müşterilerinize mesaj gönderin ve şablonlarınızı yönetin</p></div>
    <div style={{display:"flex",gap:8,marginBottom:20}}>
      <button className={`btn ${tab==="gonder"?"btn-p":"btn-o"}`} onClick={()=>setTab("gonder")}>Mesaj Gönder</button>
      <button className={`btn ${tab==="sablon"?"btn-p":"btn-o"}`} onClick={()=>setTab("sablon")}>Mesaj Şablonları</button>
    </div>

    {tab==="gonder"&&(data.length===0?<div className="card empty"><p>Değerlendirme bekleyen işlem yok</p></div>:
      <div className="card-g">{data.map(a=>(<div className="card" key={a._id}>
        <h4 style={{fontSize:14,fontWeight:600,marginBottom:4}}>{a.customerName}</h4>
        <p style={{fontSize:12,color:"var(--text-light)",marginBottom:4}}>{a.customerPhone}</p>
        <p style={{fontSize:12,color:"var(--text-light)",marginBottom:12}}>{a.serviceId?.name} · {new Date(a.appointmentTime).toLocaleDateString("tr-TR")}</p>
        <a href={waLink(a,sab.degerlendirme)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm" style={{width:"100%",justifyContent:"center"}}>WhatsApp ile Gönder</a>
      </div>))}</div>)}

    {tab==="sablon"&&(<div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}><button className="btn btn-sm btn-o" onClick={sifirla}>Varsayılana Sıfırla</button></div>
      {Object.entries(sab).map(([k,v])=>(<div className="card" key={k} style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h4 style={{fontSize:14,fontWeight:600,color:"var(--moss)"}}>{ad[k]||k}</h4>
          {ek!==k&&<button className="btn btn-sm btn-o" onClick={()=>{setEk(k);setEv(v)}}>Düzenle</button>}
        </div>
        {ek===k?(<div>
          <textarea rows="4" value={ev} onChange={e=>setEv(e.target.value)} style={{width:"100%",padding:10,border:"1.5px solid var(--border)",borderRadius:8,fontSize:13,fontFamily:"var(--fb)",resize:"vertical"}}/>
          <p style={{fontSize:10,color:"var(--text-light)",margin:"6px 0 12px"}}>Değişkenler: {"{musteri}"} {"{hizmet}"} {"{tarih}"} {"{saat}"}</p>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button className="btn btn-sm btn-o" onClick={()=>setEk(null)}>Vazgeç</button><button className="btn btn-sm btn-p" onClick={kaydet}>Kaydet</button></div>
        </div>):(<p style={{fontSize:13,color:"var(--text)",lineHeight:1.6,background:"var(--cream)",padding:12,borderRadius:8}}>{v}</p>)}
      </div>))}
    </div>)}
    {toast&&<div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}
