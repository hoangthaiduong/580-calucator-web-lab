(function(global){
  function calculate(input){const a=String(input).trim().split(/[\s,;]+/).filter(Boolean).map(Number);if(!a.length||a.some(v=>!Number.isFinite(v)))return 'Argument ERROR';const n=a.length,sum=a.reduce((p,x)=>p+x,0),mean=sum/n,ss=a.reduce((p,x)=>p+(x-mean)**2,0);const pop=Math.sqrt(ss/n),sample=n>1?Math.sqrt(ss/(n-1)):NaN;return `n = ${n}\nΣx = ${global.Formatter.formatNumber(sum)}\nMean = ${global.Formatter.formatNumber(mean)}\nσ = ${global.Formatter.formatNumber(pop)}\ns = ${Number.isFinite(sample)?global.Formatter.formatNumber(sample):'—'}`}
  global.StatisticsMode={calculate};
})(window);
