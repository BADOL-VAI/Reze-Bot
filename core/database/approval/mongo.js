import { MongoClient } from 'mongodb';

let client = null;
let db = null;

export async function getApprovalDB() {
  if (db) return db;

  const URI = global.Reze.config?.approvalDB?.uri || process.env.APPROVAL_MONGO_URL;
  const DB_NAME = global.Reze.config?.approvalDB?.dbName || 'ErenAIApprovalSystem';

  if (!URI) {
    throw new Error("[ApprovalDB] approvalDB.uri not found in json/config.json");
  }

  client = new MongoClient(URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`[ApprovalDB] ✅ Connected: ${DB_NAME} (Separate)`);
  return db;
}

export async function getApprovalCollection(name) {
  const database = await getApprovalDB();
  return database.collection(name);
}
