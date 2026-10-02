(function(global){
  const KEY='580-web-lab-state-v2';
  const api={
    key:KEY,
    load(){
      try{
        const raw=localStorage.getItem(KEY); if(!raw)return global.CalcState.clone(global.CalcState.defaultState);
        const s={...global.CalcState.clone(global.CalcState.defaultState),...JSON.parse(raw)};
        s.variables={...global.CalcState.defaultState.variables,...(s.variables||{})};
        s.history=Array.isArray(s.history)?s.history.slice(0,global.CalcState.MAX_HISTORY):[];
        return s;
      }catch{return global.CalcState.clone(global.CalcState.defaultState)}
    },
    save(state){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}},
    reset(){try{localStorage.removeItem(KEY)}catch{}}
  };
  global.StorageService=api;
  global.CalcState.state=api.load();
})(window);
