"use client";
import { useState, useEffect } from "react";
import { getServices, createService } from "@/lib/api";

const categories = ["Kirpik", "Saç", "Makyaj", "Tırnak", "Cilt Bakımı", "Diğer"];

const categoryIcons = {
  "Kirpik": "👁️",
  "Saç": "💇‍♀️",
  "Makyaj": "💄",
  "Tırnak": "💅",
  "Cilt Bakımı": "✨",
  "Diğer": "🔧",
};

export default function Hizmetler() {
  const [services, setServices] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", category: "Kirpik", price: "", durationMinutes: "", renewalDays: "", description: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const res = await getServices();
      setServices(res.data || {});
      setAllCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes),
      renewalDays: Number(form.renewalDays),
    };
    await createService(data);
    setForm({ name: "", category: "Kirpik", price: "", durationMinutes: "", renewalDays: "", description: "" });
    setShowForm(false);
    loadServices();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">💅 Hizmetler</h1>
          <p className="page-subtitle">Salonunuzun sunduğu hizmetleri yönetin</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "✕ Kapat" : "＋ Yeni Hizmet"}
        </button>
      </div>

      {/* Yeni Hizmet Formu */}
      {showForm && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Yeni Hizmet Ekle</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Hizmet Adı *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Örn: İpek Kirpik"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Kategori *</label>
              <select
                className="select-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fiyat (₺) *</label>
              <input
                type="number"
                className="input-field"
                placeholder="800"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Süre (dk) *</label>
              <input
                type="number"
                className="input-field"
                placeholder="90"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Yenileme Süresi (gün) *</label>
              <input
                type="number"
                className="input-field"
                placeholder="21"
                value={form.renewalDays}
                onChange={(e) => setForm({ ...form, renewalDays: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Açıklama</label>
              <input
                type="text"
                className="input-field"
                placeholder="Hizmet açıklaması..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-primary w-full">Hizmet Ekle</button>
            </div>
          </form>
        </div>
      )}

      {/* Hizmet Listesi - Kategorilere Göre */}
      {allCategories.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-4">💅</p>
          <p className="text-gray-400 text-lg">Henüz hizmet eklenmemiş</p>
          <p className="text-gray-300 text-sm mt-2">Yukarıdaki butonu kullanarak yeni hizmet ekleyebilirsiniz</p>
        </div>
      ) : (
        <div className="space-y-8">
          {allCategories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-primary-700 mb-4 flex items-center gap-2">
                <span>{categoryIcons[category] || "📌"}</span>
                {category}
                <span className="text-sm font-normal text-primary-400">
                  ({(services[category] || []).length} hizmet)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(services[category] || []).map((svc) => (
                  <div key={svc._id} className="card hover:border-primary-300">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800">{svc.name}</h3>
                      <span className="text-lg font-bold text-primary-600">{svc.price}₺</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{svc.description}</p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>⏱ {svc.durationMinutes} dk</span>
                      <span>🔄 {svc.renewalDays} gün</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
