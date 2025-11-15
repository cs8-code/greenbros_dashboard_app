import fs from 'fs';

// Helper function to save database to file after modifications
export function saveDatabase(db, dbPath) {
  const data = db.export();
  fs.writeFileSync(dbPath, data);
}
