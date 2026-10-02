(function(global){
  const {isOpen,isClose}=global.Tokenizer;
  const PRECEDENCE={':':1,'+':2,'-':2,'*':3,'/':3,'%':3,'^':4};
  const RIGHT_ASSOC=new Set(['^']);
  function parseTokens(tokens,context={}){
    let i=0;
    function readPrimary(){
      if(i>=tokens.length)throw new global.CalcError('Syntax ERROR');
      const t=tokens[i++];
      if(t.type==='number')return Number(t.value);
      if(t.type==='constant')return context.resolveConstant(t.value);
      if(t.type==='operator'&&(t.value==='+'||t.value==='-')){const v=readPrimary();return t.value==='-'?context.mul(-1,v):v}
      if(t.type==='func'){
        const name=t.value;if(!isOpen(tokens[i]))throw new global.CalcError('Syntax ERROR');i++;
        const args=[];
        if(!isClose(tokens[i])){while(true){args.push(parseExpression(1));if(tokens[i]?.value===','){i++;continue}break}}
        if(!isClose(tokens[i]))throw new global.CalcError('Syntax ERROR');i++;
        return context.functionValue(name,args);
      }
      if(isOpen(t)){const v=parseExpression(1);if(!isClose(tokens[i]))throw new global.CalcError('Syntax ERROR');i++;return v}
      throw new global.CalcError('Syntax ERROR');
    }
    function parseExpression(minPrec=0){
      let left=readPrimary();
      while(i<tokens.length){
        const t=tokens[i];
        if(t.type==='postfix'){i++;left=context.factorial(left);continue}
        if(t.type!=='operator'||!(t.value in PRECEDENCE))break;
        if(t.value===':')break;
        const p=PRECEDENCE[t.value];if(p<minPrec)break;i++;
        const right=parseExpression(p+(RIGHT_ASSOC.has(t.value)?0:1));
        left=context.applyOperator(t.value,left,right);
      }
      return left;
    }
    const value=parseExpression(1);
    if(i<tokens.length)throw new global.CalcError('Syntax ERROR');
    return value;
  }
  global.Parser={parseTokens};
})(window);
