import { eq } from 'drizzle-orm'
import { db } from '../../../database'
import { pegawai } from '../../../database/schema/pegawai'

export default defineEventHandler(async (event) => {
  const pegNip = getRouterParam(event, 'pegNip')

  if (!pegNip) {
    throw createError({ statusCode: 400, statusMessage: 'pegNip wajib diisi' })
  }

  const columns = {
    pegNip:                           pegawai.pegNip,
    pegNama:                          pegawai.pegNama,
    potensiDayaAnalisa:               pegawai.potensiDayaAnalisa,
    potensiLogikaBerpikir:            pegawai.potensiLogikaBerpikir,
    potensiSistematikaKerja:          pegawai.potensiSistematikaKerja,
    potensiInisiatif:                 pegawai.potensiInisiatif,
    potensiDayaTahanKerja:            pegawai.potensiDayaTahanKerja,
    potensiKepemimpinan:              pegawai.potensiKepemimpinan,
    potensiDoronganBerprestasi:       pegawai.potensiDoronganBerprestasi,
    potensiTanggungJawab:             pegawai.potensiTanggungJawab,
    potensiKeterampilanInterpersonal: pegawai.potensiKeterampilanInterpersonal,
    potensiKepercayaanDiri:           pegawai.potensiKepercayaanDiri,
    potensiStabilitasEmosi:           pegawai.potensiStabilitasEmosi,
    potensiKemampuanIntelektual:      pegawai.potensiKemampuanIntelektual,
    potensiKemampuanBerpikirKritis:   pegawai.potensiKemampuanBerpikirKritis,
    potensiMenyelesaikanPermasalahan: pegawai.potensiMenyelesaikanPermasalahan,
    potensiSistematikaKetelitianKerja:pegawai.potensiSistematikaKetelitianKerja,
    potensiMotivasiKomitmen:          pegawai.potensiMotivasiKomitmen,
    potensiKecerdasanEmosional:       pegawai.potensiKecerdasanEmosional,
    potensiKemampuanAsertif:          pegawai.potensiKemampuanAsertif,
    potensiKemampuanBelajarCepat:     pegawai.potensiKemampuanBelajarCepat,
    potensiKemampuanInterpersonal:    pegawai.potensiKemampuanInterpersonal,
    potensiKemampuanMengarahkan:      pegawai.potensiKemampuanMengarahkan,
    potensiTotal:                     pegawai.potensiTotal,
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
