export const meta = {
  name: "inbox",
  version: "1.0.0",
  aliases: ["ib"],
  description: "Control inbox on/off - separate DB",
  author: "MOHAMMAD BADOL",
  category: "system",
  type: "developer",
  cooldown: 3,
  guide: ["on", "off"]
};

export async function onStart({ args, response }) {
  const { setGlobal, getGlobal } = await import('../../../core/database/approval/store.js');

  if (!args[0]) {
    const status = await getGlobal('inbox');
    return response.reply(
      `📥 **Inbox System**\n\n` +
      `Status: ${status? "✅ ON" : "❌ OFF"}\n` +
      `DB: RezeApprovalSystem\n\n` +
      `💡 Use:\n/inbox on\n/inbox off`
    );
  }

  const on = args[0].toLowerCase() === 'on';
  await setGlobal('inbox', on);
  await response.reply(`✅ Inbox is now **${on? "ON" : "OFF"}**\nSaved in Separate MongoDB (RezeApprovalSystem)`);
}
