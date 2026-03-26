"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { login as apiLogin, register as apiRegister } from "@/lib/api";

function Form(){
  const router=useRouter();const params=useSearchParams();
  const[mod,setMod]=useState("giris");
  const[form,setForm]=useState({email:"",password:"",name:"",phone:"",businessName:"",tcNo:""});
  const[hata,setHata]=useState("");const[lod,setLod]=useState(false);
  useEffect(()=>{if(params.get("mod")==="kayit")setMod("kayit")},[params]);

  async function gonder(e){e.preventDefault();setLod(true);setHata("");
    try{let r;
      if(mod==="giris")r=await apiLogin({email:form.email,password:form.password});
      else r=await apiRegister({name:form.name,email:form.email,password:form.password,phone:form.phone});
      if(r.success){localStorage.setItem("randes_user",JSON.stringify({...r.data,businessName:form.businessName}));router.push("/panel")}
      else setHata(r.message||"Bir hata oluştu");
    }catch{setHata("Bağlantı hatası")}finally{setLod(false)}
  }

  return(<div className="au-pg"><div className="au-bx">
    <h1>Rand<span>ES</span></h1>
    <p>{mod==="giris"?"Yönetim paneline giriş yapın":"Yeni hesap oluşturun"}</p>
    {hata&&<div style={{background:"#fee2e2",color:"var(--danger)",padding:10,borderRadius:8,fontSize:12,marginBottom:14,textAlign:"center"}}>{hata}</div>}
    <form onSubmit={gonder}>
      {mod==="kayit"&&<>
        <div className="fg"><label>İşletme Adı</label><input type="text" required value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})} placeholder="Salon adınız"/></div>
        <div className="fg"><label>Ad Soyad</label><input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Adınız Soyadınız"/></div>
        <div className="fr">
          <div className="fg"><label>TC Kimlik No</label><input type="text" required maxLength={11} value={form.tcNo} onChange={e=>setForm({...form,tcNo:e.target.value})} placeholder="11 haneli TC No"/></div>
          <div className="fg"><label>Telefon</label><input type="text" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="05XX XXX XXXX"/></div>
        </div>
      </>}
      <div className="fg"><label>E-posta</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="ornek@email.com"/></div>
      <div className="fg"><label>Şifre</label><input type="password" required minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="En az 6 karakter"/></div>
      <button type="submit" className="btn btn-m" style={{width:"100%",justifyContent:"center",padding:12,marginTop:8}} disabled={lod}>{lod?"Yükleniyor...":mod==="giris"?"Giriş Yap":"Kayıt Ol"}</button>
    </form>
    <div className="au-tg">{mod==="giris"?<>Hesabınız yok mu? <a onClick={()=>setMod("kayit")}>Kayıt Ol</a></>:<>Zaten hesabınız var mı? <a onClick={()=>setMod("giris")}>Giriş Yap</a></>}</div>
    <div style={{textAlign:"center",marginTop:16}}><Link href="/" style={{fontSize:11,color:"var(--text-light)"}}>← Ana Sayfaya Dön</Link></div>
  </div></div>);
}
export default function GirisSayfasi(){return <Suspense fallback={<div className="ld"><div className="sp"></div></div>}><Form/></Suspense>}
