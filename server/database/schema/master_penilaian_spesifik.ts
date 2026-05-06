import { pgTable, serial, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const masterPenilaianSpesifik = pgTable('master_penilaian_spesifik', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  bobot: numeric('bobot').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
