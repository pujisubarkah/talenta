import { pgTable, bigint, varchar, numeric, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const master_rekam_criteria = pgTable('master_rekam_criteria', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  key: varchar('key', { length: 255 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  bobot: numeric('bobot').notNull(),
  options: jsonb('options').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull(),
});
