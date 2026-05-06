import { boolean, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const jenisJabatan = pgTable('master_jenis_jabatan', {
  id:       integer('id').primaryKey(),
  kode:     varchar('kode'),
  nama:     varchar('nama'),
  kategori: varchar('kategori'),
  isActive: boolean('is_active'),
})
