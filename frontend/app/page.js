"use client";
import Link from "next/link";

const GALERI = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop",
];

const OZELLIKLER = [
  { icon: "📅", baslik: "Randevu Yönetimi", aciklama: "Kolayca randevu oluşturun, onaylayın ve takip edin. Müşterilerinize otomatik hatırlatmalar gönderin." },
  { icon: "✂️", baslik: "Hizmet Kataloğu", aciklama: "Hizmetlerinizi kategorilere ayırın, fiyat ve süre bilgilerini yönetin. Yenileme sürelerini takip edin." },
  { icon: "👥", baslik: "Personel Takibi", aciklama: "Personelinizin uzmanlık alanlarını, randevularını ve aylık kazançlarını detaylı takip edin." },
  { icon: "🔔", baslik: "Akıllı Bildirimler", aciklama: "Personele otomatik randevu bildirimleri gönderin. Onaylanmayan randevuları anında tespit edin." },
  { icon: "🤖", baslik: "AI Müşteri Analizi", aciklama: "Yapay zeka ile müşteri kayıp riskini analiz edin ve otomatik hatırlatma mesajları oluşturun." },
  { icon: "⭐", baslik: "Değerlendirme Sistemi", aciklama: "İşlem sonrası müşterilerinize otomatik Google değerlendirme isteği gönderin." },
];

export default function TanitimSayfasi() {
  return (
    <div>
      {/* NAV */}
      <div className="land-nav">
        <div className="land-logo">rand<span>ES</span></div>
        <div className="land-btns">
          <Link href="/giris" className="btn btn-outline">Giriş Yap</Link>
          <Link href="/giris?mod=kayit" className="btn btn-brown">Kayıt Ol</Link>
        </div>
      </div>

      {/* HERO */}
      <div className="land-hero">
        <h1>rand<span>ES</span></h1>
        <p>Güzellik salonunuz için tasarlanmış akıllı randevu yönetim sistemi. Randevularınızı düzenleyin, personelinizi yönetin, müşterilerinizi kaybetmeyin.</p>
        <Link href="/giris" className="btn btn-lg btn-primary">Hemen Başla</Link>
      </div>

      {/* ÖZELLİKLER */}
      <div className="land-features">
        <h2>Neden randES?</h2>
        <div className="feat-grid">
          {OZELLIKLER.map((o, i) => (
            <div className="feat-card" key={i}>
              <div className="feat-icon">{o.icon}</div>
              <h3>{o.baslik}</h3>
              <p>{o.aciklama}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GALERİ */}
      <div className="land-gallery">
        <h2>Güzellik Sektöründe Fark Yaratın</h2>
        <div className="gallery-track">
          {[...GALERI, ...GALERI].map((g, i) => (
            <div className="gallery-item" key={i}>
              <img src={g} alt="Salon" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* İLETİŞİM */}
      <div className="land-contact" id="iletisim">
        <h2>İletişim</h2>
        <div className="contact-grid">
          <div className="contact-item">
            <div className="ci-icon">📍</div>
            <h4>Adres</h4>
            <p>Isparta, Türkiye</p>
          </div>
          <div className="contact-item">
            <div className="ci-icon">📧</div>
            <h4>E-posta</h4>
            <p>ceydanurr82@gmail.com</p>
          </div>
          <div className="contact-item">
            <div className="ci-icon">📞</div>
            <h4>Telefon</h4>
            <p>+90 5XX XXX XX XX</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="land-footer">
        <span>randES</span> · Güzellik Salonu Randevu Yönetim Sistemi · © 2026 Ceyda Nur Aksoy
      </div>
    </div>
  );
}
