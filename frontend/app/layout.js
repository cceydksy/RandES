"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", label: "Anasayfa", icon: "📊" },
  { href: "/randevular", label: "Randevular", icon: "📅" },
  { href: "/hizmetler", label: "Hizmetler", icon: "✂️" },
  { href: "/personel", label: "Personel", icon: "👤" },
  { href: "/ai-analiz", label: "AI Analiz", icon: "🤖" },
  { href: "/musteri", label: "Müşteri Sayfası", icon: "🌐" },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isCustomer = pathname === "/musteri";

  if (isCustomer) {
    return (
      <html lang="tr">
        <head><title>randES - Güzellik & Bakım</title></head>
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="tr">
      <head><title>randES - Yönetim Paneli</title></head>
      <body>
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
                      <span>{m.icon}</span> {m.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sidebar-footer">Ceyda Nur Aksoy · © 2026</div>
          </div>
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
