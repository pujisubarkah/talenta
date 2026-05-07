import { and, count, eq, ilike, or } from 'drizzle-orm'
import { db } from '../../database'
import { pegawai } from '../../database/schema/pegawai'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page    = Math.max(1, Number(query.page)  || 1)
  const limit   = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const offset  = (page - 1) * limit
  const search  = String(query.search || '').trim()
  const nineBox = query.nineBox ? Number(query.nineBox) : undefined

  // Select all columns as per schema
  const columns = {
    pegNip: pegawai.pegNip,
    pegNama: pegawai.pegNama,
    jabatan: pegawai.jabatan,
    satuanKerjaNama: pegawai.satuanKerjaNama,
    unitKerjaNama: pegawai.unitKerjaNama,
    eselonNm: pegawai.eselonNm,
    golAkhirNm: pegawai.golAkhirNm,
    golIdAkhir: pegawai.golIdAkhir,
    eselonId: pegawai.eselonId,
    jabatanId: pegawai.jabatanId,
    satuanKerjaId: pegawai.satuanKerjaId,
    unitKerjaId: pegawai.unitKerjaId,
    photoUrl: pegawai.photoUrl,
    jfuId: pegawai.jfuId,
    jfId: pegawai.jfId,
    nilaiKinerja: pegawai.nilaiKinerja,
    nilaiPotensi: pegawai.nilaiPotensi,
    nineBox: pegawai.nineBox,
    kualifikasiPendidikan: pegawai.kualifikasiPendidikan,
    kualifikasiRiwayatJabatan: pegawai.kualifikasiRiwayatJabatan,
    kualifikasiGolongan: pegawai.kualifikasiGolongan,
    kualifikasiDiklat: pegawai.kualifikasiDiklat,
    kualifikasiMasaKerja: pegawai.kualifikasiMasaKerja,
    kompetensiUjiKompetensi: pegawai.kompetensiUjiKompetensi,
    kompetensiPotensi: pegawai.kompetensiPotensi,
    kompetensiIntegritas: pegawai.kompetensiIntegritas,
    kompetensiKerjasama: pegawai.kompetensiKerjasama,
    kompetensiKomunikasi: pegawai.kompetensiKomunikasi,
    kompetensiOrientasiHasil: pegawai.kompetensiOrientasiHasil,
    kompetensiPelayananPublik: pegawai.kompetensiPelayananPublik,
    kompetensiPengembanganDiriOrangLain: pegawai.kompetensiPengembanganDiriOrangLain,
    kompetensiMengelolaPerubahan: pegawai.kompetensiMengelolaPerubahan,
    kompetensiPengambilanKeputusan: pegawai.kompetensiPengambilanKeputusan,
    kompetensiPerekatBangsa: pegawai.kompetensiPerekatBangsa,
    kompetensiTotal: pegawai.kompetensiTotal,
    kinerjaSkp: pegawai.kinerjaSkp,
    kinerjaReview: pegawai.kinerjaReview,
    kinerjaRata: pegawai.kinerjaRata,
    kinerjaPertimbanganLain: pegawai.kinerjaPertimbanganLain,
    potensiDayaAnalisa: pegawai.potensiDayaAnalisa,
    potensiLogikaBerpikir: pegawai.potensiLogikaBerpikir,
    potensiSistematikaKerja: pegawai.potensiSistematikaKerja,
    potensiInisiatif: pegawai.potensiInisiatif,
    potensiDayaTahanKerja: pegawai.potensiDayaTahanKerja,
    potensiKepemimpinan: pegawai.potensiKepemimpinan,
    potensiDoronganBerprestasi: pegawai.potensiDoronganBerprestasi,
    potensiTanggungJawab: pegawai.potensiTanggungJawab,
    potensiKeterampilanInterpersonal: pegawai.potensiKeterampilanInterpersonal,
    potensiKepercayaanDiri: pegawai.potensiKepercayaanDiri,
    potensiStabilitasEmosi: pegawai.potensiStabilitasEmosi,
    potensiKemampuanIntelektual: pegawai.potensiKemampuanIntelektual,
    potensiKemampuanBerpikirKritis: pegawai.potensiKemampuanBerpikirKritis,
    potensiMenyelesaikanPermasalahan: pegawai.potensiMenyelesaikanPermasalahan,
    potensiSistematikaKetelitianKerja: pegawai.potensiSistematikaKetelitianKerja,
    potensiMotivasiKomitmen: pegawai.potensiMotivasiKomitmen,
    potensiKecerdasanEmosional: pegawai.potensiKecerdasanEmosional,
    potensiKemampuanAsertif: pegawai.potensiKemampuanAsertif,
    potensiKemampuanBelajarCepat: pegawai.potensiKemampuanBelajarCepat,
    potensiKemampuanInterpersonal: pegawai.potensiKemampuanInterpersonal,
    potensiKemampuanMengarahkan: pegawai.potensiKemampuanMengarahkan,
    potensiTotal: pegawai.potensiTotal,
    jumlahJabatanEselonTerakhir: pegawai.jumlahJabatanEselonTerakhir,
    manajerial: pegawai.manajerial,
    sosiokultural: pegawai.sosiokultural,
    teknis: pegawai.teknis,
    kemampuanMemecahkanMasalah: pegawai.kemampuanMemecahkanMasalah,
    integritas: pegawai.integritas,
    orientasiPelayanan: pegawai.orientasiPelayanan,
    riwayatJabatan: pegawai.riwayatJabatan,
    kompetensi: pegawai.kompetensi,
    potensi: pegawai.potensi,
    kualifikasi: pegawai.kualifikasi,
    pt: pegawai.pt,
    eotm: pegawai.eotm,
    nilaiKompetensi: pegawai.nilaiKompetensi,
    nilaiKualifikasi: pegawai.nilaiKualifikasi,
    levelKompetensiAcuan: pegawai.levelKompetensiAcuan,
    kompetensiJobPercentMatch: pegawai.kompetensiJobPercentMatch,
    potensialPertimbanganLain: pegawai.potensialPertimbanganLain,
    jumlahPublikasi: pegawai.jumlahPublikasi,
    jumlahPrestasiPribadi: pegawai.jumlahPrestasiPribadi,
    jumlahKeterlibatanTimkerja: pegawai.jumlahKeterlibatanTimkerja,
    jumlahPelatihan: pegawai.jumlahPelatihan,
    jumlahExperties: pegawai.jumlahExperties,
    jumlahKonferensi: pegawai.jumlahKonferensi,
    jumlahPrestasiKelompok: pegawai.jumlahPrestasiKelompok,
    isGtk: pegawai.isGtk,
    pegStatus: pegawai.pegStatus,
    deletedAt: pegawai.deletedAt,
    createdAt: pegawai.createdAt,
    updatedAt: pegawai.updatedAt,
  }

  const searchClause = search
    ? or(
        ilike(pegawai.pegNip,          `%${search}%`),
        ilike(pegawai.pegNama,         `%${search}%`),
        ilike(pegawai.jabatan,         `%${search}%`),
        ilike(pegawai.satuanKerjaNama, `%${search}%`),
        ilike(pegawai.unitKerjaNama,   `%${search}%`),
      )
    : undefined

  const nineBoxClause = nineBox ? eq(pegawai.nineBox, String(nineBox)) : undefined

  const whereClause = searchClause && nineBoxClause
    ? and(searchClause, nineBoxClause)
    : searchClause ?? nineBoxClause

  const [rows, countRows] = await Promise.all([
    db.select(columns).from(pegawai).where(whereClause).limit(limit).offset(offset),
    db.select({ total: count() }).from(pegawai).where(whereClause),
  ])

  const total = countRows[0]?.total ?? 0

  return {
    data: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
})
