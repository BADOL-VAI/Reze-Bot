export const meta = {
  name: "botkick",
  version: "1.0.0",
  author: "S4Eren",
  description: "Notify admin when bot is kicked/removed from group"
};

export async function onEvent({ bot, event }) {
  const msg = event.message || event;
  if (!msg.left_chat_member) return;

  const me = await bot.getMe();
  const left = msg.left_chat_member;

  // বট নিজে লিভ করলো কিনা চেক
  if (left.id!== me.id) return;

  const chatId = String(msg.chat.id);
  const kicker = msg.from; // কে কিক দিলো

  const { setGroup } = await import('../../core/database/approval/store.js');

  // আলাদা DB তে Kicked হিসেবে আপডেট
  await setGroup(chatId, {
    name: msg.chat.title,
    kickedBy: {
      id: kicker.id,
      name: kicker.first_name,
      username: kicker.username || null
    },
    kickedAt: new Date(),
    approved: false,
    isKicked: true,
    lastStatus: "kicked"
  });

  // তোমার ইনবক্সে নোটিশ
  const devID = global.Reze.config.devID || [];
  const text =
    `🚨 **Bot Kicked From Group**\n\n` +
    `📛 Group: ${msg.chat.title}\n` +
    `🆔 ID: \`${chatId}\`\n` +
    `👤 Kicked By: ${kicker.first_name} (@${kicker.username || 'no_username'}) - ${kicker.id}\n` +
    `⏰ Time: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}\n` +
    `📌 Status: ❌ Kicked / Removed\n` +
    `💾 DB: RezeApprovalSystem (Separate)\n` +
    `📦 Collection: groups -> isKicked: true`;

  for (const id of devID) {
    try {
      await bot.sendMessage(id, text, { parse_mode: 'Markdown' });
    } catch (e) {
      console.log("[botKicked] Failed to notify admin", id);
    }
  }

  console.log(`[botKicked] Bot kicked from ${msg.chat.title} (${chatId}) by ${kicker.first_name}`);
}
