import { getApprovalCollection } from './mongo.js';

export async function getGroup(chatId) {
  const col = await getApprovalCollection('groups');
  const data = await col.findOne({ chatId: String(chatId) });
  return data || { chatId: String(chatId), approved: false, name: "Unknown" };
}

export async function setGroup(chatId, patch) {
  const col = await getApprovalCollection('groups');
  await col.updateOne(
    { chatId: String(chatId) },
    { $set: {...patch, chatId: String(chatId), updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function getAllGroups() {
  const col = await getApprovalCollection('groups');
  return await col.find({}).toArray();
}

export async function getGlobal(key) {
  const col = await getApprovalCollection('system_settings');
  const doc = await col.findOne({ key });
  const defaults = { inbox: true, whitelist: false };
  return doc? doc.value : defaults[key];
}

export async function setGlobal(key, value) {
  const col = await getApprovalCollection('system_settings');
  await col.updateOne({ key }, { $set: { value, key, updatedAt: new Date() } }, { upsert: true });
}
