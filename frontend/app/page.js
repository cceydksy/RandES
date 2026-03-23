"use client";
import { useState, useEffect } from "react";
import { getAppointments, getServices, getPersonnel, getNotifications, seedData } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ appointments: 0, services: 0, personnel: 0, todayAppointments: 0 });
  const [notifications, setNotifications] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [aptRes, svcRes, prsRes, notRes] = await Promise.all([
        getAppointments(),
        getServices(),
        getPersonnel(),
        getNotifications(),
      ]);

      const today = new Date().toDateString();
      const todayApts = (aptRes.data || []).filter(
        (a) => new Date(a.appointmentTime).toDateString() === today
      );

      setStats({
        appointments: aptRes.count || 0,
        services: svcRes.totalCount || 0,
        personnel: prsRes.count || 0,
        todayAppointments: todayApts.length,
      });

      setNotifications(notRes.data || []);
      setRecentAppointments((aptRes.data || []).slice(0, 5));
    } catch (err) {
      console.error("Dashboard yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    if (confirm("Örnek veriler yüklensin mi? Mevcut veriler silinecek.")) {
      await seedData();
      loadDashboard();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Toplam Randevu", value: stats.appointments, icon: "📅", color: "from-primary-500 to-primary-700" },
    { label: "Bugünkü Randevu", value: stats.todayAppointments, icon: "⏰", color: "from-accent-500 to-accent-700" },
    { label: "Hizmet Sayısı", value: stats.services, icon: "💅", color: "from-violet-500 to-violet-700" },
    { label: "Personel Sayısı", value: stats.personnel, icon: "👩‍💼", color: "from-fuchsia-500 to-fuchsia-700" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Güzellik salonunuzun genel durumu</p>
        </div>
        <button onClick={handleSeed} className="btn-secondary text-sm">
          🌱 Örnek Veri Yükle
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <span className="text-4xl opacity-80">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bugünkü Bildirimler */}
        <div className="card">
          <h2 className="text-xl font-semibold text-primary-800 mb-4">🔔 Bugünkü Bildirimler</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Bugün bildirim yok</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-sm font-medium text-primary-800">{n.message}</p>
                    <p className="text-xs text-primary-500 mt-1">
                      {n.personnelName} • {n.serviceName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Son Randevular */}
        <div className="card">
          <h2 className="text-xl font-semibold text-primary-800 mb-4">📋 Son Randevular</h2>
          {recentAppointments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Henüz randevu yok</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{apt.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {apt.serviceId?.name} • {apt.personnelId?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-600">
                      {new Date(apt.appointmentTime).toLocaleDateString("tr-TR")}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        apt.status === "onaylandi"
                          ? "bg-green-100 text-green-700"
                          : apt.status === "tamamlandi"
                          ? "bg-blue-100 text-blue-700"
                          : apt.status === "iptal"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
