import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN);

// Your chat ID for notifications (add to .env as NOTIFY_CHAT_ID=your_chat_id)
const NOTIFY_CHAT_ID = process.env.NOTIFY_CHAT_ID;

// Array of fun greeting messages
const funGreetings = [
  "Hey there, cool human! 😎",
  "Yo yo, what's up? ✌️",
  "Hello hello! Fancy meeting you here! 🎩",
  "Greetings, awesome friend! Ready to smile? 🚀",
  "Hi hi! Your digital pal is here to cheer you up! 🤖",
];

// Random response generator
const getRandomResponse = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Function to notify you of user activity
async function notifyOwner(userId, userInfo, action) {
  if (!NOTIFY_CHAT_ID) {
    console.error("Notify chat ID not set in .env!");
    return;
  }
  try {
    // Combine first and last name, handle missing last name
    const fullName = userInfo.first_name + (userInfo.last_name ? " " + userInfo.last_name : "");
    const username = userInfo.username ? `@${userInfo.username}` : "No username";
    const message = `User Activity! 🔔\nUser ID: ${userId}\nFull Name: ${fullName || "Unknown"}\nUsername: ${username}\nAction: ${action}`;
    await bot.api.sendMessage(NOTIFY_CHAT_ID, message);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

// Handle /start command
bot.command("start", async (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.from.first_name || "friend";
  await ctx.reply(
    `
    This Bot is Created by @mr_vorthanakk\n\nWelcome to the Fun Bot! 🤖✨\nHello, ${userName}! I'm your fun bot! 🎉\nUse /fun for a fun greeting!
    `
  );
  await notifyOwner(userId, ctx.from, "Used /start command");
});

// Handle /fun command
bot.command("fun", async (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.from.first_name || "friend";
  await ctx.reply(getRandomResponse(funGreetings));
  await notifyOwner(userId, ctx.from, "Used /fun command");
});

// Handle text messages
bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.from.first_name || "friend";
  const text = ctx.message.text;
  await ctx.reply("Hmm, interesting! Try /fun for a fun greeting! 😄");
  await notifyOwner(userId, ctx.from, `Sent message: "${text}"`);
});

// Error handling
bot.catch((err) => {
  console.error("Bot error:", err);
});

// Start the bot
bot.start();
console.log("Bot is running...");