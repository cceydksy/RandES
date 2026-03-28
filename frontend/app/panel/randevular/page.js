"use client";
import { useState, useEffect } from "react";
import { getAppointments, createAppointment, deleteAppointment, updateConfirmation, updatePersonnel, getServices, getPersonnel } from "@/lib/api";
const DT={"onaylandi":"Onaylandı","iptal":"İptal","tamamlandi":"Tamamlandı","beklemede":"Beklemede"};
const DC={"onaylandi":"s","iptal":"d","tamamlandi":"i","beklemede":"w"};
const PER_PAGE=5;

export default function Randevular(){
  const[data,setData]=useState([]);const[hiz,setHiz]=useState([]);const[hizGrup,setHizGrup]=useState({});const[per,setPer]=useState([]);
  const[lod,setLod]=useState(true);const[modal,setModal]=useState(null);const[toast,setToast]=useState(null);
  const[form,setForm]=useState({customerName:"",customerPhone:"",serviceId:"",personnelId:"",appointmentTime:"",notes:""});
  const[pMod,setPMod]=useState(null);const[page,setPage]=useState(1);
  const[filtreliPersonel,setFiltreliPersonel]=useState([]);

  useEffect(()=>{yukle()},[]);
  async function yukle(){try{const[r,h,p]=await Promise.all([getAppointments(),getServices(),getPersonnel()]);setData(r.data||[]);const t=[];const grp=h.data||{};Object.values(grp).forEach(a=>t.push(...a));setHiz(t);setHizGrup(grp);setPer(p.data||[])}catch(e){console.error(e)}finally{setLod(false)}}

  function hizmetSec(serviceId){
    setForm(f=>({...f,serviceId,personnelId:""}));
    if(!serviceId){setFiltreliPersonel(per);return}
    const secilen=hiz.find(h=>h._id===serviceId);
    if(!secilen){setFiltreliPersonel(per);return}
    // Hizmetin kategorisini bul
    let kategori="";
    for(const[kat,liste] of Object.entries(hizGrup)){if(liste.find(h=>h._id===serviceId)){kategori=kat;break}}
    if(!kategori){setFiltreliPersonel(per);return}
    // Sadece bu kategoride uzmanlığı olan personelleri filtrele
    const uygun=per.filter(p=>p.specialties?.some(s=>s.toLowerCase()===kategori.toLowerCase()));
    setFiltreliPersonel(uygun);
  }

  async function kaydet(e){e.preventDefault();
    // Personel uygunluk kontrolü
    if(form.personnelId&&filtreliPersonel.length>0&&!filtreliPersonel.find(p=>p._id===form.personnelId)){
      msg("Seçilen personel bu hizmette uzman değil!","e");return;
    }
    const r=await createAppointment(form);if(r.success){msg("Randevu oluşturuldu","s");setModal(null);setForm({customerName:"",customerPhone:"",serviceId:"",personnelId:"",appointmentTime:"",notes:""});yukle()}else msg(r.message||"Hata","e")}
  async function sil(id){if(!confirm("Silmek istediğinize emin misiniz?"))return;const r=await deleteAppointment(id);if(r.success){msg("Silindi","s");yukle()}}
  async function durumDegistir(id,d){const r=await updateConfirmation(id,d);if(r.success){msg(d==="onaylandi"?"Onaylandı":d==="iptal"?"İptal edildi":"Tamamlandı olarak işaretlendi","s");yukle()}}
  async function pAta(a,p){const r=await updatePersonnel(a,p);if(r.success){msg("Personel güncellendi","s");setPMod(null);yukle()}}
  function msg(m,t){setToast({m,t});setTimeout(()=>setToast(null),3000)}

  function bitis(apt){
    if(!apt.appointmentTime||!apt.serviceId?.durationMinutes)return"-";
    const b=new Date(new Date(apt.appointmentTime).getTime()+apt.serviceId.durationMinutes*60000);
    return b.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});
  }
  function gecmisMi(apt){return new Date(apt.appointmentTime)<new Date()}

  function butonlar(r){
    const gecmis=gecmisMi(r);const btns=[];
    if(r.status==="beklemede"){
      if(!gecmis){btns.push(<button key="o" className="btn btn-sm btn-s" onClick={()=>durumDegistir(r._id,"onaylandi")}>Onayla</button>);btns.push(<button key="i" className="btn btn-sm btn-d" onClick={()=>durumDegistir(r._id,"iptal")}>İptal</button>)}
      else{btns.push(<button key="t" className="btn btn-sm btn-s" onClick={()=>durumDegistir(r._id,"tamamlandi")}>Tamamlandı</button>);btns.push(<button key="i" className="btn btn-sm btn-d" onClick={()=>durumDegistir(r._id,"iptal")}>İptal</button>)}
    }
    if(r.status==="onaylandi"){
      if(gecmis){btns.push(<button key="t" className="btn btn-sm btn-s" onClick={()=>durumDegistir(r._id,"tamamlandi")}>Tamamlandı</button>)}
      btns.push(<button key="i" className="btn btn-sm btn-d" onClick={()=>durumDegistir(r._id,"iptal")}>İptal</button>);
    }
    btns.push(<button key="s" className="btn btn-sm btn-d" onClick={()=>sil(r._id)}>Sil</button>);
    return btns;
  }

  const totalPages=Math.ceil(data.length/PER_PAGE);
  const paged=data.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const grouped={};
  paged.forEach(r=>{const d=new Date(r.appointmentTime).toLocaleDateString("tr-TR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});if(!grouped[d])grouped[d]=[];grouped[d].push(r)});

  if(lod)return <div className="ld"><div className="sp"></div></div>;
  return(<div>
    <div className="ph ph-r"><div><h1>Randevular</h1><p>Oluşturun, onaylayın ve yönetin</p></div><button className="btn btn-p" onClick={()=>{setModal("y");setFiltreliPersonel(per)}}>+ Yeni Randevu</button></div>
    {data.length===0?<div className="card empty"><p>Henüz randevu yok</p><button className="btn btn-p" onClick={()=>{setModal("y");setFiltreliPersonel(per)}}>İlk Randevuyu Oluştur</button></div>:
    <div>
      {Object.entries(grouped).map(([gun,list])=>(<div className="day-group" key={gun}>
        <div className="day-label">{gun}</div>
        <div className="card" style={{overflow:"auto"}}>
          <table><thead><tr><th>Müşteri</th><th>Telefon</th><th>Hizmet</th><th>Personel</th><th>Başlangıç</th><th>Bitiş</th><th>Durum</th><th style={{width:220}}>İşlem</th></tr></thead>
          <tbody>{list.map(r=>(<tr key={r._id}>
            <td style={{fontWeight:600}}>{r.customerName}</td><td>{r.customerPhone}</td><td>{r.serviceId?.name||"-"}</td>
            <td><span style={{cursor:"pointer",borderBottom:"1px dashed var(--olive)"}} onClick={()=>setPMod(r._id)}>{r.personnelId?.name||"-"}</span></td>
            <td>{new Date(r.appointmentTime).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}</td>
            <td>{bitis(r)}</td>
            <td><span className={`badge badge-${DC[r.status]||"w"}`}>{DT[r.status]||r.status}</span></td>
            <td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{butonlar(r)}</div></td>
          </tr>))}</tbody></table>
        </div>
      </div>))}
      {totalPages>1&&<div className="pag">
        <button disabled={page===1} onClick={()=>setPage(page-1)}>← Önceki</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page===totalPages} onClick={()=>setPage(page+1)}>Sonraki →</button>
      </div>}
    </div>}

    {modal==="y"&&<div className="mo-ov" onClick={()=>setModal(null)}><div className="mo" onClick={e=>e.stopPropagation()}><h2>Yeni Randevu</h2><form onSubmit={kaydet}>
      <div className="fg"><label>Müşteri Adı</label><input type="text" required value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Ad Soyad"/></div>
      <div className="fg"><label>Telefon</label><input type="text" required value={form.customerPhone} onChange={e=>setForm({...form,customerPhone:e.target.value})} placeholder="05XX XXX XXXX"/></div>
      <div className="fr">
        <div className="fg"><label>Hizmet</label><select required value={form.serviceId} onChange={e=>hizmetSec(e.target.value)}><option value="">Seçin</option>{hiz.map(h=><option key={h._id} value={h._id}>{h.name} — {h.price}₺</option>)}</select></div>
        <div className="fg"><label>Personel</label><select required value={form.personnelId} onChange={e=>setForm({...form,personnelId:e.target.value})}>
          <option value="">Seçin</option>
          {filtreliPersonel.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        {form.serviceId&&filtreliPersonel.length===0&&<p style={{fontSize:10,color:"var(--danger)",marginTop:4}}>Bu hizmet için uygun personel bulunamadı</p>}
        {form.serviceId&&filtreliPersonel.length>0&&filtreliPersonel.length<per.length&&<p style={{fontSize:10,color:"var(--success)",marginTop:4}}>Bu hizmette uzman {filtreliPersonel.length} personel listelendi</p>}
        </div>
      </div>
      <div className="fg"><label>Tarih ve Saat</label><input type="datetime-local" required value={form.appointmentTime} onChange={e=>setForm({...form,appointmentTime:e.target.value})}/></div>
      <div className="fg"><label>Not</label><textarea rows="2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Ek not..."/></div>
      <div className="mo-a"><button type="button" className="btn btn-o" onClick={()=>setModal(null)}>Vazgeç</button><button type="submit" className="btn btn-p">Oluştur</button></div>
    </form></div></div>}

    {pMod&&<div className="mo-ov" onClick={()=>setPMod(null)}><div className="mo" onClick={e=>e.stopPropagation()}><h2>Personel Değiştir</h2>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>{per.map(p=>(<button key={p._id} className="btn btn-o" style={{justifyContent:"flex-start"}} onClick={()=>pAta(pMod,p._id)}>{p.name} <span style={{fontSize:11,color:"var(--text-light)",marginLeft:8}}>{p.specialties?.join(", ")}</span></button>))}</div>
      <div className="mo-a"><button className="btn btn-o" onClick={()=>setPMod(null)}>Kapat</button></div>
    </div></div>}
    {toast&&<div className={`toast toast-${toast.t}`}>{toast.m}</div>}
  </div>);
}
