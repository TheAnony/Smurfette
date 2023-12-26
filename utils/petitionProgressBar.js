function petitionProgressBar(assinaturasAtuais, metaDeAssinaturas) {
   const pb = {
       leftEmpty: '<:_le:1160631204467462247>',
       middleEmpty: '<:_me:1160631258171330701>',
       rightEmpty: '<:_re:1160631319303307475>',
       leftFull: '<:_lf:1160631406544830525>',
       middleFull: '<:_mf:1160631445707034724>',
       rightFull: '<:_rf:1160631483875213434>'
   }

   const progressBarLength = 14;
   let quadradosPreenchidos = Math.round(assinaturasAtuais * progressBarLength / metaDeAssinaturas) || 0
   
   let progressPorcentagem = (assinaturasAtuais * 100) / metaDeAssinaturas || 0

   function createMiddleEmojis() {
       if (quadradosPreenchidos === progressBarLength) {
           let bar = pb.middleFull.repeat(12)
           return bar;
       }

       if(!quadradosPreenchidos) {
           let bar = pb.middleEmpty.repeat(12);
           return bar;
       }

       let squaresFull = Math.round(assinaturasAtuais * 12 / metaDeAssinaturas)
       let squaresEmpty = 12 - squaresFull || 0

       let bar = (pb.middleFull.repeat(squaresFull)) + (pb.middleEmpty.repeat(squaresEmpty))

       return bar;
   }

   const progressBar = 
   (quadradosPreenchidos ? pb.leftFull : pb.leftEmpty) + 
   (createMiddleEmojis()) + 
   (quadradosPreenchidos === progressBarLength ? pb.rightFull : pb.rightEmpty)

   return progressBar
}

module.exports = { petitionProgressBar };