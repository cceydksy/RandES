# RandES Web Frontend

## Frontend Adresi
https://rand-es-9waw.vercel.app

## Test Videosu
https://youtu.be/r5IOdYKQoIg

## Sayfalar

### Ana Sayfa (/)
Güzellik salonu tanıtım sayfası. Hizmetler galerisi ve giriş/kayıt butonları.

### Giriş/Kayıt (/giris)
Kullanıcı kimlik doğrulama sayfası.

### Yönetim Paneli (/panel)
- **Anasayfa** — İstatistikler (toplam randevu, bugün, hizmet, personel), onay bekleyen randevular listesi ve hızlı onaylama
- **Randevular** — Haftalık takvim görünümü, randevu oluşturma, düzenleme, onaylama, iptal ve silme. Randevular başlangıç dakikasına ve süresine göre takvimde konumlandırılır
- **Hizmetler** — Hizmet yönetimi (ekleme, düzenleme, silme)
- **Personel** — Personel yönetimi
- **Değerlendirmeler** — Müşteri değerlendirme gönderimi
- **AI Analiz** — Gemini AI destekli müşteri kayıp riski analizi

## Gereksinimler

### 1) Randevu Kaydı Oluşturma
Panel > Randevular > Yeni Randevu butonu ile hizmet, personel, tarih ve saat seçilerek randevu oluşturulur.

### 2) Kategori Bazlı Hizmet Listeleme
Panel > Hizmetler sayfasında kategori bazlı hizmet listesi görüntülenir.

### 3) Personel Listeleme
Panel > Personel sayfasında tüm personeller ve uzmanlık alanları listelenir.

### 4) Randevu Listeleme
Panel > Randevular sayfasında haftalık takvim görünümünde tüm randevular listelenir.

### 5) Müşteri Randevu Onay Güncelleme
Randevu detayından Onayla/İptal/Tamamlandı butonları ile durum güncellenir.

### 6) Onaylanmayan Randevu Teşhisi
Panel anasayfasında "Onay Bekleyen Randevular" bölümünde listelenir ve hızlı onaylama butonu bulunur.

### 7) Personel Randevu Bildirimi
Panel > Personel sayfasında bildirimler görüntülenir.

### 8) Aylık Personel Hak Ediş Takibi
Panel > Personel sayfasında personellerin aylık hak ediş bilgileri listelenir.

### 9) AI Müşteri Kayıp Riski Analizi
Panel > AI Analiz sayfasında Gemini AI destekli müşteri kayıp riski analizi ve otomatik hatırlatma mesajları görüntülenir.

### 10) Randevu Silme
Randevu detayından Sil butonu ile randevu kaydı silinir.
