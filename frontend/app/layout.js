import "./globals.css";

export const metadata = {
  title: "RandES - Randevu Yönetim Sistemi",
  description: "Güzellik salonu randevu yönetim sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </body>
    </html>
  );
}

function Sidebar() {
  const menuItems = [
    { href: "/", icon: "📊", label: "Dashboard" },
    { href: "/randevular", icon: "📅", label: "Randevular" },
    { href: "/hizmetler", icon: "💅", label: "Hizmetler" },
    { href: "/personel", icon: "👩‍💼", label: "Personel" },
    { href: "/ai-analiz", icon: "🤖", label: "AI Analiz" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary-800 via-primary-900 to-accent-900 text-white shadow-2xl z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-accent-300">Rand</span>ES
        </h1>
        <p className="text-primary-300 text-sm mt-1">Randevu Yönetim Sistemi</p>
      </div>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-200 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <p className="text-primary-400 text-xs text-center">Ceyda Nur Aksoy</p>
        <p className="text-primary-500 text-xs text-center">© 2026 RandES</p>
      </div>
    </aside>
  );
}
