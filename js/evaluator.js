(function(global){
  class CalcError extends Error{constructor(message){super(message);this.name='CalcError'}}
  global.CalcError=CalcError;
  function complex(re,im=0){return {__complex:true,re,im}}
  function isComplex(v){return !!(v&&v.__complex)}
  function imag(v){return isComplex(v)?v.im:0}
  function num(v){if(typeof v==='number')return v;if(isComplex(v))return v.re;if(v&&v.__fraction)return v.n/v.d;throw new CalcError('Argument ERROR')}
  function toRadians(x,state){return state.angleMode==='DEG'?x*Math.PI/180:x}
  function fromRadians(x,state){return state.angleMode==='DEG'?x*180/Math.PI:x}
  function add(a,b){return isComplex(a)||isComplex(b)?complex(num(a)+num(b),imag(a)+imag(b)):a+b}
  function sub(a,b){return isComplex(a)||isComplex(b)?complex(num(a)-num(b),imag(a)-imag(b)):a-b}
  function mul(a,b){if(isComplex(a)||isComplex(b)){const ar=num(a),ai=imag(a),br=num(b),bi=imag(b);return complex(ar*br-ai*bi,ar*bi+ai*br)}return a*b}
  function div(a,b){if(isComplex(a)||isComplex(b)){const ar=num(a),ai=imag(a),br=num(b),bi=imag(b),den=br*br+bi*bi;if(den===0)throw new CalcError('Math ERROR');return complex((ar*br+ai*bi)/den,(ai*br-ar*bi)/den)}if(b===0)throw new CalcError('Math ERROR');return a/b}
  function complexPow(a,b){const A=isComplex(a)?a:complex(a),B=isComplex(b)?b:complex(b);const r=Math.hypot(A.re,A.im);if(r===0)throw new CalcError('Math ERROR');const th=Math.atan2(A.im,A.re),lnR=Math.log(r);const x=B.re*lnR-B.im*th,y=B.re*th+B.im*lnR,er=Math.exp(x);return complex(er*Math.cos(y),er*Math.sin(y))}
  function pow(a,b){if(isComplex(a)||isComplex(b))return complexPow(a,b);if(a<0&&Math.abs(b-Math.round(b))>1e-12){if(global.CalcState.state.currentMode==='CMPLX')return complexPow(complex(a),complex(b));throw new CalcError('Domain ERROR')}return Math.pow(a,b)}
  function factorial(v){if(isComplex(v)||!Number.isFinite(v)||v<0||Math.abs(v-Math.round(v))>1e-12)throw new CalcError('Domain ERROR');const n=Math.round(v);if(n>170)throw new CalcError('Range ERROR');let r=1;for(let i=2;i<=n;i++)r*=i;return r}
  function functionValue(name,args,state){
    if(name==='random')return Math.random();
    if(args.length!==1)throw new CalcError('Argument ERROR');const x=args[0],n=num(x);
    switch(name){
      case 'sin':return Math.sin(toRadians(n,state));case 'cos':return Math.cos(toRadians(n,state));case 'tan':{const r=toRadians(n,state);if(Math.abs(Math.cos(r))<1e-12)throw new CalcError('Math ERROR');return Math.tan(r)}
      case 'asin':if(n<-1||n>1)throw new CalcError('Domain ERROR');return fromRadians(Math.asin(n),state);case 'acos':if(n<-1||n>1)throw new CalcError('Domain ERROR');return fromRadians(Math.acos(n),state);case 'atan':return fromRadians(Math.atan(n),state)
      case 'ln':if(n<=0)throw new CalcError('Domain ERROR');return Math.log(n);case 'log':if(n<=0)throw new CalcError('Domain ERROR');return Math.log10(n)
      case 'sqrt':if(n>=0)return Math.sqrt(n);if(state.currentMode==='CMPLX')return complex(0,Math.sqrt(-n));throw new CalcError('Domain ERROR')
      case 'abs':return isComplex(x)?Math.hypot(x.re,x.im):Math.abs(n);case 'factorial':return factorial(n);case 'exp':return Math.exp(n);case 'floor':return Math.floor(n);case 'ceil':return Math.ceil(n);default:throw new CalcError('Argument ERROR');
    }
  }
  function resolveConstant(name,state){if(name==='pi')return Math.PI;if(name==='e')return Math.E;if(name==='Ans')return state.lastAnswer;return state.variables[name]??0}
  function normalizeParens(tokens){const out=global.Tokenizer.cloneTokens(tokens);let bal=0;for(const t of out){if(global.Tokenizer.isOpen(t))bal++;if(global.Tokenizer.isClose(t)){bal--;if(bal<0)throw new CalcError('Syntax ERROR')}}while(bal>0){out.push(global.Tokenizer.token('paren',')'));bal--}return out}
  function splitStatements(tokens){const result=[];let current=[],depth=0;for(const t of tokens){if(t.type==='paren'&&t.value==='(')depth++;if(t.type==='paren'&&t.value===')')depth--;if(t.type==='operator'&&t.value===':'&&depth===0){if(!current.length)throw new CalcError('Syntax ERROR');result.push(current);current=[]}else current.push(t)}if(current.length)result.push(current);return result}
  function evaluateTokens(tokens,state){
    const normalized=normalizeParens(tokens);if(!normalized.length)throw new CalcError('Syntax ERROR');
    const statements=splitStatements(normalized);let value=null;for(const statement of statements){value=global.Parser.parseTokens(statement,{resolveConstant:n=>resolveConstant(n,state),functionValue:(n,a)=>functionValue(n,a,state),factorial,mul,applyOperator:(op,a,b)=>op==='+'?add(a,b):op==='-'?sub(a,b):op==='*'?mul(a,b):op==='/'?div(a,b):op==='%'?mul(a,0.01):op==='^'?pow(a,b):0});}return value;
  }
  global.Evaluator={complex,isComplex,imag,num,toRadians,fromRadians,add,sub,mul,div,pow,factorial,functionValue,evaluateTokens,normalizeParens};
})(window);
