
import { Telegraf } from 'telegraf'
import { Database, sqlite3 } from 'sqlite3';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { message } from 'telegraf/filters'

import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { VK } from 'vk-io';

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
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
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
                console.log('User\'s history: ', rows.map(row => {

                res += "   ::: VK ID ::: " + row.user_id;
                res += `\n   ${row.friends} друзей `;
                res += `\n   ${row.groups} групп `;
                res += `\n   ${row.followers} подписчиков `;
                res += `\n   ${row.subscriptions} подписок `;
                res += `\n   ${row.photos} фотографий `;
                res += `\n   ${row.videos} видео `;
                return res;
                }));
            }
        }
    });
});

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
        fields: [ 'online' , 'online_info', 'last_seen', 'followers_count', 'counters' , 'contacts']
    }).then((response) => {
        if (response.length === 0) {
            console.error('No user found');
            return [];
        }
        db.get("SELECT * FROM users WHERE user_id = ?", [response[0].id], (err, row) => {
            if (err) {
                console.error('Error fetching user data from database:', err.message);
                return;
            }
            if (!row) {
                db.run("INSERT INTO users (user_id, friends, groups, followers, subscriptions, photos, videos) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                [response[0].id, 
                response[0].counters.friends,
                response[0].counters.groups,
                response[0].counters.followers,
                response[0].counters.subscriptions,
                response[0].counters.photos,
                response[0].counters.videos], (err) => {
                    if (err) {
                        console.error('Error inserting user data into database:', err.message);
                    } else {
                        console.log('User data inserted into database successfully.');
                    }
                });
            } else {
                db.run("UPDATE users SET friends = ?, groups = ?, followers = ?, subscriptions = ?, photos = ?, videos = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", 
                [response[0].counters.friends,
                response[0].counters.groups,
                response[0].counters.followers,
                response[0].counters.subscriptions,
                response[0].counters.photos,
                response[0].counters.videos,
                response[0].id], (err) => {
                    if (err) {
                        console.error('Error updating user data in database:', err.message);
                    } else {
                        console.log('User data updated in database successfully.');
                    }
                });
            }
        });
    }).finally(() => {
        if (debug_mode) {
            console.log('User data:', response[0]);
            res += "   [ ::: VK ::: " + response[0]['first_name'] + ' ' + response[0]['last_name'] + "](https://vk.com/id" + response[0]['id'] + ") с " + resolve_dev(response[0]["last_seen"]['platform']) + " ";
            res += `\n   ${response[0]['online'] ? 'Online' : 'Offline'} `;
            res += `\n   ${format(new Date(response[0].last_seen.time * 1000), 'dd MMMM yyyy в HH:mm',{ locale: ru })} `;
            res += `\n   ${response[0]['followers_count'] - response[0]['counters']['followers']} друзей `;
            res += `\n   ${response[0]['counters']['pages']} групп `;
            res += `\n   ${response[0]['counters']['followers']} подписчиков `;
            res += `\n   ${response[0]['counters']['subscriptions']} подписок `;
            res += `\n   ${response[0]['counters']['photos']} фотографий `;
            res += `\n   ${response[0]['counters']['videos']} видео `; 
            console.log(res); 
        }
        return res;
    });
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
        ctx.reply(res);
    }).catch((error) => {
        console.error('Error fetching status:', error);
        ctx.reply('Error fetching status');
    });
})


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
