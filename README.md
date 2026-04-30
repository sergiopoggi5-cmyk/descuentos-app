<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mis Descuentos</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,sans-serif;font-size:14px;background:#f5f5f5;}
.app{max-width:400px;margin:0 auto;background:#fff;min-height:100vh;}
.tabs{display:flex;border-bottom:1px solid #e0e0e0;background:#fff;position:sticky;top:0;z-index:10;}
.tab{flex:1;padding:11px 2px;font-size:12px;font-weight:500;text-align:center;cursor:pointer;color:#888;border:none;border-bottom:2px solid transparent;background:none;transition:.15s;}
.tab.active{color:#111;border-bottom:2px solid #111;}
.screen{padding:14px 14px 80px;}
.day-selector{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;}
.day-btn{padding:5px 9px;font-size:12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:#fff;color:#888;}
.day-btn.active{background:#111;color:#fff;border-color:#111;}
.rubro-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.rubro-btn{display:flex;align-items:center;gap:4px;padding:5px 10px;font-size:11px;border:1px solid #ddd;border-radius:20px;cursor:pointer;background:#fff;color:#888;white-space:nowrap;}
.rubro-btn.active{font-weight:500;}
.rubro-btn.r-super.active{background:#EAF3DE;color:#27500A;border-color:#639922;}
.rubro-btn.r-cercania.active{background:#E6F1FB;color:#0C447C;border-color:#378ADD;}
.rubro-btn.r-farmacia.active{background:#FCEBEB;color:#791F1F;border-color:#E24B4A;}
.rubro-btn.r-cafeteria.active{background:#FAEEDA;color:#633806;border-color:#BA7517;}
.discount-card{background:#fff;border:1px solid #e8e8e8;border-radius:12px;padding:13px 14px;margin-bottom:10px;border-left-width:3px;}
.card-r-super{border-left-color:#639922;}.card-r-cercania{border-left-color:#378ADD;}
.card-r-farmacia{border-left-color:#E24B4A;}.card-r-cafeteria{border-left-color:#BA7517;}
.card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
.card-left{display:flex;gap:10px;}
.card-icon{font-size:22px;line-height:1;}
.card-title{font-size:15px;font-weight:500;color:#111;}
.card-bank{font-size:12px;color:#888;margin-top:1px;}
.card-rubro{font-size:11px;font-weight:500;margin-top:2px;}
.lr-super{color:#3B6D11;}.lr-cercania{color:#185FA5;}.lr-farmacia{color:#A32D2D;}.lr-cafeteria{color:#854F0B;}
.card-right{display:flex;flex-direction:column;align-items:flex-end;gap:5px;}
.badge{font-size:13px;font-weight:600;padding:3px 10px;border-radius:20px;}
.badge-super{background:#EAF3DE;color:#27500A;}.badge-cercania{background:#E6F1FB;color:#0C447C;}
.badge-farmacia{background:#FCEBEB;color:#791F1F;}.badge-cafeteria{background:#FAEEDA;color:#633806;}
.btn-edit-card{font-size:11px;padding:3px 8px;border:1px solid #ddd;border-radius:6px;cursor:pointer;background:#f7f7f7;color:#555;}
.card-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:10px;}
.det{background:#f7f7f7;border-radius:8px;padding:7px 9px;}
.det-lbl{font-size:10px;color:#888;margin-bottom:2px;}
.det-val{font-size:12px;font-weight:500;color:#111;}
.progress-wrap{margin-top:2px;}
.progress-header{display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:4px;}
.progress-bar-bg{height:6px;background:#eee;border-radius:10px;overflow:hidden;}
.progress-bar-fill{height:6px;border-radius:10px;transition:.4s;}
.btn-registrar{width:100%;padding:7px;font-size:12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:#f7f7f7;color:#444;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:5px;}
.historial-row{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#888;padding:3px 0;border-bottom:1px solid #f2f2f2;}
.historial-row:last-child{border-bottom:none;}
.historial-row .h-del{background:none;border:none;cursor:pointer;color:#ccc;font-size:12px;}
.form-section{margin-bottom:14px;}
.form-label{font-size:12px;color:#888;margin-bottom:5px;display:block;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
input[type=text],input[type=number],input[type=date]{width:100%;font-size:14px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;background:#fff;color:#111;outline:none;}
input:focus{border-color:#888;}
.days-check{display:flex;flex-wrap:wrap;gap:5px;}
.day-check{font-size:12px;cursor:pointer;padding:4px 8px;border:1px solid #ddd;border-radius:7px;user-select:none;color:#888;}
.day-check.selected{background:#111;color:#fff;border-color:#111;}
.rubro-select{display:flex;gap:6px;flex-wrap:wrap;}
.rubro-opt{display:flex;align-items:center;gap:5px;padding:6px 10px;font-size:12px;border:1px solid #ddd;border-radius:20px;cursor:pointer;user-select:none;color:#888;}
.rubro-opt.selected{font-weight:500;border-width:1.5px;}
.rubro-opt.ro-super.selected{background:#EAF3DE;color:#27500A;border-color:#639922;}
.rubro-opt.ro-cercania.selected{background:#E6F1FB;color:#0C447C;border-color:#378ADD;}
.rubro-opt.ro-farmacia.selected{background:#FCEBEB;color:#791F1F;border-color:#E24B4A;}
.rubro-opt.ro-cafeteria.selected{background:#FAEEDA;color:#633806;border-color:#BA7517;}
.period-select{display:flex;gap:8px;}
.period-opt{flex:1;text-align:center;padding:7px;font-size:12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;user-select:none;color:#888;}
.period-opt.selected{background:#111;color:#fff;border-color:#111;font-weight:500;}
.submit-btn{width:100%;padding:11px;font-size:14px;font-weight:500;cursor:pointer;border:1px solid #ddd;border-radius:8px;background:#f7f7f7;color:#111;margin-top:4px;}
.submit-btn.save-mode{background:#111;color:#fff;border-color:#111;}
.form-msg{font-size:12px;margin-top:8px;text-align:center;min-height:16px;}
.edit-notice{background:#E6F1FB;color:#0C447C;border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:12px;}
.list-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:7px;border-left-width:3px;}
.list-info{flex:1;}
.list-name{font-size:13px;font-weight:500;color:#111;}
.list-sub{font-size:11px;color:#888;margin-top:2px;}
.list-actions{display:flex;gap:4px;}
.btn-list-edit{background:#f7f7f7;border:1px solid #ddd;border-radius:6px;cursor:pointer;font-size:12px;padding:4px 8px;color:#555;}
.del-btn{background:none;border:none;cursor:pointer;font-size:14px;color:#bbb;padding:2px 4px;}
.section-title-sm{font-size:11px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:14px 0 8px;}
.empty-state{text-align:center;padding:2rem 1rem;color:#aaa;font-size:13px;}
.sync-bar{display:flex;align-items:center;justify-content:space-between;background:#f7f7f7;border:1px solid #e0e0e0;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#888;}
.btn-sync{padding:4px 10px;font-size:12px;border:1px solid #ddd;border-radius:6px;cursor:pointer;background:#fff;color:#111;}
.btn-sync:disabled{color:#bbb;cursor:default;}
.io-card{background:#f7f7f7;border:1px solid #e0e0e0;border-radius:12px;padding:16px;margin-bottom:12px;}
.io-card-header{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.io-icon{font-size:20px;}
.io-title{font-size:14px;font-weight:600;color:#111;}
.io-desc{font-size:12px;color:#888;margin-bottom:12px;line-height:1.6;}
.io-btn{width:100%;padding:10px;font-size:13px;font-weight:500;cursor:pointer;border-radius:8px;border:1px solid #ddd;background:#fff;color:#111;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:6px;}
.io-btn:last-child{margin-bottom:0;}
.io-btn.primary{background:#1D6F42;color:#fff;border-color:#1D6F42;}
.io-btn.danger{color:#A32D2D;border-color:#E24B4A;}
.modal-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;align-items:flex-end;justify-content:center;}
.modal-backdrop.open{display:flex;}
.modal{background:#fff;border-radius:16px 16px 0 0;padding:20px 16px 32px;width:100%;max-width:420px;max-height:85vh;overflow-y:auto;}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.modal-title{font-size:15px;font-weight:600;color:#111;}
.modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:#888;}
.spinner{display:inline-block;width:12px;height:12px;border:2px solid #ddd;border-top-color:#555;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg)}}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 20px;border-radius:20px;font-size:13px;z-index:999;opacity:0;transition:opacity .3s;pointer-events:none;}
.toast.show{opacity:1;}
</style>
</head>
<body>
<div class="app">
  <div class="tabs">
    <button class="tab active" onclick="showTab('hoy')">Hoy</button>
    <button class="tab" onclick="showTab('cargar')">Cargar</button>
    <button class="tab" onclick="showTab('lista')">Lista</button>
    <button class="tab" onclick="showTab('datos')">Datos</button>
  </div>

  <div id="screen-hoy" class="screen">
    <div class="sync-bar">
      <span id="syncStatus">📋 Cargando...</span>
      <button class="btn-sync" id="btnSync" onclick="loadFromSheets()">🔄 Actualizar</button>
    </div>
    <div class="day-selector" id="daySelector"></div>
    <div class="rubro-filter" id="rubroFilter"></div>
    <div id="discountList"></div>
  </div>

  <div id="screen-cargar" class="screen" style="display:none;">
    <div id="edit-notice" class="edit-notice" style="display:none;">✏️ Editando descuento existente</div>
    <div class="form-section"><label class="form-label">Rubro</label><div class="rubro-select" id="rubroSelect"></div></div>
    <div class="form-section"><label class="form-label">Comercio / Nombre</label><input type="text" id="f-name" placeholder="Ej: Carrefour, Farmacity…"></div>
    <div class="form-section"><label class="form-label">Banco / Tarjeta</label><input type="text" id="f-bank" placeholder="Ej: Galicia, Santander…"></div>
    <div class="form-section"><label class="form-label">Días de la semana</label><div class="days-check" id="daysCheck"></div></div>
    <div class="form-section"><div class="form-row">
      <div><label class="form-label">Descuento (%)</label><input type="number" id="f-pct" placeholder="25" min="1" max="99"></div>
      <div><label class="form-label">Compra mínima ($)</label><input type="number" id="f-min" placeholder="5000"></div>
    </div></div>
    <div class="form-section"><div class="form-row">
      <div><label class="form-label">Tope por compra ($)</label><input type="number" id="f-max" placeholder="2000"></div>
      <div><label class="form-label">Límite del período ($)</label><input type="number" id="f-limit" placeholder="4000"></div>
    </div></div>
    <div class="form-section"><label class="form-label">Período del límite</label>
      <div class="period-select" id="periodSelect">
        <div class="period-opt" onclick="selectPeriod('semanal')">📅 Semanal</div>
        <div class="period-opt" onclick="selectPeriod('mensual')">🗓️ Mensual</div>
      </div>
    </div>
    <button class="submit-btn" id="submitBtn" onclick="submitForm()">Agregar descuento</button>
    <div class="form-msg" id="form-msg"></div>
  </div>

  <div id="screen-lista" class="screen" style="display:none;"><div id="allList"></div></div>

  <div id="screen-datos" class="screen" style="display:none;">
    <div class="io-card">
      <div class="io-card-header"><span class="io-icon">☁️</span><span class="io-title">Google Sheets</span></div>
      <div class="io-desc">Los datos se sincronizan con tu hoja de Google. Guardá después de cada cambio para que tu esposa lo vea actualizado.</div>
      <button class="io-btn primary" id="btnGuardar" onclick="saveToSheets()">⬆️ Guardar en Google Sheets</button>
      <button class="io-btn" onclick="loadFromSheets()">⬇️ Cargar desde Google Sheets</button>
    </div>
    <div class="io-card">
      <div class="io-card-header"><span class="io-icon">📗</span><span class="io-title">Exportar a Excel</span></div>
      <div class="io-desc">Descargá una copia local como respaldo en formato .xlsx.</div>
      <button class="io-btn" onclick="exportXLS()">⬇️ Descargar .xlsx</button>
    </div>
    <div class="io-card">
      <div class="io-card-header"><span class="io-icon">🗑️</span><span class="io-title">Borrar datos locales</span></div>
      <div class="io-desc">Limpia los datos de esta sesión. No borra el Google Sheet.</div>
      <button class="io-btn danger" onclick="clearAll()">Borrar datos locales</button>
    </div>
  </div>
</div>

<div class="modal-backdrop" id="modalRegistrar">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title" id="modalRegistrarTitle">Registrar compra</span>
      <button class="modal-close" onclick="closeModal('modalRegistrar')">✕</button>
    </div>
    <div class="form-section"><label class="form-label">Monto total de la compra ($)</label><input type="number" id="r-monto" placeholder="8500"></div>
    <div class="form-section"><label class="form-label">Fecha</label><input type="date" id="r-fecha"></div>
    <div style="background:#f7f7f7;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#555;line-height:1.7;" id="r-preview"></div>
    <button class="submit-btn save-mode" onclick="confirmarCompra()">Confirmar compra</button>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz0wcvN0TAWmuKgtXLOnIrkkLemn3M778efYDzr7e6r0JM6vtRWZ_zIRg9kMhL22emc/exec';

const DAYS=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DAYS_FULL=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const RUBROS=[
  {id:'super',label:'Supermercado',icon:'🛒'},
  {id:'cercania',label:'Neg. cercanía',icon:'🏪'},
  {id:'farmacia',label:'Farmacia',icon:'💊'},
  {id:'cafeteria',label:'Cafetería',icon:'☕'},
];
const RUBRO_LABELS={'super':'Supermercado','cercania':'Neg. cercanía','farmacia':'Farmacia','cafeteria':'Cafetería'};
const RUBRO_IDS={'Supermercado':'super','Neg. cercanía':'cercania','Farmacia':'farmacia','Cafetería':'cafeteria'};

let discounts=[];
let purchases=[];
let nextId=1,nextPurchaseId=1;
let selectedDay=new Date().getDay(); selectedDay=selectedDay===0?6:selectedDay-1;
let activeRubro='all';
let fDays=[],fRubro='',fPeriod='',editingId=null,registrandoId=null;

const R=id=>RUBROS.find(r=>r.id===id);
const $=id=>document.getElementById(id);

function showToast(msg){
  const t=$('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── GOOGLE SHEETS ──
async function loadFromSheets(){
  setSyncStatus('⏳ Cargando...', true);
  try{
    // usamos no-cors workaround via script tag para evitar CORS
    const url = SHEETS_URL + '?t=' + Date.now();
    const res = await fetch(url, {redirect:'follow'});
    const text = await res.text();
    // a veces Google devuelve HTML de redirect, intentamos parsear
    let rows;
    try { rows = JSON.parse(text); }
    catch(e){ throw new Error('Respuesta no es JSON. Verificá la implementación.'); }
    if(!Array.isArray(rows)) throw new Error('Formato inesperado');
    discounts = rows
      .filter(r => r['Comercio'])
      .map((r,i)=>{
        const diasStr=(r['Días']||'').toString();
        const days=diasStr.split(',').map(s=>DAYS.indexOf(s.trim())).filter(x=>x>=0);
        return{
          id:i+1,
          rubro:RUBRO_IDS[r['Rubro']]||'super',
          name:String(r['Comercio']||''),
          bank:String(r['Banco / Tarjeta']||''),
          days:days.length?days:[0],
          pct:Number(r['Descuento (%)']),
          minBuy:Number(r['Compra mínima ($)']),
          maxReturn:Number(r['Tope por compra ($)']),
          limitAmount:Number(r['Límite período ($)']),
          period:(r['Período']||'mensual').toString().toLowerCase()
        };
      });
    nextId=discounts.length+1;
    const now=new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    setSyncStatus('✅ Actualizado '+now, false);
    renderDiscounts(); renderAllList();
    showToast('✅ Datos cargados correctamente');
  }catch(e){
    setSyncStatus('❌ Error: '+e.message, false);
    showToast('❌ '+e.message);
  }
}

async function saveToSheets(){
  if(!discounts.length){showToast('No hay descuentos para guardar');return;}
  const btn=$('btnGuardar');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span> Guardando...';
  try{
    const rows=discounts.map(d=>[
      RUBRO_LABELS[d.rubro]||d.rubro,
      d.name, d.bank,
      d.days.map(i=>DAYS[i]).join(', '),
      d.pct, d.minBuy, d.maxReturn, d.limitAmount||0, d.period
    ]);
    // Enviamos via GET con los datos codificados en la URL
    const dataStr = encodeURIComponent(JSON.stringify(rows));
    const url = SHEETS_URL + '?action=save&data=' + dataStr;
    const res = await fetch(url, {redirect:'follow'});
    const text = await res.text();
    let result;
    try { result = JSON.parse(text); } catch(e){ result = {ok: text.includes('ok')}; }
    if(result.ok){
      const now=new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
      setSyncStatus('✅ Guardado '+now, false);
      showToast('✅ Guardado en Google Sheets');
    } else {
      throw new Error(result.error||'Respuesta inesperada');
    }
  }catch(e){
    showToast('❌ Error al guardar: '+e.message);
    setSyncStatus('❌ Error al guardar', false);
  }
  btn.disabled=false;
  btn.innerHTML='⬆️ Guardar en Google Sheets';
}

function setSyncStatus(msg,loading){
  $('syncStatus').innerHTML=loading?`<span class="spinner"></span> ${msg}`:msg;
  $('btnSync').disabled=loading;
}

// ── TABS ──
function showTab(tab){
  ['hoy','cargar','lista','datos'].forEach(t=>$('screen-'+t).style.display=t===tab?'block':'none');
  document.querySelectorAll('.tab').forEach((el,i)=>el.classList.toggle('active',['hoy','cargar','lista','datos'][i]===tab));
  if(tab==='hoy')renderAll();
  if(tab==='lista')renderAllList();
  if(tab==='cargar'){resetForm();buildCargarForm();}
}

// ── HOY ──
function renderAll(){renderDaySelector();renderRubroFilter();renderDiscounts();}
function renderDaySelector(){
  $('daySelector').innerHTML=DAYS.map((d,i)=>`<button class="day-btn ${i===selectedDay?'active':''}" onclick="selectDay(${i})">${d}</button>`).join('');
}
function renderRubroFilter(){
  $('rubroFilter').innerHTML=`<button class="rubro-btn ${activeRubro==='all'?'active':''}" onclick="setRubro('all')">Todos</button>`+
    RUBROS.map(r=>`<button class="rubro-btn r-${r.id} ${activeRubro===r.id?'active':''}" onclick="setRubro('${r.id}')">${r.icon} ${r.label}</button>`).join('');
}
function setRubro(id){activeRubro=id;renderRubroFilter();renderDiscounts();}
function selectDay(i){selectedDay=i;renderDaySelector();renderDiscounts();}

function renderDiscounts(){
  const el=$('discountList');
  if(!discounts.length){
    el.innerHTML=`<div class="empty-state">Sin descuentos cargados.<br><br><button class="btn-sync" onclick="loadFromSheets()">🔄 Cargar desde Sheets</button></div>`;
    return;
  }
  let list=discounts.filter(d=>d.days.includes(selectedDay));
  if(activeRubro!=='all')list=list.filter(d=>d.rubro===activeRubro);
  if(!list.length){el.innerHTML=`<div class="empty-state">Sin descuentos para el ${DAYS_FULL[selectedDay]}</div>`;return;}
  el.innerHTML=list.map(d=>cardHTML(d)).join('');
}

function getPeriodStart(period){
  const now=new Date();
  if(period==='semanal'){const d=new Date(now);const day=d.getDay();const diff=d.getDate()-day+(day===0?-6:1);d.setDate(diff);d.setHours(0,0,0,0);return d;}
  return new Date(now.getFullYear(),now.getMonth(),1);
}
function getUsado(discountId){
  const d=discounts.find(x=>x.id===discountId);if(!d)return 0;
  const start=getPeriodStart(d.period);
  return purchases.filter(p=>p.discountId===discountId&&new Date(p.fecha)>=start).reduce((s,p)=>s+p.reintegro,0);
}

function cardHTML(d){
  const r=R(d.rubro);
  const usado=getUsado(d.id);
  const restante=Math.max(0,(d.limitAmount||0)-usado);
  const pct_usado=d.limitAmount?Math.min(100,Math.round(usado/d.limitAmount*100)):0;
  const fillColor=pct_usado>=100?'#E24B4A':pct_usado>=75?'#BA7517':'#639922';
  const hist=purchases.filter(p=>p.discountId===d.id).slice(-3).reverse();
  return `<div class="discount-card card-r-${d.rubro}">
    <div class="card-header">
      <div class="card-left"><div class="card-icon">${r.icon}</div>
        <div><div class="card-title">${d.name}</div><div class="card-bank">${d.bank}</div><div class="card-rubro lr-${d.rubro}">${r.label}</div></div>
      </div>
      <div class="card-right">
        <span class="badge badge-${d.rubro}">${d.pct}% off</span>
        <button class="btn-edit-card" onclick="editFromCard(${d.id})">✏️ Editar</button>
      </div>
    </div>
    <div class="card-grid">
      <div class="det"><div class="det-lbl">Compra mínima</div><div class="det-val">$${d.minBuy.toLocaleString('es-AR')}</div></div>
      <div class="det"><div class="det-lbl">Tope por uso</div><div class="det-val">$${d.maxReturn.toLocaleString('es-AR')}</div></div>
      <div class="det"><div class="det-lbl">Límite ${d.period}</div><div class="det-val">$${(d.limitAmount||0).toLocaleString('es-AR')}</div></div>
    </div>
    <div class="progress-wrap">
      <div class="progress-header">
        <span>Usado este ${d.period==='mensual'?'mes':'semana'}: <strong>$${Math.round(usado).toLocaleString('es-AR')}</strong></span>
        <span style="color:${restante===0?'#A32D2D':'#27500A'}">Resta: <strong>$${Math.round(restante).toLocaleString('es-AR')}</strong></span>
      </div>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct_usado}%;background:${fillColor}"></div></div>
    </div>
    ${hist.length?`<div style="margin-top:8px">${hist.map(p=>`<div class="historial-row"><span style="color:#aaa">${p.fecha}</span><span>$${p.monto.toLocaleString('es-AR')} → $${Math.round(p.reintegro).toLocaleString('es-AR')}</span><button class="h-del" onclick="deletePurchase(${p.id})">✕</button></div>`).join('')}</div>`:''}
    <button class="btn-registrar" onclick="abrirRegistrar(${d.id})">➕ Registrar compra</button>
  </div>`;
}

// ── REGISTRAR COMPRA ──
function abrirRegistrar(discountId){
  registrandoId=discountId;
  const d=discounts.find(x=>x.id===discountId);
  $('modalRegistrarTitle').textContent=`Registrar — ${d.name}`;
  $('r-monto').value='';
  $('r-fecha').value=new Date().toISOString().split('T')[0];
  actualizarPreview();
  $('r-monto').oninput=actualizarPreview;
  $('modalRegistrar').classList.add('open');
}
function actualizarPreview(){
  const d=discounts.find(x=>x.id===registrandoId);if(!d)return;
  const monto=parseFloat($('r-monto').value)||0;
  const usado=getUsado(d.id);
  const restante=Math.max(0,(d.limitAmount||0)-usado);
  if(monto<d.minBuy){$('r-preview').innerHTML=`⚠️ Mínimo: <strong>$${d.minBuy.toLocaleString('es-AR')}</strong>`;return;}
  const bruto=monto*(d.pct/100);
  const cap=Math.min(bruto,d.maxReturn);
  const final=Math.min(cap,restante);
  $('r-preview').innerHTML=`Descuento bruto: <strong>$${Math.round(bruto).toLocaleString('es-AR')}</strong><br>Tope por compra: <strong>$${d.maxReturn.toLocaleString('es-AR')}</strong><br>Reintegro real: <strong style="color:#27500A;font-size:14px">$${Math.round(final).toLocaleString('es-AR')}</strong>`+
    (final<cap?`<br><span style="color:#A32D2D;font-size:11px">⚠️ Saldo ${d.period}: $${Math.round(restante).toLocaleString('es-AR')}</span>`:'');
}
function confirmarCompra(){
  const d=discounts.find(x=>x.id===registrandoId);if(!d)return;
  const monto=parseFloat($('r-monto').value)||0;
  const fecha=$('r-fecha').value;
  if(!monto||!fecha||monto<d.minBuy){alert('La compra debe superar el monto mínimo.');return;}
  const usado=getUsado(d.id);
  const restante=Math.max(0,(d.limitAmount||0)-usado);
  const bruto=monto*(d.pct/100);
  const cap=Math.min(bruto,d.maxReturn);
  const final=Math.min(cap,restante);
  purchases.push({id:nextPurchaseId++,discountId:d.id,fecha,monto,reintegro:final});
  closeModal('modalRegistrar');renderDiscounts();
  showToast('✅ Compra registrada');
}
function deletePurchase(pid){purchases=purchases.filter(p=>p.id!==pid);renderDiscounts();}
function closeModal(id){$(id).classList.remove('open');}

// ── FORM ──
function buildCargarForm(){buildFormRubro();buildDaysCheck();buildPeriodSelect();}
function buildFormRubro(){
  $('rubroSelect').innerHTML=RUBROS.map(r=>`<div class="rubro-opt ro-${r.id} ${fRubro===r.id?'selected':''}" onclick="selectFormRubro('${r.id}')">${r.icon} ${r.label}</div>`).join('');
}
function buildDaysCheck(){
  $('daysCheck').innerHTML=DAYS.map((d,i)=>`<div class="day-check ${fDays.includes(i)?'selected':''}" onclick="toggleDay(${i})">${d}</div>`).join('');
}
function buildPeriodSelect(){
  document.querySelectorAll('.period-opt').forEach(el=>{
    const p=el.textContent.includes('Semanal')?'semanal':'mensual';
    el.classList.toggle('selected',fPeriod===p);
  });
}
function selectFormRubro(id){fRubro=id;buildFormRubro();}
function selectPeriod(p){fPeriod=p;buildPeriodSelect();}
function toggleDay(i){fDays=fDays.includes(i)?fDays.filter(x=>x!==i):[...fDays,i];buildDaysCheck();}
function resetForm(){
  editingId=null;fDays=[];fRubro='';fPeriod='';
  ['f-name','f-bank','f-pct','f-min','f-max','f-limit'].forEach(id=>{const e=$(id);if(e)e.value='';});
  $('edit-notice').style.display='none';
  $('submitBtn').textContent='Agregar descuento';$('submitBtn').classList.remove('save-mode');
  $('form-msg').textContent='';
}
function loadIntoForm(d){
  fRubro=d.rubro;fDays=[...d.days];fPeriod=d.period||'';
  $('f-name').value=d.name;$('f-bank').value=d.bank;
  $('f-pct').value=d.pct;$('f-min').value=d.minBuy;
  $('f-max').value=d.maxReturn;$('f-limit').value=d.limitAmount||'';
  buildCargarForm();
  $('edit-notice').style.display='block';
  $('submitBtn').textContent='💾 Guardar cambios';$('submitBtn').classList.add('save-mode');
}
function editFromCard(id){const d=discounts.find(x=>x.id===id);if(!d)return;editingId=id;loadIntoForm(d);showTab('cargar');}
function submitForm(){
  const name=$('f-name').value.trim(),bank=$('f-bank').value.trim();
  const pct=parseInt($('f-pct').value),minBuy=parseInt($('f-min').value);
  const maxReturn=parseInt($('f-max').value),limitAmount=parseInt($('f-limit').value);
  const msg=$('form-msg');
  if(!fRubro||!name||!bank||!fDays.length||isNaN(pct)||isNaN(minBuy)||isNaN(maxReturn)||isNaN(limitAmount)||!fPeriod){
    msg.style.color='#A32D2D';msg.textContent='Completá todos los campos.';return;
  }
  const obj={rubro:fRubro,name,bank,days:[...fDays],pct,minBuy,maxReturn,limitAmount,period:fPeriod};
  if(editingId!==null){
    const idx=discounts.findIndex(x=>x.id===editingId);
    if(idx!==-1)discounts[idx]={...obj,id:editingId};
    msg.style.color='#27500A';msg.textContent='✓ Editado. Ir a Datos → Guardar para sincronizar.';
  } else {
    discounts.push({...obj,id:nextId++});
    msg.style.color='#27500A';msg.textContent='✓ Agregado. Ir a Datos → Guardar para sincronizar.';
  }
  setTimeout(()=>{resetForm();buildCargarForm();},2500);
}

// ── LISTA ──
function renderAllList(){
  const el=$('allList');
  if(!discounts.length){el.innerHTML=`<div class="empty-state">No hay descuentos cargados</div>`;return;}
  const grouped=RUBROS.map(r=>({rubro:r,items:discounts.filter(d=>d.rubro===r.id)})).filter(g=>g.items.length);
  el.innerHTML=grouped.map(g=>`
    <p class="section-title-sm">${g.rubro.icon} ${g.rubro.label}</p>
    ${g.items.map(d=>`<div class="list-item card-r-${d.rubro}">
      <div class="list-info">
        <div class="list-name">${d.name} — ${d.bank} <strong>${d.pct}%</strong></div>
        <div class="list-sub">${d.days.map(i=>DAYS[i]).join(', ')} · mín $${d.minBuy.toLocaleString('es-AR')} · tope $${d.maxReturn.toLocaleString('es-AR')} · límite ${d.period} $${(d.limitAmount||0).toLocaleString('es-AR')}</div>
      </div>
      <div class="list-actions">
        <button class="btn-list-edit" onclick="editFromCard(${d.id})">✏️</button>
        <button class="del-btn" onclick="deleteDiscount(${d.id})">✕</button>
      </div>
    </div>`).join('')}
  `).join('');
}
function deleteDiscount(id){
  discounts=discounts.filter(d=>d.id!==id);
  purchases=purchases.filter(p=>p.discountId!==id);
  renderAllList();
  showToast('Descuento eliminado. Guardá en Sheets para sincronizar.');
}

// ── EXPORT XLS ──
function exportXLS(){
  const rows=discounts.map(d=>({'Rubro':RUBRO_LABELS[d.rubro]||d.rubro,'Comercio':d.name,'Banco / Tarjeta':d.bank,'Días':d.days.map(i=>DAYS[i]).join(', '),'Descuento (%)':d.pct,'Compra mínima ($)':d.minBuy,'Tope por compra ($)':d.maxReturn,'Límite período ($)':d.limitAmount||0,'Período':d.period}));
  const wb=XLSX.utils.book_new();
  const ws=XLSX.utils.json_to_sheet(rows);
  ws['!cols']=[{wch:14},{wch:18},{wch:18},{wch:22},{wch:13},{wch:16},{wch:16},{wch:16},{wch:10}];
  XLSX.utils.book_append_sheet(wb,ws,'Descuentos');
  XLSX.writeFile(wb,'mis-descuentos.xlsx');
}

function clearAll(){
  if(!confirm('¿Borrar datos locales de esta sesión?'))return;
  discounts=[];purchases=[];nextId=1;nextPurchaseId=1;
  renderDiscounts();renderAllList();
  setSyncStatus('🗑️ Datos borrados',false);
}

// ── INIT ──
buildDaysCheck();renderAll();buildCargarForm();
loadFromSheets();
</script>
</body>
</html>
