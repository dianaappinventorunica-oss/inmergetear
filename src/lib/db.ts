import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Función para crear la conexión a la base de datos
// Soporta: SQLite local (desarrollo) y Turso (producción)
function createDatabaseConnection() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN

  // Si hay credenciales de Turso, usar libSQL en la nube
  if (tursoUrl && tursoAuthToken) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    })
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
  }

  // Si no, usar SQLite local (desarrollo)
  return new PrismaClient({
    log: ['query'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ?? createDatabaseConnection()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
