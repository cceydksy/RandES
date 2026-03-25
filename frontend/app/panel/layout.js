"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { href: "/panel", label: "Anasayfa" },
  { href: "/panel/randevular", label: "Randevular" },
  { href: "/panel/hizmetler", label: "Hizmetler" },
  { href: "/panel/personel", label: "Personel" },
  { href: "/panel/ai-analiz", label: "AI Analiz" },
];

export default function PanelLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("randes_user");
    if (!u) { router.push("/giris"); return; }
    setUser(JSON.parse(u));
  }, [router]);

  function cikis() {
    localStorage.removeItem("randes_user");
    router.push("/");
  }

  if (!user) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>rand<span>ES</span></h1>
          <p>Yönetim Paneli</p>
        </div>
        <nav>
          <ul className="sidebar-nav">
            {menu.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className={pathname === m.href ? "active" : ""}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: 8 }}>{user.ad || user.email}</div>
          <button onClick={cikis} className="btn btn-sm btn-outline" style={{ width: "100%", justifyContent: "center", color: "var(--brown)", borderColor: "rgba(52,29,8,0.2)" }}>Çıkış Yap</button>
        </div>
      </div>
      <main className="admin-main">{children}</main>
    </div>
  );
}
