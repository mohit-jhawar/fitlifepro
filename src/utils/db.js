import { openDB } from 'idb';

const DB_NAME = 'fitlife-db';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      },
    }).catch((err) => {
      console.warn('[DB] IndexedDB unavailable:', err);
      dbPromise = null;
      return null;
    });
  }
  return dbPromise;
}

export async function cachePlans(plans) {
  try {
    const db = await getDB();
    if (!db) return;
    await db.put('cache', plans, 'plans');
  } catch (err) {
    console.warn('[DB] Failed to cache plans:', err);
  }
}

export async function getCachedPlans() {
  try {
    const db = await getDB();
    if (!db) return [];
    return (await db.get('cache', 'plans')) || [];
  } catch (err) {
    console.warn('[DB] Failed to get cached plans:', err);
    return [];
  }
}

export async function cacheWorkoutSessions(sessions) {
  try {
    const db = await getDB();
    if (!db) return;
    await db.put('cache', sessions, 'workoutSessions');
  } catch (err) {
    console.warn('[DB] Failed to cache workout sessions:', err);
  }
}

export async function getCachedWorkoutSessions() {
  try {
    const db = await getDB();
    if (!db) return [];
    return (await db.get('cache', 'workoutSessions')) || [];
  } catch (err) {
    console.warn('[DB] Failed to get cached workout sessions:', err);
    return [];
  }
}
