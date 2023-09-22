function arrayGetAbrev(array) {
        let ElementsFilter = [];
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

        array.forEach(item => {
                let resul = regex.test(item)
                if (resul) {
                        array.push(convertTimeStringToList(item))
                        ElementsFilter.push(item)
                }
        });
        array = array.flat();
        array = array.filter(item => !ElementsFilter.includes(item))
        return array
}

function getSorteioClaim(str) {
                str = str.toLowerCase().trim().replace(/\s+/g, " ")
                let time1 = str.match(/sorteio: (.*?) claim/)[1];
                let time2 = str.match(/claim: (.*)/)[1];
                let sorteio = time1.split(' ')
                let claim = time2.split(' ')
                sorteio = arrayGetAbrev(sorteio);
                claim = arrayGetAbrev(claim)
                return {
                        sorteio, claim
                }
}

function pegarDataNow() {
        const date = new Date();
        const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
        const ano = date.getFullYear();
        const hora = date.getHours();
        const minuto = date.getMinutes();

        return `${dia}/${mes}/${ano}, às ${hora}h${minuto}min`
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

function stringMS(timeString) {
        const millisecondsInYear = 31_536_000_000;
        const millisecondsInMonth = 2_628_000_000;
        const millisecondsInDay = 86_400_000;
        const millisecondsInHour = 3_600_000;
        const millisecondsInMinute = 60_000;
        const millisecondsInSecond = 1_000;
        let timeUnits;

        typeof timeString === 'object' ? timeUnits = timeString : timeUnits = timeString.toLowerCase().trim().split(/ +/g);
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

function formatTime(milliseconds) {
        const timeUnits = {
                'ano': 31_536_000_000,
                'mês': 2_628_000_000,
                'dia': 86_400_000,
                'hora': 3_600_000,
                'minuto': 60000,
                'segundo': 1000
        };
        let formattedTime = "";
        for (unit in timeUnits) {
                if (milliseconds >= timeUnits[unit]) {
                        const count = Math.floor(milliseconds / timeUnits[unit]);
                        formattedTime += `${count} ${unit}${count > 1 ? "s" : ""} `;
                        milliseconds %= timeUnits[unit];
                }
        }
        formattedTime.includes('mêss') ? formattedTime = formattedTime.replace('mêss', 'meses') : null
        return formattedTime.trim();
}

module.exports = { pegarDataNow, stringMS, formatTime, convertTimeStringToList, getSorteioClaim };
