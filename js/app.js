(function(global){
  const s=global.CalcState.state;
  const $=sel=>document.querySelector(sel);
  const keypad=$('#keypad'),quickGrid=$('#quickGrid'),exprDisplay=$('#exprDisplay'),resultDisplay=$('#resultDisplay'),exprViewport=$('#exprViewport'),overlayRoot=$('#overlayRoot'),appRoot=$('#app');

  function esc(s){return global.Formatter.escapeHtml(s)}
  function expressionWithCursor(){let html='';s.tokens.forEach((t,i)=>{if(i===s.cursor)html+='<span class="display-cursor"></span>';let d=global.Formatter.displayToken(t);if(t.type==='operator')d=t.value==='*'?'×':t.value==='/'?'÷':t.value;html+=esc(d)});if(s.cursor===s.tokens.length)html+='<span class="display-cursor"></span>';return html||'<span class="display-cursor"></span>'}
  function render(){
    exprDisplay.innerHTML=expressionWithCursor();resultDisplay.textContent=s.lastResultText||'0';resultDisplay.classList.toggle('error',/ ERROR$/.test(s.lastResultText||''));
    const status={shift:s.shift,alpha:s.alpha,deg:s.angleMode==='DEG',rad:s.angleMode==='RAD',stat:s.currentMode==='STAT',cmplx:s.currentMode==='CMPLX',memory:Math.abs(s.variables.M)>1e-12};document.querySelectorAll('[data-status]').forEach(el=>el.classList.toggle('on',!!status[el.dataset.status]));
    global.ThemeService.apply(s);appRoot.classList.toggle('focus-mode',s.focus);global.StorageService.save(s);
  }
  global.appRender=render;

  const rows=[
    [['OPTN','tools','OPTN','function','menu'],['CALC','calc','CALC','function','calc'],['x⁻¹','reciprocal','x⁻¹','function'],['x²','pow2','x²','function'],['xʸ','pow','xʸ','function'],['√x','sqrt','√x','function']],
    [['log','log','log','function'],['ln','ln','ln','function'],['sin','sin','sin','function'],['cos','cos','cos','function'],['tan','tan','tan','function'],['sin⁻¹','asin','sin⁻¹','function']],
    [['cos⁻¹','acos','cos⁻¹','function'],['tan⁻¹','atan','tan⁻¹','function'],['(', '(','(', 'function'],[')', ')',')','function'],['S↔D','sd','S↔D','function'],['%','%','%','function']],
    [['ENG','eng','ENG','function'],['π','pi','π','function'],['e','e','e','function'],['Ans','Ans','Ans','function'],['×10ˣ','sci','×10ˣ','function'],[',',',',',','function']],
    [['7','7','7','number'],['8','8','8','number'],['9','9','9','number'],['DEL','del','DEL','del'],['AC','ac','AC','ac'],['÷','/','÷','operator']],
    [['4','4','4','number'],['5','5','5','number'],['6','6','6','number'],['×','*','×','operator'],['M−','memorySub','M−','function'],['−','-','−','operator']],
    [['1','1','1','number'],['2','2','2','number'],['3','3','3','number'],['+','+','+','operator'],['STO','sto','STO','function'],['RCL','rcl','RCL','function']],
    [['0','0','0','number'],['.','.','.','number'],['FACT','fact','FACT','function'],['×10ˣ','sci','×10ˣ','function'],['M+','memoryAdd','M+','function'],['=','=','=', 'eq']]
  ];
  function renderKeys(){keypad.innerHTML='';rows.flat().forEach(([label,action,main,kind,sub])=>{const b=document.createElement('button');b.className=`key ${kind}`;b.dataset.action=action;b.setAttribute('aria-label',label);const m=document.createElement('span');m.className='main';m.textContent=main;b.appendChild(m);if(sub){const s2=document.createElement('span');s2.className='sub';s2.textContent=sub;b.appendChild(s2)}keypad.appendChild(b)})}
  function renderQuick(){quickGrid.innerHTML='';[['DEG/RAD','angle'],['CMPLX','complex'],['STUDY','study'],['HIST','history'],['TOOLS','tools'],['SET','setup']].forEach(([label,action])=>{const b=document.createElement('button');b.className='key function utility';b.dataset.action=action;b.textContent=label;b.setAttribute('aria-label',label);quickGrid.appendChild(b)})}
  function handleAction(action){
    if(action==='shift'){s.shift=!s.shift;render();return}
    if(action==='alpha'){s.alpha=!s.alpha;render();return}
    if(action==='tools'||action==='menu'||action==='calc')return openTools()
    if(action==='setup'||action==='settings')return openSettings()
    if(action==='history')return openHistory()
    if(action==='focus'){s.focus=!s.focus;render();return}
    if(action==='ac'||action==='on')return global.Calculator.clear()
    if(action==='del')return global.Calculator.del()
    if(action==='=')return global.Calculator.calculate()
    if(action==='pow2')return global.Calculator.insertText('^2')
    if(action==='pow')return global.Calculator.insertText('^')
    if(action==='sqrt')return global.Calculator.insertFunction('sqrt','√')
    if(action==='fact')return global.Calculator.insertToken(global.Tokenizer.token('postfix','!'))
    if(action==='sd')return openFractionTool()
    if(action==='fraction')return openFractionTool()
    if(action==='eng'||action==='sci')return global.Calculator.insertText('*10^')
    if(action==='sto')return openStore()
    if(action==='rcl')return openRecall()
    if(action==='memoryAdd')return global.Calculator.memoryAdd(1)
    if(action==='memorySub')return global.Calculator.memoryAdd(-1)
    if(action==='memoryClear')return global.Calculator.memoryClear()
    if(action==='memoryRecall')return global.Calculator.memoryRecall()
    if(action==='complex')return toggleComplex()
    if(action==='angle')return toggleAngle()
    if(action==='facttool')return openFactor()
    if(action==='gcdlcm')return openGcdLcm()
    if(action==='stat')return openStats()
    if(action==='table')return openTable()
    if(action==='equation')return openEquation()
    if(action==='matrix')return openMatrix()
    if(action==='vector')return openVector()
    if(action==='study')return toggleStudy()
    if(action==='abs')return global.Calculator.insertFunction('abs','abs')
    if(action==='exp')return global.Calculator.insertFunction('exp','eˣ')
    if(action==='tenpow'){global.Calculator.insertText('10^');return}
    if(action==='random')return global.Calculator.insertFunction('random','Ran#')
    if(action==='x3')return global.Calculator.insertText('^3')
    if(action==='up')return global.Calculator.move(-1)
    if(action==='left')return global.Calculator.move(-1)
    if(action==='right')return global.Calculator.move(1)
    if(action==='down')return global.Calculator.move(1)
    if(action==='center'){if(s.history[0])global.Calculator.restoreHistory(s.history[0]);else global.Calculator.stateChanged();return}
    if(['+','-','*','/','%','^','(',')',','].includes(action))return global.Calculator.insertText(action)
    if(/^\d$/.test(action)||action==='.')return global.Calculator.insertText(action)
  }
  keypad.addEventListener('click',e=>{const b=e.target.closest('.key');if(b)handleAction(b.dataset.action)});quickGrid.addEventListener('click',e=>{const b=e.target.closest('.key');if(b)handleAction(b.dataset.action)});document.querySelectorAll('.hardware-key').forEach(b=>b.addEventListener('click',()=>handleAction(b.dataset.action)));document.querySelectorAll('.nav-key').forEach(b=>b.addEventListener('click',()=>handleAction(b.dataset.action)));
  document.querySelectorAll('[data-side-action]').forEach(b=>b.addEventListener('click',()=>handleAction(b.dataset.sideAction)));

  function openOverlay(html,mode='modal'){closeOverlay();const wrap=document.createElement('div');wrap.className=mode==='drawer'?'drawer-overlay':'modal-overlay';wrap.id='activeOverlay';wrap.innerHTML=html;wrap.addEventListener('click',e=>{if(e.target===wrap)closeOverlay()});overlayRoot.appendChild(wrap);return wrap}
  function closeOverlay(){overlayRoot.innerHTML=''}
  global.closeOverlay=closeOverlay;

  function panel(title,body,klass='panel'){return `<div class="${klass}"><div class="panel-head"><h2>${esc(title)}</h2><button class="panel-close" aria-label="Close">×</button></div>${body}</div>`}
  function bindClose(){document.querySelector('#activeOverlay .panel-close')?.addEventListener('click',closeOverlay)}
  function openHistory(){openOverlay(`<div class="drawer-panel">${panel('History',`<div class="panel-actions"><button class="soft-btn" id="clearHistory">Clear all</button></div><div id="historyList"></div>`,'')}</div>`,'drawer');bindClose();const list=$('#historyList');if(!s.history.length){list.innerHTML='<div class="empty">No calculations yet.</div>'}else{s.history.forEach(item=>{const d=document.createElement('button');d.className='history-item';d.innerHTML=`<span>${esc(item.expression)}</span><strong>${esc(item.result)}</strong><small>${new Date(item.timestamp).toLocaleString()}</small>`;d.onclick=()=>{global.Calculator.restoreHistory(item);closeOverlay()};list.appendChild(d)})}$('#clearHistory').onclick=()=>{global.HistoryService.clear(s);render();openHistory()}}
  function openTools(){
    openOverlay(panel('Tools',`
      <div class="tool-section"><div class="tool-section-title">Quick functions</div><div class="tool-list compact" id="toolQuick"></div></div>
      <div class="tool-section"><div class="tool-section-title">Memory & conversion</div><div class="tool-list compact" id="toolMemory"></div></div>
      <div class="tool-section"><div class="tool-section-title">Modes & advanced</div><div class="tool-list" id="toolAdvanced"></div></div>`));
    bindClose();
    const groups={
      toolQuick:[['x³','Insert x³','x3'],['10ˣ','Insert 10ˣ','tenpow'],['eˣ','Insert eˣ','exp'],['abs','Absolute value','abs'],['Ran#','Random number','random']],
      toolMemory:[['M+','Add to M','memoryAdd'],['M−','Subtract from M','memorySub'],['MC','Clear memory','memoryClear'],['MR','Recall M','memoryRecall'],['GCD / LCM','Integer utility','gcdlcm'],['ENG','Engineering notation','eng'],['S↔D','Fraction / decimal','fraction'],['STO / RCL','Variables','sto']],
      toolAdvanced:[['Prime Factorization','FACT','facttool'],['Complex','CMPLX mode','complex'],['Statistics','1-Var statistics','stat'],['Table','f(x)','table'],['Equation','Linear / quadratic','equation'],['Matrix','A+B, A×B, det','matrix'],['Vector','Dot / cross / norm','vector'],['Study Mode','Deterministic steps','study']]
    };
    Object.entries(groups).forEach(([id,defs])=>{const g=$('#'+id);defs.forEach(([a,b,c])=>{const x=document.createElement('button');x.className='tool-item';x.innerHTML=`<b>${a}</b><small>${b}</small>`;x.onclick=()=>{handleAction(c);if(c!=='sto')closeOverlay()};g.appendChild(x)})})
  }
  function openSettings(){openOverlay(panel('Settings',`<div class="settings"><label>Theme<select id="theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label><label>Angle<select id="angle"><option value="DEG">Degree</option><option value="RAD">Radian</option></select></label><label>Number format<select id="numfmt"><option value="smart">Smart</option><option value="fixed">Fixed</option></select></label><button class="soft-btn" id="reset">Reset all local data</button><p class="about">580 Web Lab is an independent educational calculator project. It is not an official Casio product.</p></div>`));bindClose();$('#theme').value=s.theme;$('#angle').value=s.angleMode;$('#numfmt').value=s.numberMode;$('#theme').onchange=e=>{s.theme=e.target.value;render()};$('#angle').onchange=e=>{s.angleMode=e.target.value;render()};$('#numfmt').onchange=e=>{s.numberMode=e.target.value;render()};$('#reset').onclick=()=>{if(confirm('Reset all saved data?')){global.StorageService.reset();location.reload()}}}
  function openCommandPalette(){openOverlay(panel('Command Palette',`<div class="command"><input id="commandInput" placeholder="Search sin, fraction, dark mode…"><div id="commandList"></div></div>`));bindClose();const commands=[['sin','Insert sine','sin'],['fraction','Open fraction','fraction'],['complex','CMPLX mode','complex'],['statistics','Statistics','stat'],['dark mode','Dark theme','dark'],['degree','Degree mode','deg'],['radian','Radian mode','rad'],['clear history','Clear history','clear'],['focus','Focus mode','focus']];const input=$('#commandInput'),list=$('#commandList');function draw(){list.innerHTML='';const q=input.value.toLowerCase();commands.filter(c=>c[0].includes(q)||c[1].toLowerCase().includes(q)).forEach(c=>{const b=document.createElement('button');b.className='command-item';b.innerHTML=`<b>${c[0]}</b><small>${c[1]}</small>`;b.onclick=()=>{if(c[2]==='dark'){s.theme='dark';closeOverlay();render()}else if(c[2]==='deg'){s.angleMode='DEG';closeOverlay();render()}else if(c[2]==='rad'){s.angleMode='RAD';closeOverlay();render()}else if(c[2]==='clear'){s.history=[];closeOverlay();render()}else if(c[2]==='focus'){s.focus=!s.focus;closeOverlay();render()}else{handleAction(c[2]);closeOverlay()}};list.appendChild(b)})}input.oninput=draw;draw();input.focus()}
  function toggleComplex(){global.ComplexMode.toggle(s);render()}
  function toggleAngle(){s.angleMode=s.angleMode==='DEG'?'RAD':'DEG';render()}
  function toggleStudy(){s.study=!s.study;render()}
  function openFractionTool(){openOverlay(panel('Fraction',`<div class="form"><input id="frac" placeholder="1/3 or 0.75"><button class="soft-btn primary" id="fracDo">Convert</button><div class="tool-result" id="fracResult">—</div></div>`));bindClose();$('#fracDo').onclick=()=>$('#fracResult').textContent=global.BasicMode.fractionApprox($('#frac').value)}
  function openGcdLcm(){openOverlay(panel('GCD / LCM',`<div class="form"><div class="mini-fields"><input id="gA" placeholder="A"><input id="gB" placeholder="B"></div><button class="soft-btn primary" id="gDo">Calculate</button><pre class="tool-result" id="gResult">—</pre></div>`));bindClose();$('#gDo').onclick=()=>$('#gResult').textContent=global.BasicMode.gcdlcm(Number($('#gA').value),Number($('#gB').value))}
  function openFactor(){openOverlay(panel('Prime Factorization',`<div class="form"><input id="factor" placeholder="Integer"><button class="soft-btn primary" id="factorDo">Factor</button><div class="tool-result" id="factorResult">—</div></div>`));bindClose();$('#factorDo').onclick=()=>$('#factorResult').textContent=global.BasicMode.factor(Number($('#factor').value))}
  function openStats(){openOverlay(panel('Statistics',`<div class="form"><textarea id="stats" rows="4" placeholder="12 15 18 21"></textarea><button class="soft-btn primary" id="statsDo">Calculate</button><div class="tool-result" id="statsResult">—</div></div>`));bindClose();$('#statsDo').onclick=()=>$('#statsResult').textContent=global.StatisticsMode.calculate($('#stats').value)}
  function openTable(){openOverlay(panel('Table',`<div class="form"><input id="tableExpr" value="x^2+1"><div class="mini-fields"><input id="ts" value="-3"><input id="te" value="3"><input id="tp" value="1"></div><button class="soft-btn primary" id="tableDo">Generate</button><pre class="tool-result" id="tableResult">—</pre></div>`));bindClose();$('#tableDo').onclick=()=>$('#tableResult').textContent=global.TableMode.generate($('#tableExpr').value.replace(/\bx\b/g,'X'),Number($('#ts').value),Number($('#te').value),Number($('#tp').value),s)}
  function openEquation(){openOverlay(panel('Equation',`<div class="form"><input id="eq" value="x^2-5x+6=0"><small class="hint">Use x as the variable.</small><button class="soft-btn primary" id="eqDo">Solve</button><pre class="tool-result" id="eqResult">—</pre></div>`));bindClose();$('#eqDo').onclick=()=>$('#eqResult').textContent=global.EquationMode.solve($('#eq').value,s)}
  function openMatrix(){openOverlay(panel('Matrix',`<div class="form"><textarea id="ma" rows="3">1 2\n3 4</textarea><textarea id="mb" rows="3">5 6\n7 8</textarea><select id="mo"><option value="det">det(A)</option><option value="add">A + B</option><option value="mul">A × B</option></select><button class="soft-btn primary" id="md">Calculate</button><pre class="tool-result" id="mr">—</pre></div>`));bindClose();$('#md').onclick=()=>{try{const A=global.MatrixMode.parse($('#ma').value),op=$('#mo').value;if(op==='det')return $('#mr').textContent=global.Formatter.formatNumber(global.MatrixMode.det(A));const B=global.MatrixMode.parse($('#mb').value);$('#mr').textContent=global.MatrixMode.text(op==='add'?global.MatrixMode.add(A,B):global.MatrixMode.mul(A,B))}catch(e){$('#mr').textContent=e.message}}}
  function openStore(){openOverlay(panel('STO — Store',`<div class="form"><select id="storeVar"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>X</option><option>Y</option><option>M</option></select><button class="soft-btn primary" id="storeDo">Store current result</button></div>`));bindClose();$('#storeDo').onclick=()=>{try{global.Calculator.store($('#storeVar').value);closeOverlay()}catch{}}}
  function openRecall(){openOverlay(panel('RCL — Recall',`<div class="form"><select id="recallVar">${Object.keys(s.variables).map(k=>`<option>${k}</option>`).join('')}</select><button class="soft-btn primary" id="recallDo">Insert variable</button></div>`));bindClose();$('#recallDo').onclick=()=>{const n=$('#recallVar').value;global.Calculator.insertToken(global.Tokenizer.token('constant',n,n));closeOverlay()}}
  function openStudyFromResult(){const exp=global.Formatter.displayExpression(s.tokens),steps=[exp];if(exp.includes('√')){const m=exp.match(/√\(([^()]*)\)/);if(m){try{steps.push(`→ √${global.Formatter.formatNumber(global.Evaluator.evaluateTokens(global.Tokenizer.tokenizeInput(m[1]),s),s)}`)}catch{}}}steps.push(`→ ${s.lastResultText}`);openOverlay(panel('Study Mode',steps.map(x=>`<div class="step">${esc(x)}</div>`).join('')));bindClose()}
  function openStudy(){openStudyFromResult()}

  $('#historyBtn')?.addEventListener('click',openHistory);$('#toolsBtn')?.addEventListener('click',openTools);$('#settingsBtn')?.addEventListener('click',openSettings);$('#focusBtn')?.addEventListener('click',()=>{s.focus=!s.focus;render()});
  global.KeyboardService.bind({openCommandPalette,closeOverlay});
  global.ThemeService.bindSystem(s,render);
  renderKeys();renderQuick();render();
})(window);
