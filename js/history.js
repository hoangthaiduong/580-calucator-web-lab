(function(global){
  const api={
    add(expression,result,state){if(!expression)return;state.history.unshift({expression,result,timestamp:new Date().toISOString()});state.history=state.history.slice(0,global.CalcState.MAX_HISTORY)},
    clear(state){state.history=[]},
    restore(item,state){state.tokens=global.Tokenizer.tokenizeInput(item.expression);state.cursor=state.tokens.length;state.justEvaluated=false}
  };
  global.HistoryService=api;
})(window);
