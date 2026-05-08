import { pgTable, serial, integer, varchar, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';

export const penilaian = pgTable('penilaian', {
  id: serial('id').primaryKey(),
  kategori_id: integer('kategori_id').notNull(),
  kode: varchar('kode', { length: 32 }).notNull(),
  nama_penilaian: varchar('nama_penilaian', { length: 128 }).notNull(),
  deskripsi: text('deskripsi'),
  bobot: numeric('bobot', { precision: 5, scale: 2 }),
  jenis_nilai: varchar('jenis_nilai', { length: 32 }),
  metode_penilaian: varchar('metode_penilaian', { length: 64 }),
  sumber_nilai: varchar('sumber_nilai', { length: 64 }),
  urutan: integer('urutan'),
  is_wajib: boolean('is_wajib').default(false),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
