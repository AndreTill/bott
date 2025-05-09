import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import * as fs from 'fs';
import * as path from 'path';

const bot = new Telegraf("2019283473:AAGD0ToEHPfc5R1sghPZmQEo9xz39Sa6j8I")

function getFilesInDirectory(directoryPath: string): string[] {
    try {
        // Read the contents of the directory
        const files = fs.readdirSync(directoryPath);

        // Filter out directories and return only files
        return files.filter(file => {
            const filePath = path.join(directoryPath, file);
            return fs.statSync(filePath).isFile();
        });
    } catch (error) {
        console.error(`Error reading directory: ${directoryPath}`, error);
        return [];
    }
}

const directoryPath = './img';
const files = getFilesInDirectory(directoryPath);

const filespath = files.map(item => `./img/${item}`)

console.log(...filespath)

let medias = filespath



bot.command('photos', async (ctx) => {
    ctx.replyWithMediaGroup(
        medias.map((media) => {
            return {
                type: 'photo',
                media: { source: media }
            }
        })
    )
}) 

bot.command('videos', async (ctx) => {
    ctx.replyWithMediaGroup(
        medias.map((media) => {
            return {
                type: 'photo',
                media: { source: media }
            }
        })
    )
}) 

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id)

  // Using context shortcut
  await ctx.leaveChat()
})

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`)
})

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

  // Using context shortcut
  await ctx.answerCbQuery()
})

bot.on('inline_query', async (ctx) => {
  const result = []
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

  // Using context shortcut
  await ctx.answerInlineQuery(result)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))