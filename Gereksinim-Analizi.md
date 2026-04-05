# RandES Gereksinim Analizi

## 1) Randevu Kaydı Oluşturma – POST
İşletme sahibinin; hizmet alanını (kirpik, saç vb.), ilgili personeli ve saati seçerek randevu tanımlanmasını sağlar.

## 2) Kategori Bazlı Hizmet Listeleme – GET
Kirpik, saç, makyaj gibi ana kategoriler ve manikür, pedikür gibi alt hizmetlerin listelenmesini sağlar. Ayrıca her hizmete ortalama yenileme süresi eklenir.

## 3) Personel Listeleme – GET
Salonda çalışan tüm personellerin, uzmanlık alanları ve prim oranları ile birlikte listelenmesini sağlar.

## 4) Randevu Listeleme – GET
Sistemdeki tüm randevuların müşteri, hizmet, personel ve tarih bilgileri ile birlikte listelenmesini sağlar.

## 5) Müşteri Randevu Onay Güncelleme – PUT
Müşterinin işlemden 1 gün önceki mesaja verdiği cevaba göre randevu durumunun (onaylı/iptal/tamamlandı) güncellenmesini sağlar.

## 6) Onaylanmayan Randevu Teşhisi – GET
Onaylanmayan randevuları işletme sahibine uyarı olarak göndererek teyit araması yapmasına olanak tanır.

## 7) Personel Randevu Bildirimi – GET
İşlem saati ayarlandığında ilgili personelin ekranına "Saat ...'da işleminiz vardır." bilgisi düşmesini sağlar.

## 8) Aylık Personel Hak Ediş Takibi – GET
Personelin ay boyunca yaptığı işlemlerin ve bu işlemlerden kazandığı primlerin dökümünü listeler.

## 9) AI – Akıllı Müşteri Kayıp Riski Analizi – POST
Hizmet tanımlarındaki ortalama yenileme süresini referans alarak müşterinin son randevusundan bu yana geçen süreyi analiz eder. İlgili süre aşılmasına rağmen yeni bir randevu alınmamışsa müşteriye otomatik olarak sıcak ve samimi bir hatırlatma mesajı gönderir.

## 10) İptal Edilen Randevu Kaydını Silme – DELETE
Teyit edilemeyen veya müşteri tarafından iptal edilen randevuların sistemden kaldırılmasını sağlar.
