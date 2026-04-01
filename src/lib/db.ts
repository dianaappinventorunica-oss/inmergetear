import { createClient, Client } from '@libsql/client';

let db: Client | null = null;

function getDb(): Client {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    if (url && token) {
      db = createClient({ url, authToken: token });
    } else {
      db = createClient({ url: 'file:dev.db' });
    }
  }
  return db;
}

let initialized = false;
async function ensureTable() {
  if (initialized) return;
  const client = getDb();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS Experience (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT NOT NULL,
      type TEXT DEFAULT '360',
      category TEXT DEFAULT 'general',
      qrCodeUrl TEXT,
      isPublished INTEGER DEFAULT 1,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
  initialized = true;
}

export interface Experience {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  type: string;
  category: string;
  qrCodeUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || null,
    imageUrl: row.imageUrl as string,
    type: (row.type as string) || '360',
    category: (row.category as string) || 'general',
    qrCodeUrl: (row.qrCodeUrl as string) || null,
    isPublished: Boolean(row.isPublished),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function dbGetAllExperiences(): Promise<Experience[]> {
  await ensureTable();
  const result = await getDb().execute('SELECT * FROM Experience WHERE isPublished = 1 ORDER BY rowid DESC');
  return result.rows.map(rowToExperience);
}

export async function dbGetExperience(id: string): Promise<Experience | null> {
  await ensureTable();
  const result = await getDb().execute({
    sql: 'SELECT * FROM Experience WHERE id = ?',
    args: [id],
  });
  return result.rows.length > 0 ? rowToExperience(result.rows[0] as Record<string, unknown>) : null;
}

export async function dbCreateExperience(data: { id: string; title: string; description: string | null; imageUrl: string; type: string; category: string; qrCodeUrl: string | null }): Promise<Experience> {
  await ensureTable();
  const now = new Date().toISOString();
  await getDb().execute({
    sql: 'INSERT INTO Experience (id, title, description, imageUrl, type, category, qrCodeUrl, isPublished, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
    args: [data.id, data.title, data.description, data.imageUrl, data.type, data.category, data.qrCodeUrl, now, now],
  });
  return { ...data, isPublished: true, createdAt: now, updatedAt: now };
}

export async function dbDeleteExperience(id: string): Promise<void> {
  await ensureTable();
  await getDb().execute({ sql: 'DELETE FROM Experience WHERE id = ?', args: [id] });
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export { generateId };


