**REST API Domain:** https://rand-es.vercel.app/api/v1
**REST API Test Videosu:** https://youtu.be/k6M9qZGHjZM

## 1. Randevu Kaydı Oluşturma
- **API Endpoint:** `POST /appointments`
- **Görev:** İşletme sahibinin hizmet alanını, personeli ve saati seçerek yeni randevu tanımlaması
- **Request Body:**
```json
{
  "customerName": "Ceyda Aksoy",
  "customerPhone": "05551234567",
  "serviceId": "69d169d19cd98fbae4ed7cc6",
  "personnelId": "69d169d19cd98fbae4ed7cd1",
  "appointmentTime": "2026-04-06T14:00:00.000Z",
  "notes": "İlk randevu"
}
```
- **Response:** Oluşturulan randevunun tüm bilgileri (müşteri, hizmet, personel, tarih, durum)
- **Validasyon:** Müşteri adı, telefon, hizmet ID, personel ID ve randevu saati zorunludur

## 2. Kategori Bazlı Hizmet Listeleme
- **API Endpoint:** `GET /services`
- **Görev:** Salondaki tüm hizmetlerin kategori bazında listelenmesi (Kirpik, Saç, Makyaj, Tırnak, Cilt Bakımı)
- **Request Body:** Yok
- **Response:** Kategorilere göre gruplandırılmış hizmet listesi (isim, fiyat, süre, yenileme günü)

## 3. Personel Listeleme
- **API Endpoint:** `GET /personnel`
- **Görev:** Salonda çalışan tüm personellerin uzmanlık alanları ve prim oranları ile listelenmesi
- **Request Body:** Yok
- **Response:** Aktif personel listesi (isim, telefon, uzmanlık alanları, prim oranı)

## 4. Randevu Listeleme
- **API Endpoint:** `GET /appointments`
- **Görev:** Sistemdeki tüm randevuların müşteri, hizmet, personel ve tarih bilgileri ile listelenmesi
- **Request Body:** Yok
- **Response:** Tüm randevular (populate edilmiş hizmet ve personel bilgileri ile)

## 5. Müşteri Randevu Onay Güncelleme
- **API Endpoint:** `PUT /appointments/:appointmentId/confirmation`
- **Görev:** Randevunun durumunu (onaylandı/iptal/tamamlandı) güncelleme
- **Request Body:**
```json
{
  "status": "onaylandı"
}
```
- **Response:** Güncellenmiş randevu bilgisi
- **Validasyon:** Status değeri sadece "onaylandı", "iptal" veya "tamamlandı" olabilir

## 6. Onaylanmayan Randevu Teşhisi
- **API Endpoint:** `GET /appointments/unconfirmed`
- **Görev:** Durumu "beklemede" olan ve gelecek tarihli randevuların listelenmesi
- **Request Body:** Yok
- **Response:** Onay bekleyen randevular listesi ve toplam sayı

## 7. Personel Randevu Bildirimi
- **API Endpoint:** `GET /personnel/notifications`
- **Görev:** Personelin bugünkü randevularını "Saat X'da Y müşterisinin Z işlemi vardır" formatında bildirim olarak döndürme
- **Request Body:** Yok
- **Query Params:** `personnelId` (opsiyonel) — belirli bir personelin bildirimleri
- **Response:** Bildirim listesi (personel adı, müşteri, hizmet, saat, mesaj)

## 8. Aylık Personel Hak Ediş Takibi
- **API Endpoint:** `GET /personnel/earnings`
- **Görev:** Personellerin aylık yaptığı işlemlerin ve kazandığı primlerin dökümünün listelenmesi
- **Request Body:** Yok
- **Query Params:** `personnelId`, `month`, `year` (opsiyonel)
- **Response:** Personel bazında toplam randevu, toplam gelir, komisyon ve hizmet dökümü

## 9. AI Müşteri Kayıp Riski Analizi
- **API Endpoint:** `POST /ai/customer-risk`
- **Görev:** Google Gemini API kullanarak müşterilerin son randevusundan geçen süreyi analiz etme ve risk altındaki müşterilere otomatik Türkçe hatırlatma mesajı üretme
- **Request Body:** Yok
- **Response:** Risk altındaki müşteriler (atRisk), güvenli müşteriler (safe) ve özet istatistikler
- **AI Entegrasyonu:** Gemini 2.0 Flash modeli ile sıcak ve samimi WhatsApp formatında Türkçe mesajlar

## 10. İptal Edilen Randevu Kaydını Silme
- **API Endpoint:** `DELETE /appointments/:appointmentId`
- **Görev:** Teyit edilemeyen veya iptal edilen randevuların sistemden kaldırılması
- **Request Body:** Yok
- **Response:** Silinen randevunun ID'si ve başarı mesajı

## Teknik Detaylar
- **Framework:** Express.js
- **Veritabanı:** MongoDB Atlas
- **Deployment:** Vercel Serverless
- **AI:** Google Gemini 2.0 Flash API
- **Kod Dili:** Node.js
