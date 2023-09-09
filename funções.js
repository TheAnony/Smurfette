function pegarDataNow() {
    const date = new Date();
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const mes = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()
    const ano = date.getFullYear();
    const hora = date.getHours();
    const minuto = date.getMinutes();

    return `${dia}/${mes}/${ano}, às ${hora}h${minuto}min.`
}

module.exports = { pegarDataNow };