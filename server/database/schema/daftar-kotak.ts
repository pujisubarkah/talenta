import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const daftarKotak = pgTable('master_kotak_talenta', {
  id:         integer('id').primaryKey(),
  title:      varchar('title'),
  colorClass: varchar('color_class'),
  isActive:   boolean('is_active'),
  updatedAt:  timestamp('updated_at', { withTimezone: true }),
})
