(function(global){
  function parse(s){const rows=String(s).trim().split(/\n|;/).map(r=>r.trim()).filter(Boolean).map(r=>r.replace(/[\[\]]/g,'').split(/[,\s]+/).filter(Boolean).map(Number));if(!rows.length||rows.some(r=>!r.length||r.length!==rows[0].length||r.some(v=>!Number.isFinite(v))))throw new global.CalcError('Argument ERROR');return rows}
  function det(m){if(m.length!==m[0].length)throw new global.CalcError('Dimension ERROR');if(m.length===1)return m[0][0];if(m.length===2)return m[0][0]*m[1][1]-m[0][1]*m[1][0];let sum=0;for(let j=0;j<m.length;j++){const minor=m.slice(1).map(row=>row.filter((_,k)=>k!==j));sum+=(j%2?-1:1)*m[0][j]*det(minor)}return sum}
  function add(a,b){if(a.length!==b.length||a[0].length!==b[0].length)throw new global.CalcError('Dimension ERROR');return a.map((r,i)=>r.map((x,j)=>x+b[i][j]))}
  function mul(a,b){if(a[0].length!==b.length)throw new global.CalcError('Dimension ERROR');return a.map(r=>b[0].map((_,j)=>r.reduce((sum,_,k)=>sum+r[k]*b[k][j],0)))}
  function text(m){return m.map(r=>`[ ${r.map(global.Formatter.formatNumber).join(', ')} ]`).join('\n')}
  global.MatrixMode={parse,det,add,mul,text};
})(window);
