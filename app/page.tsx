// app/page.tsx
'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MonitoringBeasiswa() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('Semua');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { data, error, isLoading } = useSWR('/api/beasiswa', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true
  });

  const jenisBeasiswaList = [
    'Sepuluh Sarjana Lanjutan',
    'PONPES Lanjutan',
    'Scientis Lanjutan',
    'Tugas Akhir',
    'Kemis Baru'
  ];

  const filteredData = data?.filter((row: any[]) => {
    const nama = row[1]?.toLowerCase() || '';
    const universitas = row[2]?.toLowerCase() || '';
    const namaSheetAsli = row[7] || ''; 
    
    const matchesSearch = nama.includes(searchTerm.toLowerCase()) || universitas.includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'Semua' || namaSheetAsli === filterSource;

    return matchesSearch && matchesSource;
  });

  const totalMahasiswa = data?.length || 0;
  const totalFiltered = filteredData?.length || 0;

  if (error) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-6 ${isDarkMode ? 'bg-[#09090b]' : 'bg-[#fafafa]'}`}>
        <div className={`text-center p-8 rounded-2xl border max-w-md shadow-2xl ${isDarkMode ? 'bg-zinc-900 border-red-900/30' : 'bg-white border-red-100'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg ${isDarkMode ? 'bg-red-950 text-red-400' : 'bg-red-50 text-red-500'}`}>
            ⚠️
          </div>
          <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Gagal Memuat Data</h3>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Pastikan Kredensial di <code className={`px-1 py-0.5 rounded ${isDarkMode ? 'bg-zinc-800 text-red-400' : 'bg-slate-100 text-red-600'}`}>.env.local</code> benar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen antialiased transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-black' 
        : 'bg-[#fafafa] text-slate-800 selection:bg-emerald-100 selection:text-emerald-900'
    }`}>
      <div className="h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-950 w-full" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <header className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 p-6 sm:p-8 rounded-2xl border shadow-xl transition-colors duration-300 ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-100'
        }`}>
          
          {/* Sisi Kiri: Logo & Identitas Dinas Pendidikan */}
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Logo Kabupaten Bojonegoro" 
              className="w-30 h-auto object-contain flex-shrink-0 drop-shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                DINAS PENDIDIKAN KABUPATEN BOJONEGORO
              </div>
              <h1 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Monitoring Penerima Beasiswa
              </h1>
              <p className={`text-xs mt-1 font-medium transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                Sinkronisasi Multi-Sheet otomatis diperbarui berkala setiap <span className="text-emerald-400 font-bold underline decoration-emerald-500/30 underline-offset-4">5 detik</span>.
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Kontrol Tema & Koneksi */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm ${
                isDarkMode 
                  ? 'bg-zinc-800 border-zinc-700 text-yellow-400 hover:bg-zinc-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.66 6.34l1.58-1.58M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              isDarkMode ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide uppercase">Aktif</span>
            </div>
          </div>
        </header>

        {/* Statistics Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className={`p-6 rounded-2xl border shadow-lg relative overflow-hidden group transition-all duration-300 ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none ${isDarkMode ? 'bg-zinc-800/40' : 'bg-slate-50'}`} />
            <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>Total Seluruh Penerima</span>
            <div className={`text-4xl font-black mt-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {isLoading ? '...' : totalMahasiswa.toLocaleString('id-ID')} <span className="text-sm font-medium text-zinc-500 ml-1">Mahasiswa</span>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border shadow-lg relative overflow-hidden group transition-all duration-300 ${
            isDarkMode ? 'bg-zinc-900 border-emerald-500/20 shadow-emerald-500/[0.02]' : 'bg-white border-emerald-100 shadow-emerald-600/[0.01]'
          }`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none ${isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-50/40'}`} />
            <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Sesuai Filter Kategori</span>
            <div className="text-4xl font-black text-emerald-500 mt-2 tracking-tight">
              {isLoading ? '...' : totalFiltered.toLocaleString('id-ID')} <span className={`text-sm font-medium ml-1 ${isDarkMode ? 'text-emerald-600' : 'text-emerald-700/70'}`}>Orang</span>
            </div>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama mahasiswa atau universitas tujuan..."
              className={`w-full px-5 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 ${
                isDarkMode 
                  ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500' 
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-80">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 ${
                isDarkMode
                  ? 'bg-zinc-900 border border-zinc-800 text-white text-zinc-100'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <option value="Semua" className={isDarkMode ? 'bg-zinc-900' : 'bg-white'}>Jenis Beasiswa (Semua)</option>
              {jenisBeasiswaList.map((namaBeasiswa: string, idx: number) => (
                <option key={idx} value={namaBeasiswa} className={isDarkMode ? 'bg-zinc-900' : 'bg-white'}>
                  {namaBeasiswa}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Aesthetic High-Contrast Table Container */}
        <section className={`rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'
        }`}>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-28">
              <div className="animate-spin rounded-full h-9 w-9 border-2 border-t-emerald-400 border-neutral-700"></div>
              <span className="mt-4 text-xs tracking-widest text-zinc-500 font-bold uppercase">Memuat Basis Data...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] tracking-widest uppercase font-bold transition-colors duration-300 ${
                    isDarkMode ? 'bg-black/60 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    <th className={`p-5 pl-7 border-r ${isDarkMode ? 'border-zinc-800/30' : 'border-slate-200/40'}`}>Nama Mahasiswa</th>
                    <th className={`p-5 border-r ${isDarkMode ? 'border-zinc-800/30' : 'border-slate-200/40'}`}>Asal Universitas / Prodi</th>
                    <th className={`p-5 border-r ${isDarkMode ? 'border-zinc-800/30' : 'border-slate-200/40'}`}>Alamat Rumah</th>
                    <th className={`p-5 border-r ${isDarkMode ? 'border-zinc-800/30' : 'border-slate-200/40'}`}>Nominal UKT</th>
                    <th className={`p-5 border-r ${isDarkMode ? 'border-zinc-800/30' : 'border-slate-200/40'}`}>No. Rekening Jatim</th>
                    <th className="p-5 pr-7 text-right">Semester</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'divide-zinc-800 text-zinc-300' : 'divide-slate-100 text-slate-700'
                }`}>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.map((row: any[], index: number) => (
                      <tr key={index} className={`border-b transition-colors duration-200 group ${
                        isDarkMode ? 'hover:bg-emerald-950/20 border-zinc-800/40' : 'hover:bg-emerald-50/30 border-slate-100/70'
                      }`}>
                        <td className={`p-5 pl-7 font-bold border-r transition-colors ${
                          isDarkMode ? 'text-white group-hover:text-emerald-400 border-zinc-800/20' : 'text-slate-900 group-hover:text-emerald-700 border-slate-200/30'
                        }`}>
                          {row[1] || '-'}
                        </td>
                        <td className={`p-5 text-xs max-w-xs truncate border-r ${
                          isDarkMode ? 'text-zinc-400 border-zinc-800/20' : 'text-slate-600 border-slate-200/30'
                        }`} title={row[2]}>
                          {row[2] || '-'}
                        </td>
                        <td className={`p-5 text-xs border-r ${
                          isDarkMode ? 'text-zinc-500 border-zinc-800/20' : 'text-slate-500 border-slate-200/30'
                        }`}>{row[3] || '-'}</td>
                        <td className="p-5 font-bold text-emerald-400 border-r border-zinc-800/20">{row[4] || '-'}</td>
                        <td className={`p-5 font-mono text-xs tracking-tight border-r ${
                          isDarkMode ? 'text-zinc-400 border-zinc-800/20' : 'text-slate-600 border-slate-200/30'
                        }`}>{row[5] || '-'}</td>
                        <td className={`p-5 pr-7 font-bold text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{row[6] || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-16 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Tidak ada data penerima beasiswa ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}