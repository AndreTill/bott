import { Bot } from 'gramio'
import { mediaGroup } from '@gramio/media-group'
import { autoRetry } from '@gramio/auto-retry'
import { mediaCache } from '@gramio/media-cache'
import { session } from '@gramio/session'
import { prompt } from '@gramio/prompt'
import { autoload } from '@gramio/autoload'

const bot = new Bot("6361427643:AAH67cFhOh-iMRcmc21YPYMEZeXtYwjZHIA")
  .extend(mediaGroup())
  .extend(autoRetry())
  .extend(mediaCache())
  .extend(session())
  .extend(prompt())
  .extend(autoload({
      failGlob: false
  }))
    .on("message", (context) =>
        PhotoAttachment().
        console.log(context.attachment.bigSize.fileId)
    )
  .command('start', context => context.send('Hi!'))
  .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))


bot.start()
