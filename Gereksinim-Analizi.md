## 1) Randevu Kaydı Oluşturma – POST
İşletme sahibinin; hizmet alanını (kirpik, saç vb.), ilgili personeli ve saati seçerek randevu tanımlanmasını sağlar.

## 2) Personel Randevu Bildirimi – GET
İşlem saati ayarlandığında ilgili personelin ekranına “Saat …’da işleminiz vardır.” bilgisi düşmesini sağlar.

## 3) Kategori Bazlı Hizmet Listeleme – GET
Kirpik, saç, makyaj gibi ana kategoriler ve manikür, pedikür gibi alt hizmetlerin listelenmesini sağlar. Ayrıca her hizmete ortalama yenileme süresi eklenir.

## 4) Müşteri Randevu Onay Güncelleme – PUT
Müşterinin işlemden 1 gün önceki mesaja verdiği cevaba göre randevu durumunun (onaylı/iptal) güncellenmesini sağlar.

## 5) Onaylanmayan Randevu Teşhisi – GET
Onaylanmayan randevuları işletme sahibine uyarı olarak göndererek teyit araması yapmasına olanak tanır.

## 6) Otomatik Google Değerlendirme Mesajı – POST
İşlem sonunda müşteriye otomatik olarak Google işletme linki ve değerlendirme isteği gönderilmesini sağlar.

## 7) İptal Edilen Randevu Kaydını Silme – DELETE
Teyit edilemeyen veya müşteri tarafından iptal edilen randevuların sistemden kaldırılmasını sağlar.

## 8) Aylık Personel Hak Ediş Takibi – GET
Personelin ay boyunca yaptığı işlemlerin ve bu işlemlerden kazandığı primlerin dökümünü listeler.

## 9) Personel Atama ve Güncelleme – PUT
Mevcut bir randevudaki sorumlu personelin işletme sahibi tarafından değiştirilmesini sağlar. Müşterinin özel personel talebi olması durumunda işletme sahibi bu talebi göz önünde bulundurarak atamayı güncelleyebilir.

## 10) AI – Akıllı Müşteri Kayıp Riski Analizi – POST
Hizmet tanımlarındaki ortalama yenileme süresini referans alarak müşterinin son randevusundan bu yana geçen süreyi analiz eder. İlgili süre aşılmasına rağmen yeni bir randevu alınmamışsa müşteriye otomatik olarak sıcak ve samimi bir hatırlatma mesajı gönderir.





