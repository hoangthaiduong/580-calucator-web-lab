(function(global){
  const FUNCTIONS=new Set(['sin','cos','tan','asin','acos','atan','ln','log','sqrt','abs','factorial','random','exp','floor','ceil']);
  const CONSTANTS=new Set(['pi','e','Ans','A','B','C','D','E','F','X','Y','M']);
  function token(type,value,display=value){return {type,value,display}}
  function cloneTokens(ts){return ts.map(t=>({...t}))}
  function isValueToken(t){return t&&['number','constant','ident'].includes(t.type)}
  function isFunc(t){return t&&t.type==='func'}
  function isOpen(t){return t&&t.type==='paren'&&t.value==='('}
  function isClose(t){return t&&t.type==='paren'&&t.value===')'}
  function needsImplicitMul(a,b){if(!a||!b)return false;const left=isValueToken(a)||isClose(a)||a.type==='postfix';const right=isValueToken(b)||isFunc(b)||isOpen(b);return left&&right}
  function tokenizeInput(src){
    const out=[]; let i=0;
    while(i<src.length){
      const c=src[i]; if(/\s/.test(c)){i++;continue}
      if(/[0-9.]/.test(c)){
        let j=i,dots=0;while(j<src.length&&/[0-9.]/.test(src[j])){if(src[j]==='.')dots++;j++}
        if(dots>1)throw new global.CalcError('Syntax ERROR');
        if(j<src.length&&/[eE]/.test(src[j])){let k=j+1;if(/[+-]/.test(src[k]))k++;const st=k;while(k<src.length&&/\d/.test(src[k]))k++;if(k===st)throw new global.CalcError('Syntax ERROR');j=k}
        out.push(token('number',src.slice(i,j)));i=j;continue;
      }
      if(c==='√'){out.push(token('func','sqrt','√'));i++;continue}
      if(c==='π'){out.push(token('constant','pi','π'));i++;continue}
      if(c==='×'||c==='÷'){out.push(token('operator',c==='×'?'*':'/'));i++;continue}
      if('()+-*/^%,:!'.includes(c)){if(c==='('||c===')')out.push(token('paren',c));else if(c==='!')out.push(token('postfix','!'));else out.push(token('operator',c));i++;continue}
      if(/[A-Za-z_]/.test(c)){
        let j=i+1;while(j<src.length&&/[A-Za-z_]/.test(src[j]))j++;const w=src.slice(i,j);
        if(FUNCTIONS.has(w))out.push(token('func',w,w==='sqrt'?'√':w));
        else if(CONSTANTS.has(w)||w.toLowerCase()==='x')out.push(token('constant',w==='x'?'X':w,w==='x'?'X':w));
        else throw new global.CalcError('Syntax ERROR');
        i=j;continue;
      }
      throw new global.CalcError('Syntax ERROR');
    }
    const withMul=[];for(let k=0;k<out.length;k++){if(k&&needsImplicitMul(out[k-1],out[k]))withMul.push(token('operator','*','×'));withMul.push(out[k])}
    return withMul;
  }
  global.Tokenizer={token,cloneTokens,isValueToken,isFunc,isOpen,isClose,needsImplicitMul,tokenizeInput,FUNCTIONS,CONSTANTS};
})(window);
