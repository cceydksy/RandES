"use client";
import Link from "next/link";
const G=[
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop",
];
const O=[
  {i:"📅",t:"Randevu Yönetimi",d:"Kolayca randevu oluşturun, onaylayın ve takip edin. Başlangıç ve bitiş saatleri otomatik hesaplanır."},
  {i:"✂️",t:"Hizmet Kataloğu",d:"Hizmetlerinizi kategorilere ayırın, fiyat ve süre bilgilerini yönetin. Özel kategoriler oluşturun."},
  {i:"👥",t:"Personel Takibi",d:"Personelinizin uzmanlık alanlarını, randevularını ve aylık kazançlarını detaylı takip edin."},
  {i:"🔔",t:"Akıllı Bildirimler",d:"Personele otomatik randevu bildirimleri. Onaylanmayan randevuları anında tespit edin."},
  {i:"🤖",t:"AI Müşteri Analizi",d:"Yapay zeka ile müşteri kayıp riskini analiz edin ve otomatik hatırlatma mesajları oluşturun."},
  {i:"⭐",t:"Değerlendirme",d:"İşlem sonrası müşterilerinize WhatsApp üzerinden tek tıkla değerlendirme isteği gönderin."},
];
export default function Landing(){return(<div>
  <div className="ln-nav"><div className="ln-logo">Rand<span>ES</span></div><div className="ln-btns"><Link href="/giris" className="btn btn-o">Giriş Yap</Link><Link href="/giris?mod=kayit" className="btn btn-m">Kayıt Ol</Link></div></div>
  <div className="ln-hero"><h1>Rand<span>ES</span></h1><p>Güzellik salonunuz için tasarlanmış akıllı randevu yönetim sistemi. Randevularınızı düzenleyin, personelinizi yönetin, müşterilerinizi kaybetmeyin.</p><Link href="/giris" className="btn btn-lg btn-p">Hemen Başla</Link></div>
  <div className="ln-feat"><h2>Neden RandES?</h2><div className="feat-g">{O.map((o,i)=>(<div className="feat-c" key={i}><div className="feat-i">{o.i}</div><h3>{o.t}</h3><p>{o.d}</p></div>))}</div></div>
  <div className="ln-gal"><h2>Güzellik Sektöründe Fark Yaratın</h2><div className="gal-t">{[...G,...G].map((g,i)=>(<div className="gal-i" key={i}><img src={g} alt="" loading="lazy"/></div>))}</div></div>
  <div className="ln-ct"><h2>İletişim</h2><p>📧 <a href="mailto:ceydanurr82@gmail.com">ceydanurr82@gmail.com</a></p></div>
  <div className="ln-ft"><span>RandES</span> · Güzellik Salonu Randevu Yönetim Sistemi · © 2026 Ceyda Nur Aksoy</div>
</div>)}
