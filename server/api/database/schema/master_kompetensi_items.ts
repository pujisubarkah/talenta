import { pgTable, serial, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';

export const masterKompetensiItems = pgTable('master_kompetensi_items', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }),
  label: varchar('label', { length: 255 }),
  bobot: numeric('bobot'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
