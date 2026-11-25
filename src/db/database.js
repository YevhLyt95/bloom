//connect SQLite and CRUD functions

import * as SQLite from 'expo-sqlite';

let dbInstance = null;

// open or create local bloom.db
export async function getDb() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('bloom.db');
  }
  return dbInstance;
}

// helper: add N days to the date
function addDaysToIso(dateObj, days) {
  const result = new Date(dateObj);
  result.setDate(result.getDate() + Number(days));
  return result.toISOString();
}

// 1. Init plants table during app start
export async function initDatabase() {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      plant_type TEXT DEFAULT 'Indoor plant',
      water_frequency_days INTEGER NOT NULL DEFAULT 3,
      last_watered_at TEXT NOT NULL,
      next_water_at TEXT NOT NULL,
      light_info TEXT DEFAULT 'Bright indirect light',
      humidity_info TEXT DEFAULT '50-60%',
      temperature_info TEXT DEFAULT '18-25°C',
      notes TEXT DEFAULT '',
      photo_uri TEXT DEFAULT NULL,
      notification_id TEXT DEFAULT NULL
    );
  `);
}

// 2. get all plants (sorted by the nearest watering date)
export async function getAllPlants() {
  const db = await getDb();
  return await db.getAllAsync(
    'SELECT * FROM plants ORDER BY datetime(next_water_at) ASC;'
  );
}

// 3. get plant by id (for screen Plant Card)
export async function getPlantById(id) {
  const db = await getDb();
  return await db.getFirstAsync('SELECT * FROM plants WHERE id = ?;', [id]);
}

// 4. Add the new plant (from screen Add New Plant)
export async function addPlant({
  name,
  plantType = 'Indoor plant',
  waterFrequencyDays = 3,
  lightInfo = 'Bright indirect light',
  humidityInfo = '50-60%',
  temperatureInfo = '18-25°C',
  notes = '',
  photoUri = null,
}) {
  const db = await getDb();
  const now = new Date();
  const lastWateredAt = now.toISOString();
  const nextWaterAt = addDaysToIso(now, waterFrequencyDays);

  const result = await db.runAsync(
    `INSERT INTO plants (
      name,
      plant_type,
      water_frequency_days,
      last_watered_at,
      next_water_at,
      light_info,
      humidity_info,
      temperature_info,
      notes,
      photo_uri
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      name.trim(),
      plantType,
      Number(waterFrequencyDays),
      lastWateredAt,
      nextWaterAt,
      lightInfo,
      humidityInfo,
      temperatureInfo,
      notes.trim(),
      photoUri,
    ]
  );

  return result.lastInsertRowId;
}

// 5. check in ("Watered") — updates the watering date and calculate the next one
export async function markPlantWatered(id, waterFrequencyDays) {
  const db = await getDb();
  const now = new Date();
  const lastWateredAt = now.toISOString();
  const nextWaterAt = addDaysToIso(now, waterFrequencyDays);

  await db.runAsync(
    `UPDATE plants
     SET last_watered_at = ?, next_water_at = ?
     WHERE id = ?;`,
    [lastWateredAt, nextWaterAt, id]
  );

  return nextWaterAt;
}

// 6. delete the plant
export async function deletePlant(id) {
  const db = await getDb();
  await db.runAsync('DELETE FROM plants WHERE id = ?;', [id]);
}