"use client";
import { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService } from "@/lib/api";
const KAT=["Kirpik","Saç","Makyaj","Tırnak","Cilt Bakımı","Diğer"];

export default function Hizmetler(){
  const[data,setData]=useState({});const[cats,setCats]=useState([]);const[lod,setLod]=useState(true);
  const[modal,setModal]=useState(null);const[toast,setToast]=useState(null);
  const[form,setForm]=useState({name:"",category:"Kirpik",customCategory:"",price:"",durationMinutes:"",renewalDays:"",noRenewal:false,description:""});

  useEffect(()=>{yukle()},[]);
  async function yukle(){try{const r=await getServices();setData(r.data||{});setCats(r.categories||[])}catch(e){console.error(e)}finally{setLod(false)}}

  function formAc(h){
    if(h){setForm({name:h.name,category:"",customCategory:"",price:h.price,durationMinutes:h.durationMinutes,renewalDays:h.renewalDays||"",noRenewal:!h.renewalDays||h.renewalDays>=365,description:h.description||""});setModal({id:h._id})}
    else{setForm({name:"",category:"Kirpik",customCategory:"",price:"",durationMinutes:"",renewalDays:"",noRenewal:false,description:""});setModal("ekle")}
  }

  async function kaydet(e){e.preventDefault();
    const cat=form.category==="Diğer"?form.customCategory:form.category;
    const d={name:form.name,category:cat||form.category,price:Number(form.price),durationMinutes:Number(form.durationMinutes),renewalDays:form.noRenewal?999:Number(form.renewalDays),description:form.description};
    let r;
    if(modal==="ekle")r=await createService(d);else r=await updateService(modal.id,d);
    if(r.success){msg(modal==="ekle"?"Hizmet eklendi":"Hizmet güncellendi","s");setModal(null);yukle()}
    else msg(r.message||"Hata","e");
  }

  async function sil(id){if(!confirm("Bu hizmeti silmek istediğinize emin misiniz?"))return;const r=await deleteService(id);if(r.success){msg("Hizmet silindi","s");yukle()}else msg(r.message||"Silinemedi","e")}
  function msg(m,t){setToast({m,t});setTimeout(()=>setToast(null),3000)}
  if(lod)return <div className="ld"><div className="sp"></div></div>;

  return(<div>
    <div className="ph ph-r"><div><h1>Hizmetler</h1><p>Hizmet ekleyin, düzenleyin veya kaldırın</p></div><button className="btn btn-p" onClick={()=>formAc(null)}>+ Yeni Hizmet</button></div>
    {cats.length===0?<div className="card empty"><p>Henüz hizmet yok</p><button className="btn btn-p" onClick={()=>formAc(null)}>İlk Hizmeti Ekle</button></div>:
    <div className="card">{cats.map(c=>(<div className="svc-cat" key={c}><h3>{c}</h3>
      {(data[c]||[]).map(h=>(<div className="svc-r" key={h._id}><div><div className="svc-n">{h.name}</div><div className="svc-d">{h.description}{h.renewalDays&&h.renewalDays<365?` · Yenileme ${h.renewalDays} gün`:h.renewalDays>=365?" · Tek seferlik":""}</div></div>
        <div className="svc-m"><span className="svc-du">{h.durationMinutes} dk</span><span className="svc-p">{h.price}₺</span><button className="btn btn-sm btn-o" onClick={()=>formAc(h)}>Düzenle</button><button className="btn btn-sm btn-d" onClick={()=>sil(h._id)}>Sil</button></div></div>))}
    </div>))}</div>}

    {modal&&<div className="mo-ov" onClick={()=>setModal(null)}><div className="mo" onClick={e=>e.stopPropagation()}>
      <h2>{modal==="ekle"?"Yeni Hizmet":"Hizmeti Düzenle"}</h2><form onSubmit={kaydet}>
      <div className="fg"><label>Hizmet Adı</label><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Örn: İpek Kirpik"/></div>
      {modal==="ekle"&&<><div className="fg"><label>Kategori</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{KAT.map(k=><option key={k} value={k}>{k}</option>)}</select></div>
      {form.category==="Diğer"&&<div className="fg"><label>Özel Kategori Adı</label><input type="text" required value={form.customCategory} onChange={e=>setForm({...form,customCategory:e.target.value})} placeholder="Örn: Epilasyon, Kaş Tasarımı"/></div>}</>}
      <div className="fr"><div className="fg"><label>Fiyat (₺)</label><input type="number" required min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
      <div className="fg"><label>Süre (dk)</label><input type="number" required min="1" value={form.durationMinutes} onChange={e=>setForm({...form,durationMinutes:e.target.value})}/></div></div>
      <div className="fg"><label style={{display:"flex",alignItems:"center",gap:8}}><input type="checkbox" checked={form.noRenewal} onChange={e=>setForm({...form,noRenewal:e.target.checked})} style={{width:"auto"}}/> Yenileme süresi yok (tek seferlik)</label></div>
      {!form.noRenewal&&<div className="fg"><label>Yenileme Süresi (gün)</label><input type="number" required min="1" value={form.renewalDays} onChange={e=>setForm({...form,renewalDays:e.target.value})}/></div>}
      <div className="fg"><label>Açıklama</label><textarea rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
      <div className="mo-a"><button type="button" className="btn btn-o" onClick={()=>setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-p">{modal==="ekle"?"Ekle":"Güncelle"}</button></div>
    </form></div></div>}
    {toast&&<div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}
