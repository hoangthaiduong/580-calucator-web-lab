(function(global){
  function bind(app){
    document.addEventListener('keydown',e=>{
      if(document.getElementById('commandInput'))return;
      if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();app.openCommandPalette();return}
      if(e.key==='Escape'){app.closeOverlay();return}
      if(e.key==='Enter'||e.key==='='){e.preventDefault();global.Calculator.calculate();return}
      if(e.key==='Backspace'){e.preventDefault();global.Calculator.backspace();return}
      if(e.key==='Delete'){e.preventDefault();global.Calculator.del();return}
      if(e.key==='ArrowLeft'){e.preventDefault();global.Calculator.move(-1);return}
      if(e.key==='ArrowRight'){e.preventDefault();global.Calculator.move(1);return}
      if(e.key==='Home'){e.preventDefault();global.CalcState.state.cursor=0;global.Calculator.stateChanged();return}
      if(e.key==='End'){e.preventDefault();global.CalcState.state.cursor=global.CalcState.state.tokens.length;global.Calculator.stateChanged();global.Calculator.scrollEnd();return}
      if(/^[0-9.]$/.test(e.key)||['+','-','*','/','%','^','(',')',','].includes(e.key)){e.preventDefault();global.Calculator.insertText(e.key)}
    });
  }
  global.KeyboardService={bind};
})(window);
