import { pgTable, bigserial, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';

export const masterKompetensiItems = pgTable('master_kompetensi_items', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  key: varchar('key', { length: 64 }).notNull(),
  label: varchar('label', { length: 128 }).notNull(),
  bobot: numeric('bobot', { precision: 5, scale: 2 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
