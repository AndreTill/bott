import { Bot } from 'gramio'
import { mediaGroup } from '@gramio/media-group'
import { autoRetry } from '@gramio/auto-retry'
import { mediaCache } from '@gramio/media-cache'
import { session } from '@gramio/session'
import { prompt } from '@gramio/prompt'
import { autoload } from '@gramio/autoload'
import { Bot, MediaInput, MediaUpload, InlineKeyboard } from "gramio";
import * as fs from 'fs';
import * as path from 'path';

let i = 0

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

let medias = filespath.map((item) => 
  MediaInput.document(MediaUpload.path(item))
);

const bot = new Bot("2019283473:AAENlInr0R01Bnr_af1i585yPPQgNpdy5E8")
  .extend(mediaGroup())
  .extend(autoRetry())
  .extend(mediaCache())
  .extend(session())
  .extend(prompt())
  .extend(autoload({
      failGlob: false
  }))
//    .on("message", context => 
//	context.sendDocument(MediaUpload.path("./img/" + files[i])) && i == files.length - 1 ?  i = 0 : i++ 
//    )
.command('photos', context => context.sendMediaGroup(medias))
.command('videos', context => context.sendMediaGroup(medias))
.command('start', context => context.send('Hi!'))
  .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))


bot.start()
