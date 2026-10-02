(function(global){
  function toggle(state){state.currentMode=state.currentMode==='CMPLX'?'RUN':'CMPLX'}
  global.ComplexMode={toggle};
})(window);
