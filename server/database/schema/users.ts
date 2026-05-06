import { bigint, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: bigint('id', { mode: 'bigint' }).primaryKey(),
  pegNip: varchar('peg_nip'),
  pegNama: varchar('peg_nama'),
  jabatanNama: varchar('jabatan_nama'),
  password: varchar('password'),
  roleId: integer('role_id'),
  rememberToken: varchar('remember_token'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
