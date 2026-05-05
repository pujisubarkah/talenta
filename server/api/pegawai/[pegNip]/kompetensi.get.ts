import { eq } from 'drizzle-orm'
import { db } from '../../../database'
import { pegawai } from '../../../database/schema/pegawai'

export default defineEventHandler(async (event) => {
  const pegNip = getRouterParam(event, 'pegNip')

  if (!pegNip) {
    throw createError({ statusCode: 400, statusMessage: 'pegNip wajib diisi' })
  }

  const columns = {
    pegNip:                              pegawai.pegNip,
    pegNama:                             pegawai.pegNama,
    kompetensiUjiKompetensi:             pegawai.kompetensiUjiKompetensi,
    kompetensiPotensi:                   pegawai.kompetensiPotensi,
    kompetensiIntegritas:                pegawai.kompetensiIntegritas,
    kompetensiKerjasama:                 pegawai.kompetensiKerjasama,
    kompetensiKomunikasi:                pegawai.kompetensiKomunikasi,
    kompetensiOrientasiHasil:            pegawai.kompetensiOrientasiHasil,
    kompetensiPelayananPublik:           pegawai.kompetensiPelayananPublik,
    kompetensiPengembanganDiriOrangLain: pegawai.kompetensiPengembanganDiriOrangLain,
    kompetensiMengelolaPerubahan:        pegawai.kompetensiMengelolaPerubahan,
    kompetensiPengambilanKeputusan:      pegawai.kompetensiPengambilanKeputusan,
    kompetensiPerekatBangsa:             pegawai.kompetensiPerekatBangsa,
    kompetensiTotal:                     pegawai.kompetensiTotal,
  }

  const [row] = await db
    .select(columns)
    .from(pegawai)
    .where(eq(pegawai.pegNip, pegNip))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Pegawai tidak ditemukan' })
  }

  return { data: row }
})
