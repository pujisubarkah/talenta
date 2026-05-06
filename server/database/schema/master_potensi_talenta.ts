import { pgTable, serial, text, numeric, timestamp } from 'drizzle-orm/pg-core'

export const master_potensi_talenta = pgTable('master_potensi_talenta', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  bobot: numeric('bobot').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})
