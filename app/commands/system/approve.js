export const meta = {
  name: "apv",
  version: "2.0.0",
  aliases: ["apvlist", "grouplist", "approve"],
  description: "Group approval system - separate MongoDB",
  author: "MOHAMMAD BADOL",
  category: "system",
  type: "developer",
  cooldown: 3,
  guide: ["", "on <groupID>", "off <groupID>"]
};

export async function onStart({ args, response, config, bot, senderID, chatId, isGroup, role, usedPrefix }) {
  const { getAllGroups } = await import('../../../core/database/approval/store.js');
  const groups = await getAllGroups();

  if (!groups.length) {
    return response.reply("📭 কোনো গ্রুপে বট Add নেই।\nDB: RezeApprovalSystem (Separate)");
  }

  let text = `📋 **Total Groups: ${groups.length}**\n**DB: RezeApprovalSystem**\n\n`;
  const buttons = [];

  for (const g of groups) {
    const st = g.approved? "✅ ON" : "❌ OFF";
    text += `${st} - ${g.name} - \`${g.chatId}\`\n`;
    buttons.push([{
      text: `${g.name.slice(0, 22)} ${st}`,
      callback_data: JSON.stringify({ command: "apv", a: "view", id: g.chatId })
    }]);
  }

  await response.reply(text, {
    reply_markup: { inline_keyboard: buttons }
  });
}

export async function onCallback({ bot, callbackQuery, payload, response, chatId, messageId, senderID, isGroup, role }) {
  const { getGroup, setGroup, getAllGroups } = await import('../../../core/database/approval/store.js');

  if (payload.a === 'view') {
    const g = await getGroup(payload.id);
    const status = g.approved? "✅ Approved" : "❌ Not Approved";
    const addedBy = g.addedBy? `${g.addedBy.name} (@${g.addedBy.username || 'no'})` : "Unknown";
    const t = `📁 **${g.name}**\n\n🆔 ID: \`${g.chatId}\`\n📊 Status: ${status}\n👤 Added By: ${addedBy}\n⏰ Added: ${g.addedAt? new Date(g.addedAt).toLocaleString('en-BD') : 'N/A'}\n\n**DB:** RezeApprovalSystem`;

    await response.edit('text', messageId, t, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ ON", callback_data: JSON.stringify({ command: "apv", a: "on", id: g.chatId }) },
            { text: "❌ OFF", callback_data: JSON.stringify({ command: "apv", a: "off", id: g.chatId }) }
          ],
          [{ text: "🔙 Back to List", callback_data: JSON.stringify({ command: "apv", a: "list" }) }]
        ]
      }
    });
    await response.answerCallback(callbackQuery);
  }

  if (payload.a === 'on') {
    await setGroup(payload.id, { approved: true });
    await response.edit('text', messageId, `✅ Group \`${payload.id}\` Approved! (Saved in Separate DB)`, { reply_markup: { inline_keyboard: [] } });
    try {
      await bot.sendMessage(payload.id, `✅ **এই গ্রুপটি Approve করা হয়েছে!**\n\nএখন থেকে /help /info সব কমান্ড কাজ করবে।`, { parse_mode: 'Markdown' });
    } catch {}
    await response.answerCallback(callbackQuery, { text: "Approved!" });
  }

  if (payload.a === 'off') {
    await setGroup(payload.id, { approved: false });
    await response.edit('text', messageId, `❌ Group \`${payload.id}\` Unapproved!`, { reply_markup: { inline_keyboard: [] } });
    try {
      await bot.sendMessage(payload.id, `❌ **এই গ্রুপের Approve বন্ধ করা হয়েছে।**\nবট আর কাজ করবে না।`, { parse_mode: 'Markdown' });
    } catch {}
    await response.answerCallback(callbackQuery, { text: "Unapproved!" });
  }

  if (payload.a === 'list') {
    const groups = await getAllGroups();
    const buttons = groups.map(g => [{ text: `${g.name.slice(0, 22)} ${g.approved? "✅ ON" : "❌ OFF"}`, callback_data: JSON.stringify({ command: "apv", a: "view", id: g.chatId }) }]);
    await response.edit('text', messageId, `📋 Total Groups: ${groups.length}\nDB: RezeApprovalSystem`, { reply_markup: { inline_keyboard: buttons } });
    await response.answerCallback(callbackQuery);
  }
                     }
