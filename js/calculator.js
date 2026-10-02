(function(global){
  const {token,cloneTokens}=global.Tokenizer;
  function create(){
    const s=global.CalcState.state;
    function setResult(v){const text=global.Formatter.formatNumber(v,s);s.lastAnswer=v;s.lastResultText=text;return text}
    function showError(msg){s.lastResultText=msg||'Math ERROR';s.justEvaluated=false;stateChanged();return s.lastResultText}
    function normalizeNextInput(next){if(!s.justEvaluated)return;if(next&&next.type==='operator'&&['+','-','*','/','^','%'].includes(next.value)){s.tokens=global.Tokenizer.tokenizeInput(global.Formatter.formatNumber(s.lastAnswer,s));s.cursor=s.tokens.length}else{s.tokens=[];s.cursor=0}s.justEvaluated=false}
    function insertToken(t){normalizeNextInput(t);s.tokens.splice(s.cursor,0,t);s.cursor++;stateChanged();scrollEnd()}
    function insertText(text){try{const ts=global.Tokenizer.tokenizeInput(text);for(const t of ts)insertToken(t)}catch(e){showError(e.message)}}
    function insertFunction(name,display=name){insertToken(token('func',name,display));insertToken(token('paren','('))}
    function backspace(){s.justEvaluated=false;if(s.cursor<=0)return showError('Syntax ERROR');const prev=s.tokens[s.cursor-1];if(prev?.type==='paren'&&prev.value===')'&&s.cursor>1&&s.tokens[s.cursor-2]?.type==='func'){s.tokens.splice(s.cursor-2,2);s.cursor-=2}else{s.tokens.splice(s.cursor-1,1);s.cursor--}stateChanged()}
    function del(){s.justEvaluated=false;if(s.cursor>=s.tokens.length)return;const cur=s.tokens[s.cursor];if(cur?.type==='func'&&s.tokens[s.cursor+1]?.type==='paren'&&s.tokens[s.cursor+1].value==='('){s.tokens.splice(s.cursor,2)}else s.tokens.splice(s.cursor,1);stateChanged()}
    function move(d){s.cursor=Math.max(0,Math.min(s.tokens.length,s.cursor+d));stateChanged();scrollCursor()}
    function clear(){s.tokens=[];s.cursor=0;s.shift=false;s.alpha=false;s.justEvaluated=false;s.lastResultText='0';stateChanged()}
    function calculate(){try{const v=global.Evaluator.evaluateTokens(s.tokens,s);const text=setResult(v);global.HistoryService.add(global.Formatter.displayExpression(s.tokens),text,s);s.justEvaluated=true;stateChanged();return v}catch(e){return null}}
    function currentValue(){return s.tokens.length?global.Evaluator.evaluateTokens(s.tokens,s):s.lastAnswer}
    function store(name){try{s.variables[name]=currentValue();stateChanged()}catch{return null}}
    function memoryAdd(sign=1){try{s.variables.M=(Number(s.variables.M)||0)+(sign*Number(currentValue()));stateChanged();return s.variables.M}catch{return null}}
    function memoryClear(){s.variables.M=0;stateChanged()}
    function memoryRecall(){insertToken(token('constant','M','M'))}
    function restoreHistory(item){try{global.HistoryService.restore(item,s);stateChanged();scrollEnd()}catch{}}
    function stateChanged(){global.StorageService.save(s);global.appRender?.()}
    function scrollEnd(){requestAnimationFrame(()=>{const el=document.getElementById('exprViewport');if(el)el.scrollLeft=el.scrollWidth})}
    function scrollCursor(){requestAnimationFrame(()=>{const el=document.getElementById('exprViewport');if(el)el.scrollLeft=Math.max(0,el.scrollWidth-el.clientWidth)})}
    return {insertToken,insertText,insertFunction,backspace,del,move,clear,calculate,store,memoryAdd,memoryClear,memoryRecall,restoreHistory,setResult,stateChanged,scrollEnd,scrollCursor,showError}
  }
  global.Calculator=create();
})(window);
