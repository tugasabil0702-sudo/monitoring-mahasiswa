// lib/googleSheets.ts
import { google } from 'googleapis';

export async function getBeasiswaData() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Daftar nama-nama sheet asli sesuai tab Spreadsheet Anda
  const listSheet = [
    'Sepuluh Sarjana Lanjutan',
    'PONPES Lanjutan',
    'Scientis Lanjutan',
    'Tugas Akhir',
    'Kemis Baru'
  ];

  let semuaDataGABUNGAN: any[] = [];

  for (const namaSheet of listSheet) {
    try {
      // Mengambil data dari baris ke-2 hingga terakhir (melewati header NO, NAMA, dll)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${namaSheet}!A2:G`, 
      });

      const rows = response.data.values;

      if (rows && rows.length > 0) {
        // Lakukan looping untuk setiap baris di sheet saat ini
        const dataDenganNamaSheet = rows.map((row) => {
          // Pastikan kolom terisi rata (NO, NAMA, KAMPUS, ALAMAT, UKT, REKENING, SEMESTER)
          const barisBaru = [...row];
          
          // Mengisi '-' jika ada kolom kosong di tengah agar urutannya tidak bergeser
          while (barisBaru.length < 7) {
            barisBaru.push('-');
          }

          // [PENTING] Selipkan namaSheet sebagai elemen ke-8 (index ke-7) di akhir array baris
          barisBaru.push(namaSheet); 
          
          return barisBaru;
        });

        // Gabungkan ke keranjang data utama
        semuaDataGABUNGAN.push(...dataDenganNamaSheet);
      }
    } catch (error) {
      console.error(`Gagal mengambil data dari sheet: ${namaSheet}`, error);
    }
  }

  return semuaDataGABUNGAN;
}