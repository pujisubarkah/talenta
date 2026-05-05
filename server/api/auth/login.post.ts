import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'

import { db } from '../../database'
import { users } from '../../database/schema'

interface LoginBody {
  pegNip?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  const pegNip = body.pegNip?.trim()
  const password = body.password

  if (!pegNip || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'pegNip dan password wajib diisi',
    })
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.pegNip, pegNip))
    .limit(1)

  if (!user?.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'NIP atau password salah',
    })
  }

  const passwordValid = await compare(password, user.password)

  if (!passwordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'NIP atau password salah',
    })
  }

  return {
    success: true,
    message: 'Login berhasil',
    data: {
      id: user.id.toString(),
      pegNip: user.pegNip,
      pegNama: user.pegNama,
      jabatanNama: user.jabatanNama,
      roleId: user.roleId,
    },
  }
})
