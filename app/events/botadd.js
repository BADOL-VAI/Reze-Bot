export const meta = {
  name: "botadd",
  version: "1.0.0",
  author: "MOHAMMAD BADOL",
  description: "Notify admin when bot added to new group"
};

export async function onEvent({ bot, event }) {
  const msg = event.message || event;
  if (!msg.new_chat_members) return;

  const me = await bot.getMe();
  const added = msg.new_chat_members.find(m => m.id === me.id);
  if (!added) return;

  const chatId = String(msg.chat.id);
  const { setGroup } = await import('../../core/database/approval/store.js');

  await setGroup(chatId, {
    name: msg.chat.title,
    username: msg.chat.username || null,
    addedBy: {
      id: msg.from.id,
      name: msg.from.first_name,
      username: msg.from.username || null
    },
    addedAt: new Date(),
    approved: false
  });

  const devID = global.Reze.config.devID || [];
  const text =
    `🚨 **New Group Added**\n\n` +
    `📛 Group: ${msg.chat.title}\n` +
    `🆔 ID: \`${chatId}\`\n` +
    `👤 Added By: ${msg.from.first_name} (@${msg.from.username || 'no'}) - ${msg.from.id}\n` +
    `⏰ ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}\n` +
    `Status: ❌ Not Approved\n` +
    `DB: RezeApprovalSystem`;

  for (const id of devID) {
    try {
      await bot.sendMessage(id, text, { parse_mode: 'Markdown' });
    } catch {}
  }

  try {
    await bot.sendMessage(chatId,
      `⚠️ এই গ্রুপটি এখনো Approve করা হয়নি।\nAdmin approval এর জন্য অপেক্ষা করুন।`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: "📩 Contact Admin", url: `https://t.me/${global.Reze.botUsername || 'S4Eren'}` }
          ]]
        }
      }
    );
  } catch {}
    }
