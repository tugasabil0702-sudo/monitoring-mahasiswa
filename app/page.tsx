'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MonitoringBeasiswa() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('Semua');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mengatasi Hydration Error dengan memastikan render di client-side penuh
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, error, isLoading } = useSWR('/api/beasiswa', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true
  });

  // Ambil list kategori unik secara dinamis dari Google Sheets
  const jenisBeasiswaList = data 
    ? (Array.from(new Set(data.map((row: any[]) => row[7] || 'Kategori Umum'))).filter(Boolean) as string[])
    : ['Sepuluh Sarjana Lanjutan', 'PONPES Lanjutan', 'Scientis Lanjutan', 'Tugas Akhir', 'Kemis Baru'];

  const filteredData = data?.filter((row: any[]) => {
    const nama = row[1]?.toLowerCase() || '';
    const universitas = row[2]?.toLowerCase() || '';
    const kategoriBeasiswa = row[7] || 'Kategori Umum'; 
    
    const matchesSearch = nama.includes(searchTerm.toLowerCase()) || universitas.includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'Semua' || kategoriBeasiswa === filterSource;

    return matchesSearch && matchesSource;
  });

  const totalMahasiswa = data?.length || 0;
  const totalFiltered = filteredData?.length || 0;

  if (!mounted) return null;

  if (error) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-6 ${isDarkMode ? 'bg-[#09090b]' : 'bg-[#fafafa]'}`}>
        <div className={`text-center p-8 rounded-2xl border max-w-md shadow-2xl ${isDarkMode ? 'bg-zinc-900 border-red-900/30' : 'bg-white border-red-100'}`}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg">⚠️</div>
          <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Gagal Memuat Data</h3>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Pastikan Kredensial di Netlify Environment Variables benar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen antialiased transition-colors duration-300 ${
      isDarkMode ? 'bg-[#09090b] text-zinc-100' : 'bg-[#fafafa] text-slate-800'
    }`}>
      <div className="h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-950 w-full" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <header className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 p-6 sm:p-8 rounded-2xl border shadow-xl ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'
        }`}>
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="Logo Dinas" className="w-14 h-auto object-contain flex-shrink-0" />
            <div>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                DINAS PENDIDIKAN KABUPATEN BOJONEGORO
              </div>
              <h1 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Monitoring Penerima Beasiswa
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 text-xs font-bold rounded-xl border flex items-center justify-center ${
                isDarkMode ? 'bg-zinc-800 border-zinc-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {isDarkMode ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
            </button>
          </div>
        </header>

        {/* Statistik */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <span className="text-xs font-bold uppercase text-zinc-400">Total Seluruh Penerima</span>
            <div className="text-3xl font-black mt-2">{isLoading ? '...' : totalMahasiswa} Mahasiswa</div>
          </div>
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-emerald-500/20' : 'bg-white border-emerald-100'}`}>
            <span className="text-xs font-bold uppercase text-emerald-500">Data Sesuai Kategori Pilihan</span>
            <div className="text-3xl font-black text-emerald-500 mt-2">{isLoading ? '...' : totalFiltered} Orang</div>
          </div>
        </section>

        {/* Filter Kontrol */}
        <section className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Cari nama mahasiswa atau universitas..."
            className={`flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
              isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white border border-slate-200'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className={`w-full sm:w-80 px-5 py-3.5 rounded-xl text-sm font-bold ${
              isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white border border-slate-200'
            }`}
          >
            <option value="Semua">Jenis Beasiswa (Semua)</option>
            {jenisBeasiswaList.map((namaBeasiswa, idx) => (
              <option key={idx} value={namaBeasiswa}>{namaBeasiswa}</option>
            ))}
          </select>
        </section>

        {/* Tabel Data - Struktur Grid & Pembatas Kolom Diperkuat */}
        <section className={`rounded-2xl border overflow-hidden shadow-sm ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-widest ${
                  isDarkMode ? 'bg-black/60 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                }`}>
                  <th className={`p-5 pl-7 w-[20%] border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>Nama Mahasiswa</th>
                  <th className={`p-5 w-[22%] border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>Asal Universitas / Prodi</th>
                  <th className={`p-5 w-[25%] border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>Alamat Rumah</th>
                  <th className={`p-5 w-[13%] border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>Nominal UKT</th>
                  <th className={`p-5 w-[13%] border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>No. Rekening</th>
                  <th className="p-5 pr-7 w-[7%] text-right">Smstr</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'divide-y divide-zinc-800 text-zinc-300' : 'divide-y divide-slate-100 text-slate-700'}>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((row: any[], index: number) => (
                    <tr key={index} className={`transition-colors duration-150 ${isDarkMode ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}>
                      <td className={`p-5 pl-7 font-bold text-sm break-words border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
                        {row[1] || '-'}
                      </td>
                      <td className={`p-5 text-sm font-medium break-words border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
                        {row[2] || '-'}
                      </td>
                      <td className={`p-5 text-xs font-normal break-words border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
                        {row[3] || '-'}
                      </td>
                      <td className={`p-5 font-bold text-sm text-emerald-500 break-words border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
                        {row[4] || '-'}
                      </td>
                      <td className={`p-5 font-mono text-xs break-all border-r ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
                        {row[5] || '-'}
                      </td>
                      <td className="p-5 pr-7 text-right text-sm font-bold">
                        {row[6] || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-xs font-bold uppercase text-zinc-500">
                      Tidak ada data penerima beasiswa ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}