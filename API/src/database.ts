import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import fs from 'fs'

export const initializeDB = async () => {
  const dbFile = './data/sensors.db'

  // Verifica se o diretório existe, se não, cria
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data')
  }

  // Verifica se o arquivo do banco de dados existe
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, '')
  }

  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  })

  await db.exec(`
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            sensor_type TEXT NOT NULL,
            value TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    `)

  return db
}
