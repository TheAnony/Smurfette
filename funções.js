function pegarDataNow() {
    const date = new Date();
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
    const ano = date.getFullYear();
    const hora = date.getHours();
    const minuto = date.getMinutes();

    return `${dia}/${mes}/${ano}, às ${hora}h${minuto}min.`
}

function pegarTempoEmMs(tempo) {
    let tempAlterado = tempo.trim().split(/ +/g)
    if (tempAlterado.length !== 2) return `err`
    let tempoS = tempAlterado[0] + tempAlterado[1]
    let time = [];
    let tempo2Digitos = ms(tempoS.slice(0, 3));
    let tempo1Digito = ms(tempoS.slice(0, 2));

    let condição1 = typeof tempo2Digitos === 'number' ? time.push(tempo2Digitos) : typeof tempo1Digito === 'number' ? time.push(tempo1Digito) : 'tempo inválido'

    if (condição1 == 'tempo inválido') return `err`

    return time
}

function pegarTempoCompleto(tempo) {
    const dias = Math.floor(tempo / 86400000)
    const horas = Math.floor(tempo / 3600000) % 24
    const minutos = Math.floor(tempo / 60000) % 60
    const segundos = Math.floor(tempo / 1000) % 60

    return [dias, horas, minutos, segundos]
}

module.exports = { pegarDataNow, pegarTempoEmMs, pegarTempoCompleto };