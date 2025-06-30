import { Telegraf } from 'telegraf'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { message } from 'telegraf/filters'

import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { VK } from 'vk-io';
import { response } from 'express';
const bot = new Telegraf("2019283473:AAFe_aV5VeqD27P34rqcwnboEF5hrtrZa9o");

const vk = new VK({
    token: '1e37ff6c1e37ff6c1e37ff6c581d02b49311e371e37ff6c7668fda8eaea121ef85f9fd9',
    apiMode: 'sequential',
    apiVersion: '5.199',
    language: 'ru'
});

function resolve_dev(input: any): string {
    var ret = "Unknown"
    switch (input) {
        case 1:
            ret = 'Mobile website'
            break
        case 2:
            ret = "iPhone"
            break
        case 3:
            ret = "iPad"
            break
        case 4:
            ret = "Android"
            break
        case 7:
            ret = "Website on PC"
            break
    }
    return ret
}

async function run(): Promise<string> {
    var res = ""
    await vk.api.users.get({
        user_ids: [ 'katya_bach' ],
        fields: [ 'online' , 'online_info', 'last_seen' ]
    }).then((response) => {
    if (response.length === 0) {
        console.error('No user found');
        return [];
    }
    // Assuming response is an array with at least one user object
    console.log('User data:', response[0]);
    res += "   [ ::: VK ::: " + response[0]['first_name'] + ' ' + response[0]['last_name'] + "](https://vk.com/id" + response[0]['id'] + ") с " + resolve_dev(response[0]["last_seen"]['platform']) + " ";
    res += `\n   ${format(new Date(response[0]['last_seen'].time * 1000), 'dd MM yyyy в HH:mm')}`;
    res += `\n   ${response[0]['online'] ? 'Online' : format(new Date(response[0].last_seen.time * 1000), 'dd MMMM yyyy в HH:mm', { locale: ru })} `;
    }).catch((err) => {
        console.error('Error fetching user data:', err);
    });
    
     return res
};



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

const medias = filespath

bot.command('status', async (ctx) => {
    var res = await run();

    ctx.reply(res, {
        parse_mode: 'Markdown'
    });
})


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