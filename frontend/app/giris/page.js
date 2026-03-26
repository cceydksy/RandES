"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { login as apiLogin, register as apiRegister } from "@/lib/api";

function GirisFormu() {
  const router = useRouter();
  const params = useSearchParams();
  const [mod, setMod] = useState("giris");
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" });
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => { if (params.get("mod") === "kayit") setMod("kayit"); }, [params]);

  async function gonder(e) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");
    try {
      let res;
      if (mod === "giris") {
        res = await apiLogin({ email: form.email, password: form.password });
      } else {
        res = await apiRegister({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      }
      if (res.success) {
        localStorage.setItem("randes_user", JSON.stringify(res.data));
        router.push("/panel");
      } else {
        setHata(res.message || "Bir hata oluştu");
      }
    } catch (err) {
      setHata("Bağlantı hatası");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>rand<span>ES</span></h1>
        <p>{mod === "giris" ? "Yönetim paneline giriş yapın" : "Yeni hesap oluşturun"}</p>
        {hata && <div style={{ background: "#fee2e2", color: "var(--danger)", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{hata}</div>}
        <form onSubmit={gonder}>
          {mod === "kayit" && (
            <>
              <div className="form-group"><label>Ad Soyad</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Adınız Soyadınız" /></div>
              <div className="form-group"><label>Telefon</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05XX XXX XXXX" /></div>
            </>
          )}
          <div className="form-group"><label>E-posta</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ornek@email.com" /></div>
          <div className="form-group"><label>Şifre</label><input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="En az 6 karakter" /></div>
          <button type="submit" className="btn btn-brown" style={{ width: "100%", justifyContent: "center", padding: 12, marginTop: 8 }} disabled={yukleniyor}>
            {yukleniyor ? "Yükleniyor..." : mod === "giris" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>
        <div className="auth-toggle">
          {mod === "giris" ? <>Hesabınız yok mu? <a onClick={() => setMod("kayit")}>Kayıt Ol</a></> : <>Zaten hesabınız var mı? <a onClick={() => setMod("giris")}>Giriş Yap</a></>}
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}><Link href="/" style={{ fontSize: 12, color: "var(--text-light)" }}>← Ana Sayfaya Dön</Link></div>
      </div>
    </div>
  );
}

export default function GirisSayfasi() {
  return <Suspense fallback={<div className="loading"><div className="spinner"></div></div>}><GirisFormu /></Suspense>;
}
