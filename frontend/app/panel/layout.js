"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const menu=[
  {href:"/panel",label:"Anasayfa"},
  {href:"/panel/randevular",label:"Randevular"},
  {href:"/panel/hizmetler",label:"Hizmetler"},
  {href:"/panel/personel",label:"Personel"},
  {href:"/panel/degerlendirme",label:"Değerlendirmeler"},
  {href:"/panel/ai-analiz",label:"AI Analiz"},
];
export default function PanelLayout({children}){
  const pathname=usePathname();const router=useRouter();const[user,setUser]=useState(null);
  useEffect(()=>{const u=localStorage.getItem("randes_user");if(!u){router.push("/giris");return}setUser(JSON.parse(u))},[router]);
  function cikis(){localStorage.removeItem("randes_user");router.push("/")}
  if(!user)return <div className="ld"><div className="sp"></div></div>;
  return(<div className="ad-ly">
    <div className="sb"><div className="sb-logo"><h1>Rand<span>ES</span></h1><p>Yönetim Paneli</p></div>
      <nav><ul className="sb-nav">{menu.map(m=>(<li key={m.href}><Link href={m.href} className={pathname===m.href?"active":""}>{m.label}</Link></li>))}</ul></nav>
      <div className="sb-ft"><div style={{marginBottom:8}}>{user.name||user.email}</div><button onClick={cikis} className="btn btn-sm btn-o" style={{width:"100%",justifyContent:"center",color:"rgba(255,255,255,0.5)",borderColor:"rgba(255,255,255,0.15)"}}>Çıkış Yap</button></div>
    </div><main className="ad-mn">{children}</main>
  </div>);
}
