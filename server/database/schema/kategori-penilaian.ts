import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const kategoriPenilaian = pgTable('kategori_penilaian', {
  id: serial('id').primaryKey(),
  kode: varchar('kode', { length: 32 }).notNull(),
  nama_kategori: varchar('nama_kategori', { length: 128 }).notNull(),
  deskripsi: text('deskripsi'),
  urutan: integer('urutan'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
