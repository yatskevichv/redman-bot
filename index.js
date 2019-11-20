let telegramBot = require('node-telegram-bot-api');
let log = require('./utils/loger')(module);
let weather = require('./weather/weather');

const token = '959089913:AAHl7Yjpi1XM5sxzJElqJgxe_P3c6d809n8';
let bot = new telegramBot(token, { polling: true });
let notes = [];
let listUser = [536555510, 572674379, 664304748, 467842120]

//467842120 Ilya

bot.onText(/\/напомни (.+) в (.+)/, function(msg, match) {
    var userId = msg.from.id;
    var text = match[1];
    var time = match[2];

    log.debug(`Remind command, userId: ${userId}, text: ${text}, time: ${time}`);
    log.debug(`Remind command, userId: ${userId}, text: ${text}, time: ${time}`);

    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)').catch((error) => {
        log.debug(`sendMessage error: ${error}`);
        log.debug(`sendMessage error: ${error.response.body}`);
    });
});

setInterval(function() {

    const timeForWeather = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    const curTime = new Date().getHours() + ':' + new Date().getMinutes();

    if (timeForWeather === '6:50:0') {
        weather.reInitWeather();

        setTimeout(() => {

            if (!weather.isWeatherInit())
                weather.reInitWeather();

        }, weather.isWeatherInit() ? 0 : 5000);
    }

    if (timeForWeather === '7:0:0') {

        log.debug(`sendMessage weather: ${weather.gitInfo()}`);

        listUser.forEach((value) => {
            bot.sendMessage(value, weather.gitInfo()).catch((error) => {
                log.debug(`sendMessage error: ${error}`);
                log.debug(`sendMessage error: ${error.response.body}`);
            });
        });
    }

    for (var i = 0; i < notes.length; i++) {
        const curDate = new Date().getMonth() + ':' + new Date().getDay() + ':' + new Date().getHours() + ':' + new Date().getMinutes();
        if (notes[i]['time'] === curDate || notes[i]['time'] === curTime) {
            let text = notes[i]['text'];
            log.debug(`Напоминание отправлено! текст: ${text}`);
            bot.sendMessage(text.toLowerCase().includes("илья") ? 467842120 : notes[i]['uid'], 'Напоминаю, что вы должны: ' + text + ' сейчас.');
            notes.splice(i, 1);
        }
    }
}, 1000);

bot.on('message', (msg) => {
    log.debug(`get message: ${msg.text}, userId : ${msg.from.id}, name: ${msg.from.first_name}`);
});

bot.onText(/\/start/, function(msg, match) {
    var userId = msg.from.id;
    var name = msg.from.first_name;

    log.debug(`start bot: ${userId}`);

    if (listUser.includes(userId))
        return;

    listUser.push(userId);

    bot.sendMessage(userId, `Привет кент ${name}. Буду слать тебе погоду каждый день.\n В 7 часов утра. На два дня.`).catch((error) => {
        log.debug(`sendMessage error: ${error}`);
        log.debug(`sendMessage error: ${error.response.body}`);
    });
});

bot.on("polling_error", (err) => log.error(err));