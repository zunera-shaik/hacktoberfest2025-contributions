import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'chatgpt_clone.db');
let db: Database.Database | null = null;

export const getDatabase = () => {
  if (!db) {
    // Create data directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new Database(dbPath);
    initializeDatabase();
  }
  return db;
};

export const initializeDatabase = () => {
  if (!db) return;
  
  try {
    // Create chats table
    db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT 'New Chat',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
    `);
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
    `);

    console.log('✓ SQLite database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing SQLite database:', error);
    throw error;
  }
};

export default getDatabase;
