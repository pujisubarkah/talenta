import { pgTable, serial, varchar, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const masterPertimbanganLain = pgTable('master_pertimbangan_lain', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }),
  label: varchar('label', { length: 255 }),
  bobot: numeric('bobot'),
  options: jsonb('options'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
