"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const days = ["Pzt", "Sal", "Çar", "Per", "Cum"];
  const hours = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
  const appointments = [
    { day: 0, hour: 0, staff: "elif", name: "Ayşe K.", service: "Saç Kesim" },
    { day: 1, hour: 2, staff: "ayse", name: "Fatma B.", service: "Manikür" },
    { day: 2, hour: 1, staff: "merve", name: "Zeynep A.", service: "Boya" },
    { day: 2, hour: 4, staff: "elif", name: "Selin T.", service: "Fön" },
    { day: 3, hour: 3, staff: "ayse", name: "Elif Y.", service: "Cilt Bakım" },
    { day: 4, hour: 0, staff: "merve", name: "Derya M.", service: "Röfle" },
    { day: 4, hour: 5, staff: "elif", name: "Burcu S.", service: "Kaş" },
  ];

  return (
    <div className="ln-wrapper-new">
      <header className={`ln-nav-new ${scrolled ? "ln-nav-scrolled" : ""}`}>
        <div className="ln-nav-inner">
          <Link href="/" className="ln-logo-new">
            <span className="ln-logo-r">R</span>and<span className="ln-logo-es">ES</span>
          </Link>
          <nav className="ln-nav-links">
            <a href="#ozellikler">Özellikler</a>
            <a href="#takvim">Takvim</a>
            <a href="#iletisim">İletişim</a>
          </nav>
          <div className="ln-nav-cta">
            <Link href="/giris" className="ln-nav-login">Giriş Yap</Link>
            <Link href="/giris" className="ln-nav-register">Ücretsiz Başla</Link>
          </div>
        </div>
      </header>

      <section className="ln-hero-new">
        <div className="ln-hero-inner">
          <span className="hero-tag-light">✨ Güzellik salonları için dijital çözüm</span>
          <h1 className="hero-title-light">
            Salonunuzu<br />
            <em>Dijitale Taşıyın</em>
          </h1>
          <p className="hero-desc-light">
            Randevularınızı yönetin, SMS ile müşterilerinizi bilgilendirin,
            personel performansını takip edin. AI destekli müşteri analizi ile
            salonunuzu bir üst seviyeye taşıyın.
          </p>
          <div className="hero-cta-row">
            <Link href="/giris" className="btn-primary-light">Hemen Başla →</Link>
            <a href="#ozellikler" className="btn-ghost-light">Özellikleri Keşfet</a>
          </div>

          <div id="takvim" className="cal-mock">
            <div className="cal-mock-head">
              <div className="cal-mock-title">
                <span className="cal-mock-dot"></span>
                <span>Haftalık Takvim</span>
              </div>
              <div className="cal-mock-week">18 - 22 Kasım 2025</div>
            </div>
            <div className="cal-grid">
              <div className="cal-col cal-col-hours">
                <div className="cal-cell cal-cell-head"></div>
                {hours.map((h) => (
                  <div key={h} className="cal-cell cal-cell-hour">{h}</div>
                ))}
              </div>
              {days.map((day, dIdx) => (
                <div key={day} className="cal-col">
                  <div className="cal-cell cal-cell-head">{day}</div>
                  {hours.map((_, hIdx) => {
                    const appt = appointments.find((a) => a.day === dIdx && a.hour === hIdx);
                    return (
                      <div key={hIdx} className="cal-cell">
                        {appt && (
                          <div className={`cal-appt cal-appt-${appt.staff}`}>
                            <div className="cal-appt-name">{appt.name}</div>
                            <div className="cal-appt-srv">{appt.service}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="cal-legend">
              <div className="cal-legend-item"><span className="cal-legend-dot cal-dot-elif"></span> Elif</div>
              <div className="cal-legend-item"><span className="cal-legend-dot cal-dot-ayse"></span> Ayşe</div>
              <div className="cal-legend-item"><span className="cal-legend-dot cal-dot-merve"></span> Merve</div>
            </div>
          </div>

          <div className="stat-bar">
            <div className="stat-item"><div className="stat-num">148</div><div className="stat-lbl">SMS Gönderildi</div></div>
            <div className="stat-sep"></div>
            <div className="stat-item"><div className="stat-num">%94</div><div className="stat-lbl">Onay Oranı</div></div>
            <div className="stat-sep"></div>
            <div className="stat-item"><div className="stat-num">12</div><div className="stat-lbl">Bugünkü Randevu</div></div>
            <div className="stat-sep"></div>
            <div className="stat-item"><div className="stat-num">3.450₺</div><div className="stat-lbl">Günlük Gelir</div></div>
          </div>
        </div>
      </section>

      <section id="ozellikler" className="ln-features-new">
        <div className="ln-features-inner">
          <div className="feat-head">
            <span className="feat-tag">Özellikler</span>
            <h2 className="feat-title">Salonunuz için her şey bir arada</h2>
            <p className="feat-sub">RandES, güzellik salonlarının ihtiyaç duyduğu tüm araçları tek bir platformda sunar.</p>
          </div>
          <div className="feat-grid">
            <div className="feat-card"><div className="feat-icon">📅</div><h3>Takvim Yönetimi</h3><p>Haftalık ve günlük görünümlerle randevularınızı kolayca planlayın, çakışmaları önleyin.</p></div>
            <div className="feat-card"><div className="feat-icon">💬</div><h3>SMS Bildirimleri</h3><p>Otomatik hatırlatma SMS'leri ile müşterilerinizin randevu unutma oranını düşürün.</p></div>
            <div className="feat-card"><div className="feat-icon">👥</div><h3>Personel Takibi</h3><p>Her personelin randevu yükünü, performansını ve müsaitlik durumunu anlık izleyin.</p></div>
            <div className="feat-card"><div className="feat-icon">🤖</div><h3>AI Müşteri Analizi</h3><p>Gemini AI ile müşteri kayıp riskini önceden tespit edin, sadakati artırın.</p></div>
            <div className="feat-card"><div className="feat-icon">✂️</div><h3>Hizmet Kataloğu</h3><p>Sunduğunuz tüm hizmetleri fiyat ve süre bilgisiyle düzenli yönetin.</p></div>
            <div className="feat-card"><div className="feat-icon">📊</div><h3>Gelir Raporları</h3><p>Günlük, haftalık ve aylık gelir grafikleriyle işletmenizi veriye dayalı yönetin.</p></div>
          </div>
        </div>
      </section>

      <section className="ln-cta-new">
        <div className="ln-cta-inner">
          <h2 className="cta-title">Salonunuzu <em>bugün</em> dijitale taşıyın</h2>
          <p className="cta-sub">Dakikalar içinde kayıt olun, ilk randevunuzu ücretsiz oluşturun.</p>
          <Link href="/giris" className="btn-primary-light btn-cta-big">Ücretsiz Hesap Oluştur →</Link>
        </div>
      </section>

      <section id="iletisim" className="ln-contact-new">
        <div className="ln-contact-inner">
          <span className="feat-tag">İletişim</span>
          <h2 className="contact-title">Sorularınız mı var?</h2>
          <p className="contact-sub">RandES hakkında bilgi almak veya destek istemek için bize ulaşın.</p>
          <a href="mailto:ceydaksoy3@icloud.com" className="contact-mail">ceydaksoy3@icloud.com</a>
        </div>
      </section>

      <footer className="ln-footer-new">
        <div className="ln-footer-inner">
          <div className="ln-footer-brand">
            <span className="ln-logo-r">R</span>and<span className="ln-logo-es">ES</span>
          </div>
          <p className="ln-footer-desc">Güzellik salonları için randevu yönetim sistemi.</p>
          <div className="ln-footer-meta">
            <span>© 2025 RandES</span>
            <span>•</span>
            <span>Ceyda Aksoy tarafından geliştirildi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
