import fs from 'fs';
import path from 'path';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_SERVICES,
  INITIAL_TOURS,
  INITIAL_DESTINATIONS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_AIRPORTS,
  INITIAL_WHY_CHOOSE_US,
  INITIAL_DRIVER_PROFILE,
  INITIAL_HOMEPAGE_SETTINGS,
  INITIAL_SEO_SETTINGS,
  INITIAL_MEDIA_ITEMS,
} from '../src/lib/data';
import {
  SiteSettings,
  HomepageSettings,
  DriverProfile,
  SEOSettings,
  WhyChooseUsBenefit,
  Service,
  Tour,
  Destination,
  Booking,
  Review,
  ContactMessage,
  FAQ,
  Vehicle,
  RoutePricing,
  Airport,
  MediaItem,
} from '../src/types';

export interface DatabaseSchema {
  siteSettings: SiteSettings;
  homepageSettings: HomepageSettings;
  driverProfile: DriverProfile;
  seoSettings: SEOSettings;
  whyChooseUs: WhyChooseUsBenefit[];
  services: Service[];
  tours: Tour[];
  destinations: Destination[];
  bookings: Booking[];
  reviews: Review[];
  messages: ContactMessage[];
  faqs: FAQ[];
  vehicles: Vehicle[];
  routes: RoutePricing[];
  airports: Airport[];
  mediaItems: MediaItem[];
  _metadata?: {
    version: string;
    lastUpdated: string;
    created_at: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export function getInitialDatabaseData(): DatabaseSchema {
  return {
    siteSettings: JSON.parse(JSON.stringify(INITIAL_SITE_SETTINGS)),
    homepageSettings: JSON.parse(JSON.stringify(INITIAL_HOMEPAGE_SETTINGS)),
    driverProfile: JSON.parse(JSON.stringify(INITIAL_DRIVER_PROFILE)),
    seoSettings: JSON.parse(JSON.stringify(INITIAL_SEO_SETTINGS)),
    whyChooseUs: JSON.parse(JSON.stringify(INITIAL_WHY_CHOOSE_US)),
    services: JSON.parse(JSON.stringify(INITIAL_SERVICES)),
    tours: JSON.parse(JSON.stringify(INITIAL_TOURS)),
    destinations: JSON.parse(JSON.stringify(INITIAL_DESTINATIONS)),
    bookings: JSON.parse(JSON.stringify(INITIAL_BOOKINGS)),
    reviews: JSON.parse(JSON.stringify(INITIAL_REVIEWS)),
    messages: JSON.parse(JSON.stringify(INITIAL_MESSAGES)),
    faqs: JSON.parse(JSON.stringify(INITIAL_FAQS)),
    vehicles: JSON.parse(JSON.stringify(INITIAL_VEHICLES)),
    routes: JSON.parse(JSON.stringify(INITIAL_ROUTES)),
    airports: JSON.parse(JSON.stringify(INITIAL_AIRPORTS)),
    mediaItems: JSON.parse(JSON.stringify(INITIAL_MEDIA_ITEMS)),
    _metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  };
}

class DatabaseManager {
  private inMemoryCache: DatabaseSchema | null = null;
  private isWriting = false;

  constructor() {
    this.ensureDatabase();
  }

  private ensureDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        const initial = getInitialDatabaseData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
        this.inMemoryCache = initial;
        console.log('✅ Persistent Database initialized at:', DB_FILE);
        return initial;
      }

      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as DatabaseSchema;
      
      // Backfill any missing keys if schema was expanded
      const initial = getInitialDatabaseData();
      let modified = false;

      (Object.keys(initial) as (keyof DatabaseSchema)[]).forEach((key) => {
        if (parsed[key] === undefined) {
          (parsed as any)[key] = initial[key];
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }

      this.inMemoryCache = parsed;
      return parsed;
    } catch (error) {
      console.error('⚠️ Database init error, fallback to initial schema:', error);
      const fallback = getInitialDatabaseData();
      this.inMemoryCache = fallback;
      return fallback;
    }
  }

  public getDatabase(): DatabaseSchema {
    if (this.inMemoryCache) {
      return this.inMemoryCache;
    }
    return this.ensureDatabase();
  }

  public async saveDatabase(newData: DatabaseSchema): Promise<boolean> {
    try {
      newData._metadata = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        created_at: newData._metadata?.created_at || new Date().toISOString(),
      };
      this.inMemoryCache = newData;

      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      await fs.promises.writeFile(tempFile, JSON.stringify(newData, null, 2), 'utf-8');
      await fs.promises.rename(tempFile, DB_FILE);
      return true;
    } catch (err) {
      console.error('❌ Failed to persist database:', err);
      return false;
    }
  }

  // Collection Array Operations
  public getCollection<K extends keyof DatabaseSchema>(name: K): DatabaseSchema[K] {
    const db = this.getDatabase();
    return db[name];
  }

  public async setCollection<K extends keyof DatabaseSchema>(name: K, items: DatabaseSchema[K]): Promise<boolean> {
    const db = this.getDatabase();
    (db as any)[name] = items;
    return this.saveDatabase(db);
  }

  public async insertItem<T extends { id?: string }>(collectionName: keyof DatabaseSchema, item: T): Promise<T> {
    const db = this.getDatabase();
    const list = ((db[collectionName] as unknown as T[]) || []).slice();
    const withId: T = {
      ...item,
      id: item.id || `${collectionName.slice(0, 4)}-${Date.now()}`,
    };
    list.unshift(withId);
    (db as any)[collectionName] = list;
    await this.saveDatabase(db);
    return withId;
  }

  public async updateItem<T extends { id: string }>(
    collectionName: keyof DatabaseSchema,
    id: string,
    updates: Partial<T>
  ): Promise<T | null> {
    const db = this.getDatabase();
    const list = ((db[collectionName] as unknown as T[]) || []).slice();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    (db as any)[collectionName] = list;
    await this.saveDatabase(db);
    return updated;
  }

  public async deleteItem(collectionName: keyof DatabaseSchema, id: string): Promise<boolean> {
    const db = this.getDatabase();
    const list = ((db[collectionName] as unknown as { id: string }[]) || []).slice();
    const filtered = list.filter((x) => x.id !== id);
    (db as any)[collectionName] = filtered;
    await this.saveDatabase(db);
    return true;
  }

  // Singleton Object Operations
  public getSingleton<K extends 'siteSettings' | 'homepageSettings' | 'driverProfile' | 'seoSettings'>(
    name: K
  ): DatabaseSchema[K] {
    const db = this.getDatabase();
    return db[name];
  }

  public async updateSingleton<K extends 'siteSettings' | 'homepageSettings' | 'driverProfile' | 'seoSettings'>(
    name: K,
    updates: Partial<DatabaseSchema[K]>
  ): Promise<DatabaseSchema[K]> {
    const db = this.getDatabase();
    db[name] = {
      ...db[name],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await this.saveDatabase(db);
    return db[name];
  }

  public async resetDatabase(): Promise<DatabaseSchema> {
    const fresh = getInitialDatabaseData();
    await this.saveDatabase(fresh);
    console.log('🔄 Database reset to factory defaults.');
    return fresh;
  }

  public getStats() {
    const db = this.getDatabase();
    return {
      status: 'connected',
      storageType: 'file-backed-json-database',
      fileLocation: DB_FILE,
      lastUpdated: db._metadata?.lastUpdated || new Date().toISOString(),
      counts: {
        bookings: db.bookings?.length || 0,
        messages: db.messages?.length || 0,
        reviews: db.reviews?.length || 0,
        tours: db.tours?.length || 0,
        destinations: db.destinations?.length || 0,
        services: db.services?.length || 0,
        vehicles: db.vehicles?.length || 0,
        routes: db.routes?.length || 0,
        airports: db.airports?.length || 0,
        faqs: db.faqs?.length || 0,
        whyChooseUs: db.whyChooseUs?.length || 0,
        mediaItems: db.mediaItems?.length || 0,
      },
    };
  }
}

export const db = new DatabaseManager();
