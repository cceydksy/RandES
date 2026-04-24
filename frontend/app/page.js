"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const O=[
  {i:"📅",t:"Akıllı Takvim",d:"Haftalık takvim görünümü, sürükle-bırak randevu ve otomatik saat hesaplama."},
  {i:"💬",t:"SMS Hatırlatma",d:"Müşterilerinize otomatik randevu hatırlatma mesajları gönderin."},
  {i:"👥",t:"Personel Yönetimi",d:"Uzmanlık alanları, prim oranları ve aylık hak ediş takibi."},
  {i:"🤖",t:"AI Analiz",d:"Gemini AI ile müşteri kayıp riski tespiti ve kişisel hatırlatma mesajları."},
  {i:"✂️",t:"Hizmet Kataloğu",d:"Kategorize hizmetler, fiyat ve süre yönetimi."},
  {i:"📊",t:"Gelir Raporu",d:"Aylık personel bazında gelir, komisyon ve performans dökümü."},
];

const STATS=[
  {n:"148",l:"SMS Gönderildi"},
  {n:"%94",l:"Onay Oranı"},
  {n:"12",l:"Günlük Randevu"},
  {n:"₺3.450",l:"Günlük Gelir"},
];

const MSGS=[
  {type:"out",name:"RandES",text:"Merhaba Ayşe Hanım, yarın saat 14:00'te Saç Bakımı randevunuz bulunmaktadır. ✨"},
  {type:"in",name:"Ayşe",text:"Teşekkürler, onaylıyorum ✓"},
  {type:"out",name:"RandES",text:"Merve Hanım, sizi özledik! Size özel %15 indirim fırsatı 💜"},
];

export default function Landing(){
  const [vis, setVis] = useState(false);
  useEffect(()=>{ setVis(true) },[]);

  return(<div>
    <div className="ln-nav">
      <div className="ln-logo">Rand<span>ES</span></div>
      <div className="ln-btns">
        <Link href="/giris" className="btn btn-o">Giriş Yap</Link>
        <Link href="/giris?mod=kayit" className="btn btn-m">Kayıt Ol</Link>
      </div>
    </div>

    <div className="ln-hero">
      <div className="hero-left" style={{opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease'}}>
        <p className="hero-tag">✨ Güzellik Salonları İçin</p>
        <h1>Randevudan<br/>hatırlatmaya,<br/><span>tek panelde.</span></h1>
        <p className="hero-desc">Randevularınızı yönetin, müşterilerinize otomatik SMS gönderin, yapay zeka ile kayıp riskini analiz edin.</p>
        <div className="hero-btns">
          <Link href="/giris?mod=kayit" className="btn btn-lg btn-p">Ücretsiz Deneyin</Link>
          <Link href="#ozellikler" className="btn btn-lg btn-ghost">Özellikleri Gör ↓</Link>
        </div>
      </div>
      <div className="hero-right" style={{opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1s ease 0.3s'}}>
        <div className="phone-mock">
          <div className="phone-header"><span>RandES</span><small>SMS Bildirimleri</small></div>
          <div className="phone-msgs">
            {MSGS.map((m,i)=>(<div key={i} className={`sms sms-${m.type}`}><strong>{m.name}</strong><p>{m.text}</p></div>))}
          </div>
        </div>
      </div>
    </div>

    <div className="ln-stats">
      {STATS.map((s,i)=>(<div key={i} className="stat-item"><span className="stat-num">{s.n}</span><span className="stat-lbl">{s.l}</span></div>))}
    </div>

    <div className="ln-feat" id="ozellikler">
      <p className="feat-tag">Özellikler</p>
      <h2>Salonunuz İçin Her Şey Tek Yerde</h2>
      <div className="feat-g">
        {O.map((o,i)=>(<div className="feat-c" key={i}>
          <div className="feat-i">{o.i}</div>
          <h3>{o.t}</h3>
          <p>{o.d}</p>
        </div>))}
      </div>
    </div>

    <div className="ln-cta">
      <h2>Salonunuzu Dijitale Taşıyın</h2>
      <p>Hemen kayıt olun, randevu yönetiminizi kolaylaştırın.</p>
      <Link href="/giris?mod=kayit" className="btn btn-lg btn-p">Kayıt Ol</Link>
    </div>

    <div className="ln-ct">
      <h2>İletişim</h2>
      <p>📧 <a href="mailto:ceydanurr82@gmail.com">ceydanurr82@gmail.com</a></p>
    </div>

    <div className="ln-ft"><span>RandES</span> · Güzellik Salonu Randevu Yönetim Sistemi · © 2026 Ceyda Nur Aksoy</div>
  </div>)}
