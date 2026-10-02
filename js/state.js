(function(global){
  const MAX_HISTORY=40;
  const defaultState={
    expression:'',tokens:[],cursor:0,angleMode:'DEG',shift:false,alpha:false,justEvaluated:false,
    lastAnswer:0,variables:{A:0,B:0,C:0,D:0,E:0,F:0,X:0,Y:0,M:0},history:[],theme:'system',
    numberMode:'smart',animation:true,currentMode:'RUN',study:false,focus:false,lastResultText:'0'
  };
  global.CalcState={defaultState,MAX_HISTORY,state:null,clone(v){return JSON.parse(JSON.stringify(v))}};
  global.CalcState.state=global.CalcState.clone(defaultState);
})(window);
