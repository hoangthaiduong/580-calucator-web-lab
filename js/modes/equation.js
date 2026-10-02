(function(global){
  function solve(text,state){
    try{
      const parts=String(text).split('=');if(parts.length!==2)throw new global.CalcError('Argument ERROR');const L=global.Tokenizer.tokenizeInput(parts[0]),R=global.Tokenizer.tokenizeInput(parts[1]);const old=state.variables.X;
      const f=x=>{state.variables.X=x;return global.Evaluator.num(global.Evaluator.sub(global.Evaluator.evaluateTokens(L,state),global.Evaluator.evaluateTokens(R,state)))};
      const f0=f(0),f1=f(1),f2=f(2);state.variables.X=old;
      const a=(f2-2*f1+f0)/2,b=f1-f0-a,c=f0;
      if(Math.abs(a)<1e-10){if(Math.abs(b)<1e-10)return Math.abs(c)<1e-10?'All X satisfy':'No solution';return `x = ${global.Formatter.formatNumber(-c/b)}`}
      const D=b*b-4*a*c;if(D<0)return state.currentMode==='CMPLX'?`x₁ = ${global.Formatter.formatNumber(-b/(2*a))} + ${global.Formatter.formatNumber(Math.sqrt(-D)/(2*a))}i\nx₂ = ${global.Formatter.formatNumber(-b/(2*a))} − ${global.Formatter.formatNumber(Math.sqrt(-D)/(2*a))}i`:'No real solution';return `x₁ = ${global.Formatter.formatNumber((-b+Math.sqrt(D))/(2*a))}\nx₂ = ${global.Formatter.formatNumber((-b-Math.sqrt(D))/(2*a))}`;
    }catch(e){return e.message}
  }
  global.EquationMode={solve};
})(window);
