
import { kategoriPenilaian } from '../../../database/schema/kategori-penilaian';
import { db } from '../../../database';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    const data = await db.select().from(kategoriPenilaian).orderBy(kategoriPenilaian.urutan);
    return data;
  }

  if (method === 'POST') {
    const body = await readBody(event);

    const values = {
      kode: body.kode as string,
      nama_kategori: body.nama_kategori as string,
      deskripsi: body.deskripsi as string | undefined,
      urutan: body.urutan as number | undefined,
      is_active: (body.is_active ?? true) as boolean,
      // drizzle `timestamp(..., { withTimezone: true })` expects a Date, not an ISO string
      created_at: new Date(),
    } satisfies typeof kategoriPenilaian.$inferInsert;

    const inserted = await db.insert(kategoriPenilaian).values(values).returning();
    return inserted[0];
  }
});
