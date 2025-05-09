import { Telegraf } from 'telegraf'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { message } from 'telegraf/filters'

import * as fs from 'fs';
import * as path from 'path';

import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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

bot.on(message('text'), (ctx) => {
    ctx.reply('Hello! I am a bot. Send /photos to get photos or /videos to get videos.')
})

bot.launch({
    dropPendingUpdates: true,
    allowedUpdates: ['message', 'edited_message', 'channel_post', 'edited_channel_post', 'inline_query', 'chosen_inline_result', 'callback_query', 'shipping_query', 'pre_checkout_query', 'poll', 'poll_answer']
}).then(() => {
    console.log('Bot started');
}).catch((error) => {  
    console.error('Error starting bot:', error);
}
)   

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))