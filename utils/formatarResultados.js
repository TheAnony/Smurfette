const pb = {
    le: '<:_le:1160631204467462247>',
    me: '<:_me:1160631258171330701>',
    re: '<:_re:1160631319303307475>',
    lf: '<:_lf:1160631406544830525>',
    mf: '<:_mf:1160631445707034724>',
    rf: '<:_rf:1160631483875213434>'
}

function formatarResultados(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes * progressBarLength)) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;

    if(!filledSquares && !emptySquares) {
        emptySquares = progressBarLength;
    }

    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;

    const progressBar = 
        (filledSquares ? pb.lf : pb.le) +
        (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
        (filledSquares === progressBarLength ? pb.rf : pb.re);

    let results = []
    results.push(`👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${downvotes.length} downvotes (${downPercentage.toFixed(1)}%)`);
    results.push(progressBar)

    return results.join('\n')
}

module.exports = { formatarResultados };