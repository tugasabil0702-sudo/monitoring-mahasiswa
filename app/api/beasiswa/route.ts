// app/api/beasiswa/route.ts
import { getBeasiswaData } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // 1. Ambil data gabungan dari fungsi googleSheets
  const data = await getBeasiswaData();
  
  // Menambahkan headers khusus agar browser dan server tidak menyimpan cache
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}