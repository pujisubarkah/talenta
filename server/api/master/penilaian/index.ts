import { db } from '../../../database';
import { penilaian } from '../../../database/schema/penilaian';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  if (method === 'GET') {
    const data = await db.select().from(penilaian);
    return data;
  }
  if (method === 'POST') {
    const body = await readBody(event);
    const [inserted] = await db.insert(penilaian).values(body).returning();
    return inserted;
  }
  if (method === 'PATCH') {
    const body = await readBody(event);
    if (!body.id) return { error: 'Missing id' };
    const [updated] = await db.update(penilaian).set(body).where(eq(penilaian.id, body.id)).returning();
    return updated;
  }
  if (method === 'DELETE') {
    const { id } = await readBody(event);
    if (!id) return { error: 'Missing id' };
    await db.delete(penilaian).where(eq(penilaian.id, id));
    return { success: true };
  }
  return { error: 'Method not allowed' };
});
