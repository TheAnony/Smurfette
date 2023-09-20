const ms = require('ms');

function pegarDataNow() {
        const date = new Date();
        const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
        const ano = date.getFullYear();
        const hora = date.getHours();
        const minuto = date.getMinutes();

        return `${dia}/${mes}/${ano}, às ${hora}h${minuto}min.`
}

function convertTimeStringToList(timeString) {
        var pattern = /(\d+)([a-z]+)/g;
        var matches = timeString.match(pattern)
        var timeUnits = [];
        for (let i = 0; i < matches.length; i++) {
                var match = matches[i].match(/(\d+)([a-z]+)/);
                timeUnits.push(match[1]);  // Quantity
                timeUnits.push(match[2]);  // Unit
        }
        return timeUnits;
}

function StringToMilliseonds(timeString) {
        const millisecondsInYear = 31_536_000_000;
        const millisecondsInMonth = 2_628_000_000;
        const millisecondsInDay = 86_400_000;
        const millisecondsInHour = 3_600_000;
        const millisecondsInMinute = 60_000;
        const millisecondsInSecond = 1_000;
        let timeUnits = timeString.toLowerCase().trim().split(/ +/g)
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        let ElementsFilter = [];

        timeUnits.forEach(item => {
                let resul = regex.test(item)
                if (resul) {
                        timeUnits.push(convertTimeStringToList(item))
                        ElementsFilter.push(item)
                }
        });
        timeUnits = timeUnits.flat();
        timeUnits = timeUnits.filter(item => !ElementsFilter.includes(item))

        let totalMilliseconds = 0;

        for (let i = 0; i < timeUnits.length; i += 2) {
                const unit = timeUnits[i + 1];
                switch (unit) {
                        case 'years':
                        case 'anos':
                        case 'year':
                        case 'ano':
                        case 'y':
                                totalMilliseconds += parseInt(timeUnits[i]) * millisecondsInYear;
                                break;
                        case 'months':
                        case 'meses':
                        case 'month':
                        case 'mês':
                        case 'm':
                                totalMilliseconds += parseInt(timeUnits[i]) * millisecondsInMonth;
                                break;
                        case 'days':
                        case 'dias':
                        case 'day':
                        case 'dia':
                        case 'd':
                                totalMilliseconds += parseInt(timeUnits[i]) * millisecondsInDay;
                                break;
                        case 'hours':
                        case 'horas':
                        case 'hour':
                        case 'hrs':
                        case 'hora':
                        case 'hr':
                        case 'h':
                                totalMilliseconds += parseInt(timeUnits[i]) * millisecondsInHour;
                                break;
                        case 'minutes':
                        case 'minutos':
                        case 'minute':
                        case 'minuto':
                        case 'min':
                        case 'mnt':
                                totalMilliseconds += parseInt(timeUnits[i]) * millisecondsInMinute;
                                break;
                        case 'seconds':
                        case 'segundos':
                        case 'sgs':
                        case 'second':
                        case 'segundo':
                        case 's':
                        case 'sg':
                                totalMilliseconds += parseInt(timeUnits[i]) * millisecondsInSecond;
                                break;
                        default:
                         totalMilliseconds = 'err'
                }
        }
        return totalMilliseconds;
}

function millisecondsToString(timeMil) {

}

module.exports = { pegarDataNow, StringToMilliseonds };
