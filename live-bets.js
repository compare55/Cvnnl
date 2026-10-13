(function(){
'use strict';
const path=(location.pathname.split('/').pop()||'').toLowerCase();
const gameMap={'slot.html':'Slot','aviator.html':'Aviator','color.html':'Color','dragon-tiger.html':'Dragon Tiger','seven-up-down.html':'7 Up Down','pappu.html':'Pappu','e-sabong.html':'E-Sabong'};
const game=gameMap[path]; if(!game)return;
let clientId=localStorage.getItem('jiowinAnonBetId');
if(!clientId){const bytes=new Uint8Array(12);if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(bytes);else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);clientId='anon-'+Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('jiowinAnonBetId',clientId);}
const style=document.createElement('style');
style.textContent=`
.bet-pool-badge{display:flex;flex-direction:column;gap:2px;margin:6px auto 0;padding:5px 7px;border-radius:7px;background:rgba(10,16,27,.82);border:1px solid rgba(255,255,255,.2);font:700 10px/1.25 Arial,sans-serif;max-width:100%;box-sizing:border-box;position:relative;z-index:2;pointer-events:none;text-align:center;white-space:normal}
.bet-pool-badge .bp-total{font-size:11px;color:#fff4bd}.bet-pool-badge .bp-demo{color:#ffd98a}.bet-pool-badge .bp-real{color:#8cf0bb}
.pappu-item .bet-pool-badge{width:calc(100% - 8px);font-size:9px;padding:4px 2px}.pappu-item .bet-pool-badge .bp-total{font-size:10px}
.dt-side-btn .bet-pool-badge{width:100%}
#sudLiveActivity{margin:14px 0 18px;border:1px solid rgba(232,194,86,.55);border-radius:12px;overflow:hidden;background:#101827;color:#f5f7ff;box-shadow:0 8px 22px rgba(0,0,0,.22);font-family:Arial,sans-serif}
#sudLiveActivity .sudla-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;background:#1b263d;font-weight:800;font-size:15px}
#sudLiveActivity .sudla-sub{padding:9px 14px;color:#f0d68b;border-bottom:1px solid #30394b;font-weight:700;font-size:13px}
#sudLiveActivity .sudla-table{width:100%;border-collapse:collapse;font-size:13px}
#sudLiveActivity th{background:#202c42;color:#cdd7ed;text-align:left;padding:9px 10px;font-size:11px;text-transform:uppercase}
#sudLiveActivity td{padding:10px;border-top:1px solid #2b3548;overflow-wrap:anywhere}
#sudLiveActivity .sudla-amount{text-align:right;color:#8cf0bb;font-weight:800;white-space:nowrap}
#sudLiveActivity .sudla-tag{font-size:10px;font-weight:800;color:#ffe3a0;background:#554322;border-radius:5px;padding:3px 5px;margin-left:5px}
#sudLiveActivity .sudla-empty{padding:12px 14px;color:#aab5ca;font-size:12px}
#sudLiveActivity .sudla-scroll{max-height:300px;overflow:auto}
#spinBtn .bet-pool-badge,#aviatorActionBtn .bet-pool-badge{margin-top:8px;background:rgba(0,0,0,.35)}
`;
document.head.appendChild(style);
const amounts=[10,20,30,50,100,200,25,75,150,40,300,500];
const options={
 'Slot':['Spin'],
 'Aviator':['Aviator'],
 'Color':['green','violet','red','small','big','num0','num1','num2','num3','num4','num5','num6','num7','num8','num9'],
 'Dragon Tiger':['dragon','tiger','tie','dragonBig','dragonSmall','tigerBig','tigerSmall','suitedTie'],
 '7 Up Down':['down','lucky','up','odd','even','num2','num3','num4','num5','num6','num7','num8','num9','num10','num11','num12'],
 'Pappu':['titli','kabutar','chidiya','masakali','bhanwra','machhli','sher','hathi','mor','chuha','kutta','billi'],
 'E-Sabong':['meron','draw','wala']
};
const displayNames={green:'Green',violet:'Violet',red:'Red',small:'Small',big:'Big',num0:'0',num1:'1',num2:'2',num3:'3',num4:'4',num5:'5',num6:'6',num7:'7',num8:'8',num9:'9',num10:'10',num11:'11',num12:'12',dragonBig:'Dragon Big',dragonSmall:'Dragon Small',tigerBig:'Tiger Big',tigerSmall:'Tiger Small',suitedTie:'Suited Tie',down:'7 Down',up:'7 Up',lucky:'Lucky 7',odd:'Odd',even:'Even',meron:'Meron',wala:'Wala',draw:'Draw',Spin:'Spin',Aviator:'Aviator'};
const demoBets=Array.from({length:50},(_,i)=>({selection:options[game][i%options[game].length],amount:amounts[i%amounts.length]}));
function keyOf(v){return String(v||'').trim().toLowerCase();}
function addBadge(el,key){if(!el)return null;let badge=el.querySelector(':scope > .bet-pool-badge');if(!badge){badge=document.createElement('div');badge.className='bet-pool-badge';badge.dataset.poolKey=key;badge.innerHTML='<span class="bp-total">Total bets: ₹0</span><span class="bp-demo">Demo pool: ₹0</span><span class="bp-real">Real submitted: ₹0</span>';el.appendChild(badge);}return badge;}
function findTargets(){
 const map={};
 if(game==='7 Up Down') return map;
 const put=(key,el)=>{if(el){if(!map[key])map[key]=[];map[key].push(el);}};
 if(game==='Color'){
  document.querySelectorAll('.color-btn').forEach(el=>{const m=el.getAttribute('onclick')?.match(/placeBet\('([^']+)'/);if(m)put(keyOf(m[1]),el);});
  document.querySelectorAll('.bs-btn').forEach(el=>{const m=el.getAttribute('onclick')?.match(/placeBet\('([^']+)'/);if(m)put(keyOf(m[1]),el);});
  document.querySelectorAll('.num-btn').forEach(el=>{const m=el.getAttribute('onclick')?.match(/placeBet\('([^']+)'/);if(m)put(keyOf(m[1]),el);});
 } else if(game==='Dragon Tiger'){
  document.querySelectorAll('.dt-bet-btn,.dt-side-btn').forEach(el=>{const m=el.getAttribute('onclick')?.match(/placeBet\('([^']+)'/);if(m)put(keyOf(m[1]),el);});
 } else if(game==='7 Up Down'){
  document.querySelectorAll('.sud-bet-btn,.sud-side-btn,.sud-num-btn').forEach(el=>{const m=el.getAttribute('onclick')?.match(/placeBet\('([^']+)'/);if(m)put(keyOf(m[1]),el);});
 } else if(game==='E-Sabong'){
  document.querySelectorAll('.esabong-bet-btn').forEach(el=>{const m=el.getAttribute('onclick')?.match(/placeBet\('([^']+)'/);if(m)put(keyOf(m[1]),el);});
 } else if(game==='Pappu'){
  document.querySelectorAll('.pappu-item').forEach(el=>put(keyOf(el.dataset.id),el));
 } else if(game==='Slot'){
  put('spin',document.getElementById('spinBtn'));
 } else if(game==='Aviator'){
  put('aviator',document.getElementById('aviatorActionBtn'));
 }
 return map;
}
function money(n){return '₹'+Math.max(0,Math.round(Number(n)||0)).toLocaleString('en-IN');}
function render(realBets=[]){
 if(game==='7 Up Down'){renderSevenUpDownTable(realBets);return;}
 const demoTotals={},realTotals={};
 demoBets.forEach(b=>{const k=keyOf(b.selection);demoTotals[k]=(demoTotals[k]||0)+b.amount;});
 realBets.forEach(b=>{const k=keyOf(b.selection);realTotals[k]=(realTotals[k]||0)+Math.max(0,Number(b.amount)||0);});
 const targets=findTargets();
 Object.keys(targets).forEach(k=>targets[k].forEach(el=>{
  const badge=addBadge(el,k);const d=demoTotals[k]||0,r=realTotals[k]||0;
  badge.querySelector('.bp-total').textContent='Total bets: '+money(d+r);
  badge.querySelector('.bp-demo').textContent='Demo pool: '+money(d);
  badge.querySelector('.bp-real').textContent='Real submitted: '+money(r);
 }));
}
function renderSevenUpDownTable(realBets=[]){
 let panel=document.getElementById('sudLiveActivity');
 if(!panel){
  panel=document.createElement('section');panel.id='sudLiveActivity';panel.setAttribute('aria-label','Bet activity table');
  const footer=document.querySelector('.sud-footer');
  if(footer&&footer.parentNode)footer.parentNode.insertBefore(panel,footer.nextSibling);
  else document.querySelector('.sud-container')?.appendChild(panel);
 }
 const demoRows=demoBets.slice(0,10).map((b,i)=>({player:'DemoUser'+String(i+1).padStart(2,'0'),selection:b.selection,amount:b.amount,demo:true}));
 const realRows=realBets.slice(0,20).map(b=>({player:b.player||'Guest',selection:b.selection,amount:b.amount,demo:false}));
 const rows=[...realRows,...demoRows];
 const total=realRows.reduce((sum,b)=>sum+Math.max(0,Number(b.amount)||0),0);
 const label=v=>displayNames[v]||String(v||'').replace(/^num/i,'');
 panel.innerHTML='<div class="sudla-head"><span>BET ACTIVITY</span><span style="color:#75e5b0;font-size:12px">● LIVE</span></div>'+
  '<div class="sudla-sub">Real submitted bets total: '+money(total)+'</div>'+
  '<div class="sudla-scroll"><table class="sudla-table"><thead><tr><th>Player</th><th>Bet</th><th>Type</th><th style="text-align:right">Amount</th></tr></thead><tbody>'+
  rows.map(b=>'<tr><td>'+escapeHtml(b.player)+'</td><td>'+escapeHtml(label(b.selection))+'</td><td>'+(b.demo?'<span class="sudla-tag">DEMO</span>':'<span class="sudla-tag" style="color:#9df2c4;background:#174832">REAL</span>')+'</td><td class="sudla-amount">'+money(b.amount)+'</td></tr>').join('')+
  '</tbody></table></div>'+(realRows.length?'':'<div class="sudla-empty">No real submitted bets yet. Demo rows are simulated examples and do not affect any wallet.</div>');
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
let latestRealBets=[];
async function refresh(){try{const r=await fetch('/api/live-bets?game='+encodeURIComponent(game),{cache:'no-store'});if(!r.ok){render(latestRealBets);return;}const d=await r.json();latestRealBets=Array.isArray(d.bets)?d.bets:[];render(latestRealBets);}catch(e){render(latestRealBets);}}
window.reportLiveBet=function(selection,amount){amount=Number(amount);if(!Number.isInteger(amount)||amount<1)return;fetch('/api/live-bets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({game,selection:String(selection).slice(0,80),amount,clientId})}).then(()=>refresh()).catch(()=>{});};
render([]);refresh();setInterval(refresh,3000);
// Rotating simulated pool values are visibly labelled Demo pool at each betting option.
setInterval(()=>{const i=Math.floor(Math.random()*demoBets.length);demoBets[i]={selection:options[game][Math.floor(Math.random()*options[game].length)],amount:amounts[Math.floor(Math.random()*amounts.length)]};refresh();},4500);
// Pappu options are inserted dynamically after this script loads.
setInterval(()=>render(latestRealBets),1000); // catches dynamically-created Pappu bet options without adding a popup
})();
