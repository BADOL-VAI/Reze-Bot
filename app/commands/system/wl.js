export const meta = {
  name: "wl",
  version: "1.0.0",
  aliases: ["adminonly", "whitelist", "onlyadmin"],
  description: "Whitelist mode - only admin can use bot",
  author: "MOHAMMAD BADOL",
  category: "system",
  type: "developer",
  cooldown: 3,
  guide: ["on", "off"]
};

export async function onStart({ args, response }) {
  const { setGlobal, getGlobal } = await import('../../../core/database/approval/store.js');

  if (!args[0]) {
    const status = await getGlobal('whitelist');
    return response.reply(
      `🛡️ **Whitelist System**\n\n` +
      `Status: ${status? "✅ ON - Only Admin" : "❌ OFF - Everyone"}\n` +
      `DB: RezeApprovalSystem\n\n` +
      `💡 Use:\n/wl on\n/wl off`
    );
  }

  const on = args[0].toLowerCase() === 'on';
  await setGlobal('whitelist', on);
  await response.reply(`✅ Whitelist is now **${on? "ON - শুধু Admin পারবে" : "OFF - সবাই পারবে"}**\nSaved in Separate DB`);
}
