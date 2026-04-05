# Ceyda Nur Aksoy'un Web Frontend Görevleri
**Frontend Domain:** https://rand-es-9waw.vercel.app
**Frontend Test Videosu:** https://youtu.be/r5IOdYKQoIg

## 1. Randevu Oluşturma Sayfası
- **API Endpoint:** `POST /appointments`
- **Görev:** Yönetim panelinden yeni randevu oluşturma
- **UI Bileşenleri:**
  - Yeni Randevu modal formu
  - Müşteri adı ve telefon input alanları
  - Hizmet seçim dropdown'u (kategori bazlı)
  - Personel seçim dropdown'u (hizmete göre filtrelenmiş)
  - Tarih ve saat seçici (datetime-local)
  - Not alanı
  - Oluştur ve Vazgeç butonları
- **Kullanıcı Deneyimi:**
  - Hizmete göre otomatik personel filtreleme
  - Başarı toast mesajı
  - Form validasyonu
  - Timezone düzeltmesi ile doğru saat kaydı

## 2. Kategori Bazlı Hizmet Listeleme
- **API Endpoint:** `GET /services`
- **Görev:** Hizmetler sayfasında tüm hizmetlerin kategori bazında görüntülenmesi
- **UI Bileşenleri:**
  - Kategori bazlı hizmet kartları
  - Hizmet ekleme, düzenleme, silme butonları
  - Fiyat, süre ve yenileme günü bilgileri

## 3. Personel Listeleme Sayfası
- **API Endpoint:** `GET /personnel`
- **Görev:** Personel sayfasında tüm personellerin listelenmesi
- **UI Bileşenleri:**
  - Personel kartları
  - Uzmanlık alanları badge'leri
  - Prim oranı bilgisi
  - Ekleme, düzenleme, silme butonları

## 4. Randevu Listeleme (Takvim Görünümü)
- **API Endpoint:** `GET /appointments`
- **Görev:** Randevuların haftalık takvim görünümünde listelenmesi
- **UI Bileşenleri:**
  - 7 günlük haftalık takvim grid'i
  - Saat bazlı hücreler (08:00 - 20:00)
  - Personel bazlı renkli randevu kartları
  - Personel filtreleme butonları
  - Hafta navigasyonu (önceki, sonraki, bugün)
- **Özel Özellikler:**
  - Randevular başlangıç dakikasına göre konumlandırılır (9:15 randevu tam o noktadan başlar)
  - Hizmet süresine göre yükseklik (2.5 saatlik randevu 2.5 hücre kaplar)
  - Bugünkü gün vurgulanır

## 5. Randevu Onay Güncelleme
- **API Endpoint:** `PUT /appointments/:id/confirmation`
- **Görev:** Randevu durumunun güncellenmesi
- **UI Bileşenleri:**
  - Randevu detay modalı
  - Onayla butonu (beklemede randevular için)
  - İptal butonu
  - Tamamlandı butonu (geçmiş randevular için)
- **Kullanıcı Deneyimi:**
  - Duruma göre butonlar dinamik olarak gösterilir
  - Başarı/hata toast mesajları

## 6. Onaylanmayan Randevu Teşhisi
- **API Endpoint:** `GET /appointments/unconfirmed`
- **Görev:** Onay bekleyen randevuların anasayfada uyarı olarak gösterilmesi
- **UI Bileşenleri:**
  - Anasayfada "Onay Bekleyen Randevular" bölümü
  - Her randevunun yanında hızlı Onayla butonu
  - Müşteri adı, hizmet ve tarih bilgisi

## 7. Personel Randevu Bildirimi
- **API Endpoint:** `GET /personnel/notifications`
- **Görev:** Personel bildirimlerinin anasayfada görüntülenmesi
- **UI Bileşenleri:**
  - "Personel Bildirimleri" kartı
  - Bildirim mesajları listesi
  - Boş durum mesajı

## 8. Aylık Personel Hak Ediş Takibi
- **API Endpoint:** `GET /personnel/earnings`
- **Görev:** Personel hak ediş bilgilerinin görüntülenmesi
- **UI Bileşenleri:**
  - Hakediş sayfası
  - Personel bazında toplam randevu, gelir ve komisyon bilgisi
  - Ay ve yıl filtreleme

## 9. AI Müşteri Kayıp Riski Analizi
- **API Endpoint:** `POST /ai/customer-risk`
- **Görev:** Gemini AI ile müşteri kayıp riski analizinin görüntülenmesi
- **UI Bileşenleri:**
  - AI Analiz sayfası
  - Risk altındaki müşteriler listesi
  - Gemini AI tarafından üretilen Türkçe hatırlatma mesajları
  - Risk seviyesi badge'leri (orta, yüksek)
  - Özet istatistikler

## 10. Randevu Düzenleme ve Silme
- **API Endpoint:** `PUT /appointments/:id` ve `DELETE /appointments/:id`
- **Görev:** Mevcut randevuların düzenlenmesi ve silinmesi
- **UI Bileşenleri:**
  - Randevu detay modalında Düzenle ve Sil butonları
  - Düzenleme modalı (mevcut değerlerle dolu form)
  - Silme onay dialog'u
- **Kullanıcı Deneyimi:**
  - Düzenleme sonrası otomatik yenileme
  - Silme öncesi onay istemi
  - Başarı toast mesajları

## Teknik Detaylar
- **Framework:** Next.js 14 (App Router)
- **Dil:** JavaScript/React
- **Styling:** Custom CSS (Moss, Olive, Sand renk paleti)
- **Font:** Cormorant Garamond (logo için)
- **State Management:** React Hooks (useState, useEffect)
- **API Client:** Native fetch
- **Deployment:** Vercel
