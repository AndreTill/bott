"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var filters_1 = require("telegraf/filters");
var fs = require("fs");
var path = require("path");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var vk_io_1 = require("vk-io");
var bot = new telegraf_1.Telegraf("2019283473:AAFe_aV5VeqD27P34rqcwnboEF5hrtrZa9o");
var vk = new vk_io_1.VK({
    token: '1e37ff6c1e37ff6c1e37ff6c581d02b49311e371e37ff6c7668fda8eaea121ef85f9fd9',
    apiMode: 'sequential',
    apiVersion: '5.199',
    language: 'ru'
});
function resolve_dev(input) {
    var ret = "Unknown";
    switch (input) {
        case 1:
            ret = 'Mobile website';
            break;
        case 2:
            ret = "iPhone";
            break;
        case 3:
            ret = "iPad";
            break;
        case 4:
            ret = "Android";
            break;
        case 7:
            ret = "Website on PC";
            break;
    }
    return ret;
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = "";
                    return [4 /*yield*/, vk.api.users.get({
                            user_ids: ['katya_bach'],
                            fields: ['online', 'online_info', 'last_seen', 'followers_count', 'counters', 'contacts']
                        }).then(function (response) {
                            if (response.length === 0) {
                                console.error('No user found');
                                return [];
                            }
                            // Assuming response is an array with at least one user object
                            console.log('User data:', response[0]);
                            res += "   [ ::: VK ::: " + response[0]['first_name'] + ' ' + response[0]['last_name'] + "](https://vk.com/id" + response[0]['id'] + ") с " + resolve_dev(response[0]["last_seen"]['platform']) + " ";
                            res += "\n   ".concat(response[0]['online'] ? 'Online' : 'Offline', " ");
                            res += "\n   ".concat((0, date_fns_1.format)(new Date(response[0].last_seen.time * 1000), 'dd MMMM yyyy в HH:mm', { locale: locale_1.ru }), " ");
                            res += "\n   ".concat(response[0]['followers_count'] - response[0]['counters']['followers'], " \u0434\u0440\u0443\u0437\u0435\u0439 ");
                            res += "\n   ".concat(response[0]['counters']['pages'], " \u0433\u0440\u0443\u043F\u043F ");
                            res += "\n   ".concat(response[0]['counters']['followers'], " \u043F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u043E\u0432 ");
                            res += "\n   ".concat(response[0]['counters']['subscriptions'], " \u043F\u043E\u0434\u043F\u0438\u0441\u043E\u043A ");
                            res += "\n   ".concat(response[0]['counters']['photos'], " \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0439 ");
                            res += "\n   ".concat(response[0]['counters']['videos'], " \u0432\u0438\u0434\u0435\u043E ");
                        }).catch(function (err) {
                            console.error('Error fetching user data:', err);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
;
function getFilesInDirectory(directoryPath) {
    try {
        // Read the contents of the directory
        var files_1 = fs.readdirSync(directoryPath);
        // Filter out directories and return only files
        return files_1.filter(function (file) {
            var filePath = path.join(directoryPath, file);
            return (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.JPG') || filePath.endsWith('.PNG')) && fs.statSync(filePath).isFile();
        });
    }
    catch (error) {
        console.error("Error reading directory: ".concat(directoryPath), error);
        return [];
    }
}
var directoryPath = './img';
var files = getFilesInDirectory(directoryPath);
var filespath = files.map(function (item) { return "./img/".concat(item); });
console.log.apply(console, filespath);
var medias = filespath;
var step = 0;
bot.command('status', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run()];
            case 1:
                res = _a.sent();
                ctx.replyWithMarkdownV2(res, {
                    parse_mode: 'Markdown'
                });
                return [2 /*return*/];
        }
    });
}); });
bot.command('photos', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var fls, i;
    return __generator(this, function (_a) {
        fls = [];
        for (i = 1; i < 11; i += 1) {
            fls.push(medias[step + i]);
            step += 10;
            if (step >= medias.length) {
                step = 0; // Reset step if it exceeds the length of medias
            }
        }
        ctx.sendMediaGroup(fls.map(function (media) {
            return {
                type: 'photo',
                media: { source: media }
            };
        })).finally(function () {
            ctx.reply('/photos for more');
        }).catch(function (error) {
            console.error('Error sending photos:', error);
            ctx.reply('Failed to send photos. Please try again later.');
        });
        return [2 /*return*/];
    });
}); });
bot.command('videos', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.replyWithMediaGroup(medias.map(function (media) {
            return {
                type: 'photo',
                media: { source: media }
            };
        }));
        return [2 /*return*/];
    });
}); });
bot.on((0, filters_1.message)('text'), function (ctx) {
    ctx.reply('Hello! I am a bot. Send /status to get status or /photos to get photos or /videos to get videos.');
});
bot.launch({
    dropPendingUpdates: true,
    allowedUpdates: ['message', 'edited_message', 'channel_post', 'edited_channel_post', 'inline_query', 'chosen_inline_result', 'callback_query', 'shipping_query', 'pre_checkout_query', 'poll', 'poll_answer']
}).then(function () {
    console.log('Bot started');
}).catch(function (error) {
    console.error('Error starting bot:', error);
});
// Enable graceful stop
process.once('SIGINT', function () { return bot.stop('SIGINT'); });
process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
