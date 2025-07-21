
import { Telegraf } from 'telegraf'
import { Database, sqlite3 } from 'sqlite3';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { message } from 'telegraf/filters'

import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { VK } from 'vk-io';
import { runInContext } from 'vm';

var debug_mode = false;

var db: Database = new Database('./db/bot.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

    const sql = `CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
    friends INTEGER DEFAULT 0,
    groups INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    subscriptions INTEGER DEFAULT 0,
    photos INTEGER DEFAULT 0,
    videos INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;    

 

db.serialize(() => {
    var res = "";
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
        if (err) {
            console.error('Error fetching table names:', err.message);
        } else {
            if (rows.length === 0) {
                console.log('No tables found in the database. Creating users table...');
                db.run(sql, (err) => {
                    if (err) {
                        console.error('Error creating users table:', err.message);
                    } else {
                        console.log('Users table created successfully.');
                    }
                });
            } else {
                console.log('Tables already exist in the database.');
                console.log('Tables in the database:', rows.map(row => row.name));
            }
        }

    });
});

const bot = new Telegraf("2019283473:AAFe_aV5VeqD27P34rqcwnboEF5hrtrZa9o");

const vk = new VK({
    token: '08a3b99a08a3b99a08a3b99a9b0b96f265008a308a3b99a60dec3210126ad85e0b936d2',
    apiVersion: '5.199',
    language: 'ru',


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
        fields: [ 'online' , 'online_info', 'last_seen', 'followers_count', 'counters' ]
	 }).then((response) => {      
            res += "   [ ::: VK ::: " + response[0]['first_name'] + ' ' + response[0]['last_name'] + "](https://vk.com/id" + response[0]['id'] + ") с " + resolve_dev(response[0]["last_seen"]['platform']) + " ";
            res += `\n   ${response[0]['online'] ? 'Online' : 'Offline'} `;
            res += `\n   ${format(new Date(response[0].last_seen.time * 1000), 'dd MMMM yyyy в HH:mm',{ locale: ru })} `;

            db.run(`SELECT * FROM users WHERE user_id = ?`, [response[0]['id']], (err, row) => {
                if (row.friends < (response[0]['followers_count'] - response[0]['counters']['followers'])) {
                    res += `\n   ${response[0]['followers_count'] - response[0]['counters']['followers'] - row.friends} новых друзей `;
                }
                if (row.groups < response[0]['counters']['pages']) {
                    res += `\n   ${response[0]['counters']['pages'] - row.groups} новых групп `;
                }
                if (row.followers < response[0]['counters']['followers']) {
                    res += `\n   ${response[0]['counters']['followers'] - row.followers} новых подписчиков `;
                }
                if (row.subscriptions < response[0]['counters']['subscriptions']) {
                    res += `\n   ${response[0]['counters']['subscriptions'] - row.subscriptions} новых подписок `;
                }
                if (row.photos < response[0]['counters']['photos']) {
                    res += `\n   ${response[0]['counters']['photos'] - row.photos} новых фотографий `;
                }       
            })

        db.run(`INSERT OR REPLACE INTO users (user_id, friends, groups, followers, subscriptions, photos, videos, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [response[0]['id'], response[0]['counters']['friends'], response[0]['counters']['pages'], response[0]['counters']['followers'], response[0]['counters']['subscriptions'], response[0]['counters']['photos'], response[0]['counters']['videos'], new Date()],
            (err) => {
                if (err) {
                console.error('Error inserting or updating user data:', err.message);
            } else {
                console.log('User data inserted or updated successfully.');
            }
        }
    );

            console.log('User data:', response[0]);

    })
    return res;
}







function getFilesInDirectory(directoryPath: string): string[] {
    console.log('Directory scan started..');
    try {
        // Read the contents of the directory
        const files = fs.readdirSync(directoryPath);

        // Filter out directories and return only files
        return files.filter(file => {
            const filePath = path.join(directoryPath, file);
            return (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.JPG')  || filePath.endsWith('.PNG')) && fs.statSync(filePath).isFile();
        });
    } catch (error) {
        console.error(`Error reading directory: ${directoryPath}`, error);
        return [];
    }
}

const directoryPath = './img';
const files = getFilesInDirectory(directoryPath);
console.log('Directory ', directoryPath, ' scan finished. Found ', files.length, ' files.');

const filespath = files.map(item => `./img/${item}`)

if (debug_mode) console.log(...filespath)

const medias = filespath

var step = 0;

bot.command('status', async (ctx) => {
 run().then((res) => {
    ctx.replyWithMarkdownV2(
        res);
}).catch((error) => {   
    console.error('Error fetching status:', error);
    ctx.reply('Failed to fetch status. Please try again later.');   
});
});



bot.command('photos', async (ctx) => {
    var fls = [];
        for (let i = 1; i < 11; i += 1) {
            fls.push(medias[step + i]);
            step += 1;
            if (step >= medias.length) {
                step = 0; // Reset step if it exceeds the length of medias
            }
        }
        if (debug_mode) {
            console.log('Files total: ', medias.length);
            console.log('Step value: ', step);
            console.log('Current page: ', Math.floor(step / 10) + 1);
            console.log('Less then 10: ', !((medias.length - step) < 10) ? 'No' : 'Yes, now ' + (medias.length - step) + ' files left');
        }
    ctx.sendMediaGroup(
        fls.map((media) => {
            return {
                type: 'photo',
                media: { source: media }
            }
        })
    ).finally(() => {

        
        if (debug_mode) ctx.sendMessage('Files total: ' + medias.length + '\n' +
            'Step value: ' + step + '\n' +
            'Current page: ' + Math.floor(step / 10 + 1) + '\n' +
            'Less then 10: ' + (!((medias.length - step) < 10) ? 'No' : 'Yes, now ' + (medias.length - step) + ' files left')
        );
        ctx.reply('/photos for more');
    }).catch((error) => {
        console.error('Error sending photos:', error);
        ctx.reply('Failed to send photos. Please try again later.');
    });

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

bot.command('debug', (ctx) => {
    debug_mode = !debug_mode;
    ctx.reply(`Debug mode is now ${debug_mode ? 'enabled' : 'disabled'}.`);
});

bot.on(message('text'), (ctx) => {
    ctx.reply('Hello! I am a bot. Send /status to get status or /photos to get photos or /videos to get videos.')
})

bot.launch({
    dropPendingUpdates: true,
    allowedUpdates: ['message', 'edited_message', 'channel_post', 'edited_channel_post', 'inline_query', 'chosen_inline_result', 'callback_query', 'shipping_query', 'pre_checkout_query', 'poll', 'poll_answer']
}).then(() => {
    console.log('Bot started');
}).catch((error) => {  
    console.error('Error starting bot:', error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
