(function(global){
  function generate(expr,start,end,step,state){try{if(!Number.isFinite(start)||!Number.isFinite(end)||!Number.isFinite(step)||step===0||Math.abs((end-start)/step)>1000)return 'Argument ERROR';const old=state.variables.X;const toks=global.Tokenizer.tokenizeInput(expr);const out=[];for(let x=start,guard=0;guard<2000&&((step>0&&x<=end+1e-12)||(step<0&&x>=end-1e-12));x+=step,guard++){state.variables.X=x;const v=global.Evaluator.evaluateTokens(toks,state);out.push(`${global.Formatter.formatNumber(x).padStart(9)}  |  ${global.Formatter.formatNumber(v)}`)}state.variables.X=old;return out.join('\n')}catch(e){return e.message}}
  global.TableMode={generate};
})(window);
