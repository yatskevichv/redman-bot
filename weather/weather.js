let weather = require('openweather-apis');
let log = require('../utils/loger')(module);
let mapWeather = new Map();

class Weather {

    constructor() {
        this.isInit = false;
    }

    reInitWeather() {
        this.isInit = false;
        LoadWeather();
    }

    dataTextToKey(dt_txt) {
        let dataText = dt_txt;

        let subDataText = dataText.split(' ');

        return {
            keyData: `${subDataText[0]}`,
            keyTime: `${subDataText[1]}`
        }
    }

    parseJsonWeather(jsObject) {

        let keyData = '';
        let keyTime = '';
        let keyMap = this.dataTextToKey(jsObject.dt_txt);

        keyData = keyMap.keyData;
        keyTime = keyMap.keyTime;

        let hour = keyTime.split(':')[0];

        if (hour === "12" || hour === "21") {
            let jsWeatherObject = this.getWeatherObject(jsObject);

            if (mapWeather.has(keyData)) {
                let tmpMap = mapWeather.get(keyData).set(keyTime, jsWeatherObject);

            } else {
                let tmpMap = new Map();
                tmpMap.set(keyTime, jsWeatherObject);
                mapWeather.set(keyData, tmpMap);
            }
        }
    }

    getWeatherObject(jsObject) {
        let weather = new Weather();

        weather.tempMax = jsObject.main.temp_max;
        weather.tempMin = jsObject.main.temp_min;
        weather.description = jsObject.weather[0].description

        return weather;
    }

    initWeather(jsObject) {
        mapWeather.clear();
        jsObject.list.forEach((item) => {
            this.parseJsonWeather(item);
        });

        this.isInit = true;
    }

    isWeatherInit() { return this.isInit; }

    gitInfo() {
        if (!this.isInit)
            return '';

        let info = 'Прогноз погоды на 2 дня \n\n'
        let count = 0;
        //hui
        mapWeather.forEach((vMap, kMap, map) => {

            if (count === 2)
                return;

            count += 1;

            info += `${kMap}\n`;

            vMap.forEach((value, kMap, map) => {
                info += `Время: ${kMap}\n`;
                info += ` ${value.description}\n`
                info += `Max t*: ${value.tempMax}\n`;
                info += `Min t*: ${value.tempMin}\n\n`;
            });
            info += "\n";
        });
        return info;
    }
}


let myWeather = new Weather();

function LoadWeather() {
    weather.getWeatherForecast(function(err, jsObject) {
        log.debug(`getAllWeather ${JSON.stringify(jsObject)}`);
        myWeather.initWeather(jsObject);
        myWeather.gitInfo();
    });
}


LoadWeather();

module.exports = myWeather;