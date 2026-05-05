import { boolean, integer, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const pegawai = pgTable('pegawai', {
  pegNip:                              varchar('peg_nip').primaryKey(),
  pegNama:                             varchar('peg_nama'),
  jabatan:                             varchar('jabatan'),
  satuanKerjaNama:                     varchar('satuan_kerja_nama'),
  unitKerjaNama:                       varchar('unit_kerja_nama'),
  eselonNm:                            varchar('eselon_nm'),
  golAkhirNm:                          varchar('gol_akhir_nm'),
  golIdAkhir:                          integer('gol_id_akhir'),
  eselonId:                            integer('eselon_id'),
  jabatanId:                           integer('jabatan_id'),
  satuanKerjaId:                       integer('satuan_kerja_id'),
  unitKerjaId:                         integer('unit_kerja_id'),
  photoUrl:                            varchar('photo_url'),
  jfuId:                               integer('jfu_id'),
  jfId:                                integer('jf_id'),

  // Nilai utama
  nilaiKinerja:                        numeric('nilai_kinerja'),
  nilaiPotensi:                        numeric('nilai_potensi'),
  nineBox:                             varchar('nine_box'),

  // Kualifikasi
  kualifikasiPendidikan:               numeric('kualifikasi_pendidikan'),
  kualifikasiRiwayatJabatan:           numeric('kualifikasi_riwayat_jabatan'),
  kualifikasiGolongan:                 numeric('kualifikasi_golongan'),
  kualifikasiDiklat:                   numeric('kualifikasi_diklat'),
  kualifikasiMasaKerja:                numeric('kualifikasi_masa_kerja'),

  // Kompetensi
  kompetensiUjiKompetensi:             numeric('kompetensi_uji_kompetensi'),
  kompetensiPotensi:                   numeric('kompetensi_potensi'),
  kompetensiIntegritas:                numeric('kompetensi_integritas'),
  kompetensiKerjasama:                 numeric('kompetensi_kerjasama'),
  kompetensiKomunikasi:                numeric('kompetensi_komunikasi'),
  kompetensiOrientasiHasil:            numeric('kompetensi_orientasi_hasil'),
  kompetensiPelayananPublik:           numeric('kompetensi_pelayanan_publik'),
  kompetensiPengembanganDiriOrangLain: numeric('kompetensi_pengembangan_diri_orang_lain'),
  kompetensiMengelolaPerubahan:        numeric('kompetensi_mengelola_perubahan'),
  kompetensiPengambilanKeputusan:      numeric('kompetensi_pengambilan_keputusan'),
  kompetensiPerekatBangsa:             numeric('kompetensi_perekat_bangsa'),
  kompetensiTotal:                     numeric('kompetensi_total'),

  // Kinerja
  kinerjaSkp:                          numeric('kinerja_skp'),
  kinerjaReview:                       numeric('kinerja_review'),
  kinerjaRata:                         numeric('kinerja_rata'),
  kinerjaPertimbanganLain:             numeric('kinerja_pertimbangan_lain'),

  // Potensi detail
  potensiDayaAnalisa:                  numeric('potensi_daya_analisa'),
  potensiLogikaBerpikir:               numeric('potensi_logika_berpikir'),
  potensiSistematikaKerja:             numeric('potensi_sistematika_kerja'),
  potensiInisiatif:                    numeric('potensi_inisiatif'),
  potensiDayaTahanKerja:               numeric('potensi_daya_tahan_kerja'),
  potensiKepemimpinan:                 numeric('potensi_kepemimpinan'),
  potensiDoronganBerprestasi:          numeric('potensi_dorongan_berprestasi'),
  potensiTanggungJawab:                numeric('potensi_tanggung_jawab'),
  potensiKeterampilanInterpersonal:    numeric('potensi_keterampilan_interpersonal'),
  potensiKepercayaanDiri:              numeric('potensi_kepercayaan_diri'),
  potensiStabilitasEmosi:              numeric('potensi_stabilitas_emosi'),
  potensiKemampuanIntelektual:         numeric('potensi_kemampuan_intelektual'),
  potensiKemampuanBerpikirKritis:      numeric('potensi_kemampuan_berpikir_kritis'),
  potensiMenyelesaikanPermasalahan:    numeric('potensi_menyelesaikan_permasalahan'),
  potensiSistematikaKetelitianKerja:   numeric('potensi_sistematika_dan_ketelitian_kerja'),
  potensiMotivasiKomitmen:             numeric('potensi_motivasi_dan_komitmen'),
  potensiKecerdasanEmosional:          numeric('potensi_kecerdasan_emosional'),
  potensiKemampuanAsertif:             numeric('potensi_kemampuan_asertif'),
  potensiKemampuanBelajarCepat:        numeric('potensi_kemampuan_belajar_cepat'),
  potensiKemampuanInterpersonal:       numeric('potensi_kemampuan_interpersonal'),
  potensiKemampuanMengarahkan:         numeric('potensi_kemampuan_mengarahkan'),
  potensiTotal:                        numeric('potensi_total'),

  // Skor agregat
  jumlahJabatanEselonTerakhir:         integer('jumlah_jabatan_eselon_terakhir'),
  manajerial:                          numeric('manajerial'),
  sosiokultural:                       numeric('sosiokultural'),
  teknis:                              numeric('teknis'),
  kemampuanMemecahkanMasalah:          numeric('kemampuan_memecahkan_masalah'),
  integritas:                          numeric('integritas'),
  orientasiPelayanan:                  numeric('orientasi_pelayanan'),
  riwayatJabatan:                      numeric('riwayat_jabatan'),
  kompetensi:                          numeric('kompetensi'),
  potensi:                             numeric('potensi'),
  kualifikasi:                         numeric('kualifikasi'),
  pt:                                  numeric('pt'),
  eotm:                                numeric('eotm'),
  nilaiKompetensi:                     numeric('nilai_kompetensi'),
  nilaiKualifikasi:                    numeric('nilai_kualifikasi'),
  levelKompetensiAcuan:                varchar('level_kompetensi_acuan'),
  kompetensiJobPercentMatch:           numeric('kompetensi_job_percent_match'),
  potensialPertimbanganLain:           numeric('potensial_pertimbangan_lain'),

  // Jumlah aktivitas
  jumlahPublikasi:                     integer('jumlah_publikasi'),
  jumlahPrestasiPribadi:               integer('jumlah_prestasi_pribadi'),
  jumlahKeterlibatanTimkerja:          integer('jumlah_keterlibatan_timkerja'),
  jumlahPelatihan:                     integer('jumlah_pelatihan'),
  jumlahExperties:                     integer('jumlah_experties'),
  jumlahKonferensi:                    integer('jumlah_konferensi'),
  jumlahPrestasiKelompok:              integer('jumlah_prestasi_kelompok'),

  // Flag & status
  isGtk:                               boolean('is_gtk'),
  pegStatus:                           varchar('peg_status'),

  // Timestamps
  deletedAt:                           timestamp('deleted_at'),
  createdAt:                           timestamp('created_at'),
  updatedAt:                           timestamp('updated_at'),
})
