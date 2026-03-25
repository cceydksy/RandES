"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function GirisFormu() {
  const router = useRouter();
  const params = useSearchParams();
  const [mod, setMod] = useState("giris");
  const [form, setForm] = useState({ email: "", sifre: "", ad: "", telefon: "" });
  const [hata, setHata] = useState("");

  useEffect(() => {
    if (params.get("mod") === "kayit") setMod("kayit");
  }, [params]);

  function girisYap(e) {
    e.preventDefault();
    if (mod === "giris") {
      if (form.email && form.sifre) {
        localStorage.setItem("randes_user", JSON.stringify({ email: form.email, ad: form.ad || "Salon Sahibi" }));
        router.push("/panel");
      } else {
        setHata("E-posta ve şifre gerekli");
      }
    } else {
      if (form.ad && form.email && form.sifre) {
        localStorage.setItem("randes_user", JSON.stringify({ email: form.email, ad: form.ad }));
        router.push("/panel");
      } else {
        setHata("Tüm alanları doldurun");
      }
    }
    setTimeout(() => setHata(""), 3000);
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>rand<span>ES</span></h1>
        <p>{mod === "giris" ? "Yönetim paneline giriş yapın" : "Yeni hesap oluşturun"}</p>

        {hata && <div style={{ background: "#fee2e2", color: "var(--danger)", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{hata}</div>}

        <form onSubmit={girisYap}>
          {mod === "kayit" && (
            <>
              <div className="form-group"><label>Ad Soyad</label><input type="text" value={form.ad} onChange={e => setForm({ ...form, ad: e.target.value })} placeholder="Adınız Soyadınız" /></div>
              <div className="form-group"><label>Telefon</label><input type="text" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="05XX XXX XXXX" /></div>
            </>
          )}
          <div className="form-group"><label>E-posta</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ornek@email.com" /></div>
          <div className="form-group"><label>Şifre</label><input type="password" required value={form.sifre} onChange={e => setForm({ ...form, sifre: e.target.value })} placeholder="••••••••" /></div>
          <button type="submit" className="btn btn-brown" style={{ width: "100%", justifyContent: "center", padding: 12, marginTop: 8 }}>
            {mod === "giris" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="auth-toggle">
          {mod === "giris" ? (
            <>Hesabınız yok mu? <a onClick={() => setMod("kayit")}>Kayıt Ol</a></>
          ) : (
            <>Zaten hesabınız var mı? <a onClick={() => setMod("giris")}>Giriş Yap</a></>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "var(--text-light)" }}>← Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
}

export default function GirisSayfasi() {
  return (
    <Suspense fallback={<div className="loading"><div className="spinner"></div></div>}>
      <GirisFormu />
    </Suspense>
  );
}
