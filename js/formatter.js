(function(global){
  function formatNumber(v,state=global.CalcState.state){
    if(global.Evaluator.isComplex(v))return formatComplex(v,state);
    if(typeof v!=='number'||Number.isNaN(v))throw new global.CalcError('Math ERROR');if(!Number.isFinite(v))throw new global.CalcError('Range ERROR');
    if(Math.abs(v)<1e-12)v=0;
    if(state.numberMode==='fixed')return v.toFixed(10).replace(/\.?(0+)$/,'');
    const a=Math.abs(v);let s;
    if(a>=1e12||(a!==0&&a<1e-10))s=v.toExponential(10).replace(/\.?0+(e[+-]?\d+)$/,'$1');
    else s=v.toPrecision(12).replace(/\.?0+$/,'');
    return s;
  }
  function formatComplex(z,state){const re=global.MathLab.clean(z.re),im=global.MathLab.clean(z.im);if(im===0)return formatNumber(re,state);if(re===0){const imf=formatNumber(im,state);return (imf==='1'?'':imf)+'i'}const sign=im<0?' − ':' + ';const imf=formatNumber(Math.abs(im),state);return `${formatNumber(re,state)}${sign}${imf==='1'?'':imf}i`}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function displayToken(t){return t.display??t.value}
  function displayExpression(tokens){let s='';for(const t of tokens){if(t.type==='operator')s+=t.value==='*'?' × ':t.value==='/'?' ÷ ':t.value;else if(t.type==='postfix')s+='!';else if(t.type==='func')s+=(t.display||t.value);else s+=displayToken(t)}return s}
  function tokensToPlain(tokens){return tokens.map(t=>t.type==='operator'?(t.value==='*'?'×':t.value==='/'?'÷':t.value):t.type==='postfix'?'!':displayToken(t)).join('')}
  global.Formatter={formatNumber,formatComplex,escapeHtml,displayToken,displayExpression,tokensToPlain};
})(window);
