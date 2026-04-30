<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mis Descuentos</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,sans-serif;font-size:16px;background:#f5f5f5;}
.app{max-width:420px;margin:0 auto;background:#fff;min-height:100vh;}
.tabs{display:flex;border-bottom:1px solid #e0e0e0;background:#fff;position:sticky;top:0;z-index:10;}
.tab{flex:1;padding:13px 2px;font-size:13px;font-weight:500;text-align:center;cursor:pointer;color:#888;border:none;border-bottom:2px solid transparent;background:none;transition:.15s;}
.tab.active{color:#111;border-bottom:2px solid #111;}
.screen{padding:14px 14px 80px;}
.day-selector{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.day-btn{padding:7px 11px;font-size:13px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:#fff;color:#888;}
.day-btn.active{background:#111;color:#fff;border-color:#111;}
.rubro-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.rubro-btn{display:flex;align-items:center;gap:5px;padding:7px 11px;font-size:12px;border:1px solid #ddd;border-radius:20px;cursor:pointer;background:#fff;color:#888;white-space:nowrap;}
.rubro-btn.active{font-weight:600;}
.rubro-btn.r-super.active{background:#EAF3DE;color:#27500A;border-color:#639922;}
.rubro-btn.r-cercania.active{background:#E6F1FB;color:#0C447C;border-color:#378ADD;}
.rubro-btn.r-farmacia.active{background:#FCEBEB;color:#791F1F;border-color:#E24B4A;}
.rubro-btn.r-cafeteria.active{background:#FAEEDA;color:#633806;border-color:#BA7517;}
.discount-card{background:#fff;border:1px solid #e8e8e8;border-radius:14px;padding:15px 16px;margin-bottom:12px;border-left-width:4px;}
.card-r-super{border-left-color:#639922;}.card-r-cercania{border-left-color:#378ADD;}
.card-r-farmacia{border-left-color:#E24B4A;}.card-r-cafeteria{border-left-color:#BA7517;}
.card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;}
.card-left{display:flex;gap:11px;}
.card-icon{font-size:26px;line-height:1;}
.card-title{font-size:17px;font-weight:600;color:#111;}
.card-bank{font-size:14px;color:#888;margin-top:2px;}
.card-rubro{font-size:12px;font-weight:500;margin-top:3px;}
.lr-super{color:#3B6D11;}.lr-cercania{color:#185FA5;}.lr-farmacia{color:#A32D2D;}.lr-cafeteria{color:#854F0B;}
.card-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
.badge{font-size:15px;font-weight:700;padding:4px 12px;border-radius:20px;}
.badge-super{background:#EAF3DE;color:#27500A;}.badge-cercania{background:#E6F1FB;color:#0C447C;}
.badge-farmacia{background:#FCEBEB;color:#791F1F;}.badge-cafeteria{background:#FAEEDA;color:#633806;}
.btn-edit-card{font-size:13px;padding:5px 10px;border:1px solid #ddd;border-radius:6px;cursor:pointer;background:#f7f7f7;color:#555;}
.card-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;}
.det{background:#f7f7f7;border-radius:9px;padding:9px 10px;}
.det-lbl{font-size:11px;color:#888;margin-bottom:3px;}
.det-val{font-size:14px;font-weight:600;color:#111;}
.progress-wrap{margin-top:4px;}
.progress-header{display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:5px;}
.progress-bar-bg{height:7px;background:#eee;border-radius:10px;overflow:hidden;}
.progress-bar-fill{height:7px;border-radius:10px;transition:.4s;}
.consumido-row{display:flex;align-items:center;gap:8px;margin-top:10px;}
.consumido-label{font-size:13px;color:#888;white-space:nowrap;}
.consumido-input{flex:1;font-size:15px;padding:7px 10px;border:1px solid #ddd;border-radius:8px;background:#fff;color:#111;outline:none;text-align:right;}
.consumido-input:focus{border-color:#639922;}
.consumido-hint{font-size:11px;color:#aaa;margin-top:3px;text-align:right;}
.form-section{margin-bottom:16px;}
.form-label{font-size:14px;color:#666;margin-bottom:6px;display:block;font-weight:500;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
input[type=text],input[type=number],input[type=date]{width:100%;font-size:16px;padding:11px 12px;border:1px solid #ddd;border-radius:9px;background:#fff;color:#111;outline:none;}
input:focus{border-color:#888;}
.days-check{display:flex;flex-wrap:wrap;gap:7px;}
.day-check{font-size:14px;cursor:pointer;padding:7px 11px;border:1px solid #ddd;border-radius:8px;user-select:none;color:#888;}
.day-check.selected{background:#111;color:#fff;border-color:#111;}
.rubro-select{display:flex;gap:7px;flex-wrap:wrap;}
.rubro-opt{display:flex;align-items:center;gap:6px;padding:8px 12px;font-size:14px;border:1px solid #ddd;border-radius:20px;cursor:pointer;user-select:none;color:#888;}
.rubro-opt.selected{font-weight:600;border-width:2px;}
.rubro-opt.ro-super.selected{background:#EAF3DE;color:#27500A;border-color:#639922;}
.rubro-opt.ro-cercania.selected{background:#E6F1FB;color:#0C447C;border-color:#378ADD;}
.rubro-opt.ro-farmacia.selected{background:#FCEBEB;color:#791F1F;border-color:#E24B4A;}
.rubro-opt.ro-cafeteria.selected{background:#FAEEDA;color:#633806;border-color:#BA7517;}
.period-select{display:flex;gap:10px;}
.period-opt{flex:1;text-align:center;padding:10px;font-size:14px;border:1px solid #ddd;border-radius:9px;cursor:pointer;user-select:none;color:#888;}
.period-opt.selected{background:#111;color:#fff;border-color:#111;font-weight:600;}
.submit-btn{width:100%;padding:14px;font-size:16px;font-weight:600;cursor:pointer;border:1px solid #ddd;border-radius:10px;background:#f7f7f7;color:#111;margin-top:4px;}
.submit-btn.save-mode{background:#111;color:#fff;border-color:#111;}
.form-msg{font-size:14px;margin-top:10px;text-align:center;min-height:18px;}
.edit-notice{background:#E6F1FB;color:#0C447C;border-radius:9px;padding:10px 14px;font-size:14px;margin-bottom:14px;}
.list-item{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border:1px solid #e8e8e8;border-radius:11px;margin-bottom:9px;border-left-width:4px;}
.list-info{flex:1;}
.list-name{font-size:15px;font-weight:600;color:#111;}
.list-sub{font-size:13px;color:#888;margin-top:3px;line-height:1.5;}
.list-actions{display:flex;gap:6px;margin-left:8px;}
.btn-list-edit{background:#f7f7f7;border:1px solid #ddd;border-radius:7px;cursor:pointer;font-size:14px;padding:6px 10px;color:#555;}
.del-btn{background:none;border:none;cursor:pointer;font-size:16px;color:#bbb;padding:4px 6px;}
.section-title-sm{font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:16px 0 9px;}
.empty-state{text-align:center;padding:2.5rem 1rem;color:#aaa;font-size:15px;line-height:1.6;}
.sync-bar{display:flex;align-items:center;justify-content:space-between;background:#f7f7f7;border:1px solid #e0e0e0;border-radius:9px;padding:10px 14px;margin-bottom:14px;font-size:13px;color:#888;}
.btn-sync{padding:6px 12px;font-size:13px;border:1px solid #ddd;border-radius:7px;cursor:pointer;background:#fff;color:#111;}
.btn-sync:disabled{color:#bbb;cursor:default;}
.autosave-bar{background:#EAF3DE;border:1px solid #b3d98a;border-radius:9px;padding:8px 14px;margin-bottom:14px;font-size:12px;color:#3B6D11;display:flex;align-items:center;justify-content:space-between;}
.autosave-countdown{font-weight:600;}
.io-card{background:#f7f7f7;border:1px solid #e0e0e0;border-radius:13px;padding:18px;margin-bottom:14px;}
.io-card-header{display:flex;align-items:center;gap:9px;margin-bottom:7px;}
.io-icon{font-size:22px;}
.io-title{font-size:16px;font-weight:700;color:#111;}
.io-desc{font-size:14px;color:#888;margin-bottom:14px;line-height:1.6;}
.io-btn{width:100%;padding:13px;font-size:15px;font-weight:500;cursor:pointer;border-radius:9px;border:1px solid #ddd;background:#fff;color:#111;margin-bottom:9px;display:flex;align-items:center;justify-content:center;gap:7px;}
.io-btn:last-child{margin-bottom:0;}
.io-btn.primary{background:#1D6F42;color:#fff;border-color:#1D6F42;}
.io-btn.danger{color:#A32D2D;border-color:#E24B4A;}
.modal-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;align-items:flex-end;justify-content:center;}
.modal-backdrop.open{display:flex;}
.modal{background:#fff;border-radius:18px 18px 0 0;padding:22px 18px 36px;width:100%;max-width:440px;max-height:85vh;overflow-y:auto;}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
.modal-title{font-size:17px;font-weight:700;color:#111;}
.modal-close{background:none;border:none;font-size:24px;cursor:pointer;color:#888;line-height:1;}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid #ddd;border-top-color:#555;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;}
@keyframes spin{to{transform:rotate(360deg)}}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:12px 22px;border-radius:22px;font-size:15px;z-index:999;opacity:0;transition:opacity .3s;pointer-events:none;white-space:nowrap;}
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
    <div id="autosaveBar" class="autosave-bar" style="display:none;">
      🔄 Autoguardado en <span class="autosave-countdown" id="autoCountdown">60</span>s
      <button class="btn-sync" onclick="saveToSheets()">Guardar ya</button>
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
      <div><label class="form-label">Límite período ($)</label><input type="number" id="f-limit" placeholder="4000"></div>
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
      <div class="io-desc">Se autoguarda cada 60 segundos cuando hay cambios. También podés guardar manualmente.</div>
      <button class="io-btn primary" id="btnGuardar" onclick="saveToSheets()">⬆️ Guardar ahora en Sheets</button>
      <button class="io-btn" onclick="loadFromSheets()">⬇️ Cargar desde Sheets</button>
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

<div class="toast" id="toast"></div>

<script>
// ── CONFIGURACIÓN ──
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz0wcvN0TAWmuKgtXLOnIrkkLemn3M778efYDzr7e6r0JM6vtRWZ_zIRg9kMhL22emc/exec';

// Orden EXACTO de columnas en el Google Sheet (fila 1)
// A=Rubro B=Comercio C=Banco/Tarjeta D=Días E=Descuento(%) F=Compra mínima G=Tope H=Límite I=Período J=Consumido
const COL_ORDER = ['Rubro','Comercio','Banco / Tarjeta','Días','Descuento (%)','Compra mínima ($)','Tope por compra ($)','Límite período ($)','Período','Consumido ($)'];

const DAYS=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DAYS_FULL=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const RUBROS=[
  {id:'super',    label:'Supermercado',  icon:'🛒'},
  {id:'cercania', label:'Neg. cercanía', icon:'🏪'},
  {id:'farmacia', label:'Farmacia',      icon:'💊'},
  {id:'cafeteria',label:'Cafetería',     icon:'☕'},
];
const RUBRO_LABELS={'super':'Supermercado','cercania':'Neg. cercanía','farmacia':'Farmacia','cafeteria':'Cafetería'};
const RUBRO_IDS={'Supermercado':'super','Neg. cercanía':'cercania','Farmacia':'farmacia','Cafetería':'cafeteria'};

let discounts=[];
let nextId=1;
let selectedDay=new Date().getDay(); selectedDay=selectedDay===0?6:selectedDay-1;
let activeRubro='all';
let fDays=[], fRubro='', fPeriod='', editingIdx=null;
let pendingChanges=false;
let autoSaveTimer=null, countdownInterval=null, countdown=60;

const R=id=>RUBROS.find(r=>r.id===id);
const $=id=>document.getElementById(id);

function showToast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── AUTOGUARDADO ──
function markChanged(){
  pendingChanges=true;
  $('autosaveBar').style.display='flex';
  // Reinicia el countdown cada vez que hay un cambio
  if(countdownInterval) clearInterval(countdownInterval);
  if(autoSaveTimer) clearTimeout(autoSaveTimer);
  countdown=60;
  $('autoCountdown').textContent=countdown;
  countdownInterval=setInterval(()=>{
    countdown--;
    $('autoCountdown').textContent=countdown;
    if(countdown<=0){ clearInterval(countdownInterval); }
  },1000);
  autoSaveTimer=setTimeout(async()=>{
    if(pendingChanges){ await saveToSheets(true); }
  },60000);
}

// ── GOOGLE SHEETS ──
async function loadFromSheets(){
  setSyncStatus('⏳ Cargando...', true);
  try{
    const res = await fetch(SHEETS_URL + '?t=' + Date.now(), {redirect:'follow'});
    const text = await res.text();
    let rows;
    try { rows = JSON.parse(text); }
    catch(e){ throw new Error('No se pudo leer la respuesta'); }
    if(!Array.isArray(rows)) throw new Error('Formato inesperado');

    discounts = rows
      .filter(r => r['Comercio'] && String(r['Comercio']).trim() !== '')
      .map((r, i) => {
        const diasStr = (r['Días'] || '').toString();
        const days = diasStr.split(',').map(s => DAYS.indexOf(s.trim())).filter(x => x >= 0);
        return {
          id: i + 1,
          rubro:       RUBRO_IDS[String(r['Rubro']||'').trim()] || 'super',
          name:        String(r['Comercio']||'').trim(),
          bank:        String(r['Banco / Tarjeta']||'').trim(),
          days:        days.length ? days : [0],
          pct:         Number(r['Descuento (%)'])      || 0,
          minBuy:      Number(r['Compra mínima ($)'])  || 0,
          maxReturn:   Number(r['Tope por compra ($)'])|| 0,
          limitAmount: Number(r['Límite período ($)']) || 0,
          period:      String(r['Período']||'mensual').toLowerCase().trim(),
          consumido:   Number(r['Consumido ($)'])      || 0,
        };
      });

    nextId = discounts.length + 1;
    pendingChanges = false;
    $('autosaveBar').style.display='none';
    const now = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    setSyncStatus('✅ Actualizado ' + now, false);
    renderDiscounts();
    renderAllList();
    showToast('✅ ' + discounts.length + ' descuentos cargados');
  } catch(e){
    setSyncStatus('❌ ' + e.message, false);
    showToast('❌ Error: ' + e.message);
  }
}

async function saveToSheets(auto=false){
  if(!discounts.length){ if(!auto) showToast('No hay descuentos para guardar'); return; }
  const btn = $('btnGuardar');
  if(btn){ btn.disabled=true; btn.innerHTML='<span class="spinner"></span> Guardando...'; }
  try{
    // Armamos las filas en el orden EXACTO de las columnas del Sheet
    const rows = discounts.map(d => [
      RUBRO_LABELS[d.rubro] || d.rubro,   // A Rubro
      d.name,                              // B Comercio
      d.bank,                              // C Banco / Tarjeta
      d.days.map(i => DAYS[i]).join(', '), // D Días
      d.pct,                               // E Descuento (%)
      d.minBuy,                            // F Compra mínima ($)
      d.maxReturn,                         // G Tope por compra ($)
      d.limitAmount || 0,                  // H Límite período ($)
      d.period,                            // I Período
      d.consumido || 0                     // J Consumido ($)
    ]);
    const dataStr = encodeURIComponent(JSON.stringify(rows));
    const url = SHEETS_URL + '?action=save&data=' + dataStr;
    const res = await fetch(url, {redirect:'follow'});
    const text = await res.text();
    let result;
    try { result = JSON.parse(text); } catch(e){ result = {ok: text.includes('ok')}; }
    if(result.ok){
      pendingChanges = false;
      $('autosaveBar').style.display = 'none';
      if(countdownInterval) clearInterval(countdownInterval);
      const now = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
      setSyncStatus('✅ Guardado ' + now, false);
      if(!auto) showToast('✅ Guardado en Google Sheets');
      else showToast('🔄 Autoguardado a las ' + now);
    } else {
      throw new Error(result.error || 'Respuesta inesperada');
    }
  } catch(e){
    showToast('❌ Error al guardar: ' + e.message);
    setSyncStatus('❌ Error al guardar', false);
  }
  if(btn){ btn.disabled=false; btn.innerHTML='⬆️ Guardar ahora en Sheets'; }
}

function setSyncStatus(msg, loading){
  $('syncStatus').innerHTML = loading ? `<span class="spinner"></span> ${msg}` : msg;
  $('btnSync').disabled = loading;
}

// ── TABS ──
function showTab(tab){
  ['hoy','cargar','lista','datos'].forEach(t => $('screen-'+t).style.display = t===tab?'block':'none');
  document.querySelectorAll('.tab').forEach((el,i) => el.classList.toggle('active', ['hoy','cargar','lista','datos'][i]===tab));
  if(tab==='hoy') renderAll();
  if(tab==='lista') renderAllList();
  if(tab==='cargar' && editingIdx===null){ resetForm(); buildCargarForm(); }
  if(tab==='cargar' && editingIdx!==null){ buildCargarForm(); }
}

// ── HOY ──
function renderAll(){ renderDaySelector(); renderRubroFilter(); renderDiscounts(); }

function renderDaySelector(){
  $('daySelector').innerHTML = DAYS.map((d,i) =>
    `<button class="day-btn ${i===selectedDay?'active':''}" onclick="selectDay(${i})">${d}</button>`
  ).join('');
}
function renderRubroFilter(){
  $('rubroFilter').innerHTML =
    `<button class="rubro-btn ${activeRubro==='all'?'active':''}" onclick="setRubro('all')">Todos</button>` +
    RUBROS.map(r => `<button class="rubro-btn r-${r.id} ${activeRubro===r.id?'active':''}" onclick="setRubro('${r.id}')">${r.icon} ${r.label}</button>`).join('');
}
function setRubro(id){ activeRubro=id; renderRubroFilter(); renderDiscounts(); }
function selectDay(i){ selectedDay=i; renderDaySelector(); renderDiscounts(); }

function renderDiscounts(){
  const el = $('discountList');
  if(!discounts.length){
    el.innerHTML=`<div class="empty-state">Sin descuentos cargados.<br><br><button class="btn-sync" onclick="loadFromSheets()">🔄 Cargar desde Sheets</button></div>`;
    return;
  }
  let list = discounts.filter(d => d.days.includes(selectedDay));
  if(activeRubro !== 'all') list = list.filter(d => d.rubro===activeRubro);
  if(!list.length){ el.innerHTML=`<div class="empty-state">Sin descuentos para el ${DAYS_FULL[selectedDay]}</div>`; return; }
  el.innerHTML = list.map(d => cardHTML(d)).join('');
}

function cardHTML(d){
  const r = R(d.rubro);
  const consumido = d.consumido || 0;
  const restante  = Math.max(0, (d.limitAmount||0) - consumido);
  const pct_usado = d.limitAmount ? Math.min(100, Math.round(consumido/d.limitAmount*100)) : 0;
  const fillColor = pct_usado>=100 ? '#E24B4A' : pct_usado>=75 ? '#BA7517' : '#639922';
  return `<div class="discount-card card-r-${d.rubro}">
    <div class="card-header">
      <div class="card-left">
        <div class="card-icon">${r.icon}</div>
        <div>
          <div class="card-title">${d.name}</div>
          <div class="card-bank">${d.bank}</div>
          <div class="card-rubro lr-${d.rubro}">${r.label}</div>
        </div>
      </div>
      <div class="card-right">
        <span class="badge badge-${d.rubro}">${d.pct}% off</span>
        <button class="btn-edit-card" onclick="editDiscount(${d.id})">✏️ Editar</button>
      </div>
    </div>
    <div class="card-grid">
      <div class="det"><div class="det-lbl">Compra mínima</div><div class="det-val">$${d.minBuy.toLocaleString('es-AR')}</div></div>
      <div class="det"><div class="det-lbl">Tope por uso</div><div class="det-val">$${d.maxReturn.toLocaleString('es-AR')}</div></div>
      <div class="det"><div class="det-lbl">Límite ${d.period}</div><div class="det-val">$${(d.limitAmount||0).toLocaleString('es-AR')}</div></div>
    </div>
    <div class="progress-wrap">
      <div class="progress-header">
        <span>Consumido este ${d.period==='mensual'?'mes':'semana'}: <strong>$${consumido.toLocaleString('es-AR')}</strong></span>
        <span style="color:${restante===0?'#A32D2D':'#27500A'}">Resta: <strong>$${restante.toLocaleString('es-AR')}</strong></span>
      </div>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct_usado}%;background:${fillColor}"></div></div>
    </div>
    <div class="consumido-row">
      <span class="consumido-label">Actualizar consumido:</span>
      <input class="consumido-input" type="number" value="${consumido}" placeholder="0"
        onchange="updateConsumed(${d.id}, this.value)"
        oninput="updateConsumed(${d.id}, this.value)">
    </div>
    <div class="consumido-hint">Editá este valor cada vez que uses el descuento</div>
  </div>`;
}

function updateConsumed(id, val){
  const idx = discounts.findIndex(x => x.id===id);
  if(idx===-1) return;
  discounts[idx].consumido = Number(val) || 0;
  // Re-renderiza solo la barra sin borrar el input
  markChanged();
}

// ── EDITAR ──
function editDiscount(id){
  const d = discounts.find(x => x.id===id);
  if(!d){ showToast('No se encontró el descuento'); return; }
  editingIdx = id;
  fRubro  = d.rubro;
  fDays   = [...d.days];
  fPeriod = d.period || 'mensual';
  showTab('cargar');
  setTimeout(()=>{
    $('f-name').value  = d.name;
    $('f-bank').value  = d.bank;
    $('f-pct').value   = d.pct;
    $('f-min').value   = d.minBuy;
    $('f-max').value   = d.maxReturn;
    $('f-limit').value = d.limitAmount || '';
    buildCargarForm();
    $('edit-notice').style.display = 'block';
    $('submitBtn').textContent = '💾 Guardar cambios';
    $('submitBtn').classList.add('save-mode');
    $('form-msg').textContent = '';
  }, 50);
}

// ── FORM ──
function buildCargarForm(){ buildFormRubro(); buildDaysCheck(); buildPeriodSelect(); }
function buildFormRubro(){
  $('rubroSelect').innerHTML = RUBROS.map(r =>
    `<div class="rubro-opt ro-${r.id} ${fRubro===r.id?'selected':''}" onclick="selectFormRubro('${r.id}')">${r.icon} ${r.label}</div>`
  ).join('');
}
function buildDaysCheck(){
  $('daysCheck').innerHTML = DAYS.map((d,i) =>
    `<div class="day-check ${fDays.includes(i)?'selected':''}" onclick="toggleDay(${i})">${d}</div>`
  ).join('');
}
function buildPeriodSelect(){
  document.querySelectorAll('.period-opt').forEach(el => {
    const p = el.textContent.includes('Semanal') ? 'semanal' : 'mensual';
    el.classList.toggle('selected', fPeriod===p);
  });
}
function selectFormRubro(id){ fRubro=id; buildFormRubro(); }
function selectPeriod(p){ fPeriod=p; buildPeriodSelect(); }
function toggleDay(i){ fDays=fDays.includes(i)?fDays.filter(x=>x!==i):[...fDays,i]; buildDaysCheck(); }

function resetForm(){
  editingIdx=null; fDays=[]; fRubro=''; fPeriod='';
  ['f-name','f-bank','f-pct','f-min','f-max','f-limit'].forEach(id=>{ const e=$(id); if(e) e.value=''; });
  $('edit-notice').style.display='none';
  $('submitBtn').textContent='Agregar descuento';
  $('submitBtn').classList.remove('save-mode');
  $('form-msg').textContent='';
}

function submitForm(){
  const name=       $('f-name').value.trim();
  const bank=       $('f-bank').value.trim();
  const pct=        parseInt($('f-pct').value);
  const minBuy=     parseInt($('f-min').value);
  const maxReturn=  parseInt($('f-max').value);
  const limitAmount=parseInt($('f-limit').value);
  const msg=$('form-msg');
  if(!fRubro||!name||!bank||!fDays.length||isNaN(pct)||isNaN(minBuy)||isNaN(maxReturn)||isNaN(limitAmount)||!fPeriod){
    msg.style.color='#A32D2D'; msg.textContent='Completá todos los campos.'; return;
  }
  const obj={rubro:fRubro,name,bank,days:[...fDays],pct,minBuy,maxReturn,limitAmount,period:fPeriod,consumido:0};
  if(editingIdx!==null){
    const idx=discounts.findIndex(x=>x.id===editingIdx);
    if(idx!==-1) discounts[idx]={...obj, id:editingIdx, consumido:discounts[idx].consumido||0};
    msg.style.color='#27500A'; msg.textContent='✓ Editado correctamente.';
  } else {
    discounts.push({...obj, id:nextId++});
    msg.style.color='#27500A'; msg.textContent='✓ Agregado correctamente.';
  }
  markChanged();
  setTimeout(()=>{ resetForm(); buildCargarForm(); },2000);
}

// ── LISTA ──
function renderAllList(){
  const el=$('allList');
  if(!discounts.length){ el.innerHTML=`<div class="empty-state">No hay descuentos cargados</div>`; return; }
  const grouped=RUBROS.map(r=>({rubro:r,items:discounts.filter(d=>d.rubro===r.id)})).filter(g=>g.items.length);
  el.innerHTML=grouped.map(g=>`
    <p class="section-title-sm">${g.rubro.icon} ${g.rubro.label}</p>
    ${g.items.map(d=>`
      <div class="list-item card-r-${d.rubro}">
        <div class="list-info">
          <div class="list-name">${d.name} — ${d.bank} <strong>${d.pct}%</strong></div>
          <div class="list-sub">${d.days.map(i=>DAYS[i]).join(', ')} · mín $${d.minBuy.toLocaleString('es-AR')} · tope $${d.maxReturn.toLocaleString('es-AR')} · límite ${d.period} $${(d.limitAmount||0).toLocaleString('es-AR')} · consumido $${(d.consumido||0).toLocaleString('es-AR')}</div>
        </div>
        <div class="list-actions">
          <button class="btn-list-edit" onclick="editDiscount(${d.id})">✏️</button>
          <button class="del-btn" onclick="deleteDiscount(${d.id})">✕</button>
        </div>
      </div>`).join('')}
  `).join('');
}

function deleteDiscount(id){
  if(!confirm('¿Eliminar este descuento?')) return;
  discounts=discounts.filter(d=>d.id!==id);
  renderAllList();
  markChanged();
  showToast('Eliminado. Se guardará automáticamente.');
}

// ── EXPORT XLS ──
function exportXLS(){
  const rows=discounts.map(d=>({
    'Rubro':RUBRO_LABELS[d.rubro]||d.rubro, 'Comercio':d.name, 'Banco / Tarjeta':d.bank,
    'Días':d.days.map(i=>DAYS[i]).join(', '), 'Descuento (%)':d.pct,
    'Compra mínima ($)':d.minBuy, 'Tope por compra ($)':d.maxReturn,
    'Límite período ($)':d.limitAmount||0, 'Período':d.period, 'Consumido ($)':d.consumido||0
  }));
  const wb=XLSX.utils.book_new();
  const ws=XLSX.utils.json_to_sheet(rows);
  ws['!cols']=[{wch:14},{wch:18},{wch:18},{wch:22},{wch:13},{wch:16},{wch:16},{wch:16},{wch:10},{wch:14}];
  XLSX.utils.book_append_sheet(wb,ws,'Descuentos');
  XLSX.writeFile(wb,'mis-descuentos.xlsx');
}

function clearAll(){
  if(!confirm('¿Borrar datos locales de esta sesión?')) return;
  discounts=[]; nextId=1;
  pendingChanges=false;
  $('autosaveBar').style.display='none';
  renderDiscounts(); renderAllList();
  setSyncStatus('🗑️ Datos borrados',false);
}

// ── INIT ──
buildDaysCheck(); renderAll(); buildCargarForm();
loadFromSheets();
</script>
</body>
</html>
