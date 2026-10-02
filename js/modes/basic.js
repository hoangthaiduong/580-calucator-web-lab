(function(global){
  function fractionApprox(s){
    const raw=String(s).trim(); if(!raw)return 'Argument ERROR';
    try{
      if(raw.includes('/')){const p=raw.split('/').map(Number);if(p.length!==2||!Number.isFinite(p[0])||!Number.isFinite(p[1])||p[1]===0)return 'Argument ERROR';const g=global.MathLab.gcd(p[0],p[1]);return `${p[0]/g}/${p[1]/g}`}
      const q=global.MathLab.rational(Number(raw)); return `${q.n}/${q.d}`;
    }catch{return 'Argument ERROR'}
  }
  function factor(n){if(!Number.isSafeInteger(n)||n<2)return 'Argument ERROR';const parts=[];let p=2,count=0;while(p*p<=n){while(n%p===0){n/=p;count++}if(count){parts.push(count===1?`${p}`:`${p}^${count}`);count=0}p=(p===2?3:p+2)}if(n>1)parts.push(`${n}`);return parts.join(' × ')}
  function gcdlcm(a,b){if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b))return 'Argument ERROR';return `GCD = ${global.MathLab.gcd(a,b)}\nLCM = ${global.MathLab.lcm(a,b)}`}
  global.BasicMode={fractionApprox,factor,gcdlcm};
})(window);
