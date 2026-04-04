# RandES REST API

## API Adresi
https://rand-es.vercel.app

## Test Videosu
https://youtu.be/k6M9qZGHjZM

## Endpoints

### Hizmetler
- **GET** `/api/v1/services` — Tüm hizmetleri listele

### Personel
- **GET** `/api/v1/personnel` — Tüm personelleri listele
- **GET** `/api/v1/personnel/notifications` — Personel bildirimleri
- **GET** `/api/v1/personnel/earnings` — Personel hak ediş

### Randevular
- **GET** `/api/v1/appointments` — Tüm randevuları listele
- **POST** `/api/v1/appointments` — Randevu oluştur
- **PUT** `/api/v1/appointments/:id/confirmation` — Randevu onayla
- **GET** `/api/v1/appointments/unconfirmed` — Onaylanmayan randevular
- **DELETE** `/api/v1/appointments/:id` — Randevu sil

### AI
- **POST** `/api/v1/ai/customer-risk` — Müşteri kayıp riski analizi (Gemini AI)

### Seed
- **POST** `/api/v1/seed` — Örnek veri yükle
