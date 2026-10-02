(function(global){
  const M = {
    clamp(v,a,b){return Math.max(a,Math.min(b,v))},
    almostZero(v,eps=1e-12){return Math.abs(v)<eps},
    gcd(a,b){a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b){const t=a%b;a=b;b=t}return a},
    lcm(a,b){a=Math.trunc(a);b=Math.trunc(b);if(!a||!b)return 0;return Math.abs(a/M.gcd(a,b)*b)},
    rational(x,maxDen=1000000){
      if(!Number.isFinite(x)) throw new Error('Range ERROR');
      const sign=x<0?-1:1; x=Math.abs(x); let h1=1,h2=0,k1=0,k2=1,b=x;
      for(let n=0;n<48;n++){const a=Math.floor(b);const h=a*h1+h2,k=a*k1+k2;h2=h1;h1=h;k2=k1;k1=k;const f=b-a;if(Math.abs(f)<1e-14||k1>maxDen)break;b=1/f}
      return {n:sign*h1,d:k1};
    },
    clean(v,eps=1e-12){return Math.abs(v)<eps?0:v}
  };
  global.MathLab=M;
})(window);
