import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const unit = pgTable('unit', {
  id:        serial('id').primaryKey(),
  name:      varchar('name'),
  satkerId:  integer('satker_id'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  kode:      varchar('kode'),
  alias:     varchar('alias'),
})
