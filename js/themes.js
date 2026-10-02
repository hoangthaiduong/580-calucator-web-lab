(function(global){
  function apply(state){const theme=state.theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):state.theme;document.documentElement.setAttribute('data-theme',theme)}
  function bindSystem(state,render){matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='system')render()})}
  global.ThemeService={apply,bindSystem};
})(window);
