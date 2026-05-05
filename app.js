// ── CONFIGURACIÓN ──
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz0wcvN0TAWmuKgtXLOnIrkkLemn3M778efYDzr7e6r0JM6vtRWZ_zIRg9kMhL22emc/exec';
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

// ── BRAND LOGOS ──
const BRAND_LOGOS = {
  'jumbo':      { domain: 'jumbo.com.ar',      colors: ['#00873C','#43a047'] },
  'carrefour':  { domain: 'carrefour.com.ar',  colors: ['#1746A2','#1e88e5'] },
  'dia':        { domain: 'diaonline.supermercadosdia.com.ar', colors: ['#E31E24','#ef5350'] },
  'disco':      { domain: 'disco.com.ar',      colors: ['#8B2F8F','#ab47bc'], local: 'DISCO VEA.png' },
  'vea':        { domain: 'vea.com.ar',        colors: ['#F26522','#ff7043'], local: 'DISCO VEA.png' },
  'coto':       { domain: 'cotodigital3.com.ar', colors: ['#D50000','#e53935'], local: 'COTO.png' },
  'diarco':     { domain: 'diarco.com.ar',     colors: ['#E8830C','#ffa726'], local: 'DIARCO.png' },
  'farmacity':  { domain: 'farmacity.com',     colors: ['#00A551','#66bb6a'] },
  'havanna':    { domain: 'havanna.com.ar',    colors: ['#6D3A1E','#8d6e63'], local: 'HAVANNA.png' },
  'freddo':     { domain: 'freddo.com.ar',     colors: ['#00B4E6','#29b6f6'] },
  'vitalcer':   { domain: 'vitalcer.com',      colors: ['#0055A5','#42a5f5'] },
  'desayunos':  { domain: 'havanna.com.ar',    colors: ['#6D3A1E','#8d6e63'], local: 'DESAYUNOS.png' },
  'starbucks':  { domain: 'starbucks.com',     colors: ['#00704A','#2e7d32'] },
  'mcdonald':   { domain: 'mcdonalds.com.ar',  colors: ['#FFC72C','#f9a825'] },
  'burger':     { domain: 'burgerking.com.ar', colors: ['#D62300','#e65100'] },
  'rapipago':   { domain: 'rapipago.com.ar',   colors: ['#00529B','#1565c0'] },
  'pedidosya':  { domain: 'pedidosya.com.ar',  colors: ['#FA0050','#e91e63'] },
  'changomas':  { domain: 'changomas.com.ar',  colors: ['#ED1C24','#f44336'] },
  'easy':       { domain: 'easy.com.ar',       colors: ['#E8490F','#ff5722'] },
};
const RUBRO_COLORS = {
  super:    ['#16a34a','#22c55e'],
  cercania: ['#2563eb','#3b82f6'],
  farmacia: ['#dc2626','#ef4444'],
  cafeteria:['#d97706','#f59e0b'],
};

function getBrandInfo(name) {
  const lower = name.toLowerCase();
  for (const [brand, info] of Object.entries(BRAND_LOGOS)) {
    if (lower.includes(brand)) return info;
  }
  return null;
}

function brandLogoHTML(name, rubro, size) {
  const sz = size || 44;
  const rad = sz === 44 ? '12px' : '8px';
  const brand = getBrandInfo(name);
  const initial = name.charAt(0).toUpperCase();
  const colors = brand ? brand.colors : (RUBRO_COLORS[rubro] || ['#6b7280','#9ca3af']);

  const cls = sz === 44 ? 'brand-logo' : 'list-logo';
  const initCls = sz === 44 ? 'brand-initials' : 'list-initials';

  if (brand) {
    let url = `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`;
    if (brand.local) url = brand.local; // Use local image if specified

    return `<img src="${url}" class="${cls}" style="width:${sz}px;height:${sz}px;border-radius:${rad};object-fit:contain" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="${initCls}" style="display:none;width:${sz}px;height:${sz}px;border-radius:${rad};background:linear-gradient(135deg,${colors[0]},${colors[1]})">${initial}</div>`;
  }
  return `<div class="${initCls}" style="width:${sz}px;height:${sz}px;border-radius:${rad};background:linear-gradient(135deg,${colors[0]},${colors[1]})">${initial}</div>`;
}

// ── STATE ──
let discounts=[], nextId=1;
let selectedDay=new Date().getDay(); selectedDay=selectedDay===0?6:selectedDay-1;
let activeRubro='all';
let fDays=[], fRubro='', fPeriod='', editingIdx=null;
let pendingChanges=false, autoSaveTimer=null, countdownInterval=null, countdown=60;

const R=id=>RUBROS.find(r=>r.id===id);
const $=id=>document.getElementById(id);

// ── THEME ──
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  $('themeToggle').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  $('themeToggle').textContent = saved === 'dark' ? '☀️' : '🌙';
}

// ── TOAST ──
function showToast(msg) {
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── AUTOGUARDADO ──
function markChanged() {
  pendingChanges=true;
  $('autosaveBar').style.display='flex';
  if(countdownInterval) clearInterval(countdownInterval);
  if(autoSaveTimer) clearTimeout(autoSaveTimer);
  countdown=60;
  $('autoCountdown').textContent=countdown;
  countdownInterval=setInterval(()=>{
    countdown--;
    $('autoCountdown').textContent=countdown;
    if(countdown<=0) clearInterval(countdownInterval);
  },1000);
  autoSaveTimer=setTimeout(async()=>{
    if(pendingChanges) await saveToSheets(true);
  },60000);
}

// ── GOOGLE SHEETS ──
async function loadFromSheets() {
  setSyncStatus('⏳ Cargando...', true);
  try {
    const res = await fetch(SHEETS_URL + '?t=' + Date.now(), {redirect:'follow'});
    const text = await res.text();
    let rows;
    try { rows = JSON.parse(text); } catch(e){ throw new Error('No se pudo leer la respuesta'); }
    if(!Array.isArray(rows)) throw new Error('Formato inesperado');
    discounts = rows
      .filter(r => r['Comercio'] && String(r['Comercio']).trim() !== '')
      .map((r, i) => {
        const diasStr = (r['Días'] || '').toString();
        const days = diasStr.split(',').map(s => DAYS.indexOf(s.trim())).filter(x => x >= 0);
        return {
          id: i + 1,
          rubro: RUBRO_IDS[String(r['Rubro']||'').trim()] || 'super',
          name: String(r['Comercio']||'').trim(),
          bank: String(r['Banco / Tarjeta']||'').trim(),
          days: days.length ? days : [0],
          pct: Number(r['Descuento (%)']) || 0,
          minBuy: Number(r['Compra mínima ($)']) || 0,
          maxReturn: Number(r['Tope por compra ($)']) || 0,
          limitAmount: Number(r['Límite período ($)']) || 0,
          period: String(r['Período']||'mensual').toLowerCase().trim(),
          consumido: Number(r['Consumido ($)']) || 0,
        };
      });
    nextId = discounts.length + 1;
    pendingChanges = false;
    $('autosaveBar').style.display='none';
    const now = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    setSyncStatus('✅ Actualizado ' + now, false);
    renderDiscounts(); renderAllList(); renderSummary();
    showToast('✅ ' + discounts.length + ' descuentos cargados');
  } catch(e) {
    setSyncStatus('❌ ' + e.message, false);
    showToast('❌ Error: ' + e.message);
  }
}

async function saveToSheets(auto=false) {
  if(!discounts.length){ if(!auto) showToast('No hay descuentos para guardar'); return; }
  const btn = $('btnGuardar');
  if(btn){ btn.disabled=true; btn.innerHTML='<span class="spinner"></span> Guardando...'; }
  try {
    const rows = discounts.map(d => [
      RUBRO_LABELS[d.rubro] || d.rubro, d.name, d.bank,
      d.days.map(i => DAYS[i]).join(', '), d.pct, d.minBuy,
      d.maxReturn, d.limitAmount || 0, d.period, d.consumido || 0
    ]);
    const url = SHEETS_URL + '?action=save&data=' + encodeURIComponent(JSON.stringify(rows));
    const res = await fetch(url, {redirect:'follow'});
    const text = await res.text();
    let result;
    try { result = JSON.parse(text); } catch(e){ result = {ok: text.includes('ok')}; }
    if(result.ok) {
      pendingChanges = false;
      $('autosaveBar').style.display = 'none';
      if(countdownInterval) clearInterval(countdownInterval);
      const now = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
      setSyncStatus('✅ Guardado ' + now, false);
      if(!auto) showToast('✅ Guardado en Google Sheets');
      else showToast('🔄 Autoguardado a las ' + now);
    } else { throw new Error(result.error || 'Respuesta inesperada'); }
  } catch(e) {
    showToast('❌ Error al guardar: ' + e.message);
    setSyncStatus('❌ Error al guardar', false);
  }
  if(btn){ btn.disabled=false; btn.innerHTML='⬆️ Guardar ahora en Sheets'; }
}

function setSyncStatus(msg, loading) {
  $('syncStatus').innerHTML = loading ? `<span class="spinner"></span> ${msg}` : msg;
  $('btnSync').disabled = loading;
}

// ── TABS ──
function showTab(tab) {
  ['hoy','cargar','lista','datos'].forEach(t => $('screen-'+t).style.display = t===tab?'block':'none');
  document.querySelectorAll('.tab').forEach((el,i) => el.classList.toggle('active', ['hoy','cargar','lista','datos'][i]===tab));
  if(tab==='hoy') renderAll();
  if(tab==='lista') renderAllList();
  if(tab==='cargar' && editingIdx===null){ resetForm(); buildCargarForm(); }
  if(tab==='cargar' && editingIdx!==null){ buildCargarForm(); }
}

// ── HOY ──
function renderAll(){ renderDaySelector(); renderRubroFilter(); renderDiscounts(); renderSummary(); }

function renderSummary() {
  const todayList = discounts.filter(d => d.days.includes(selectedDay));
  const totalAhorro = todayList.reduce((s,d) => s + Math.max(0, (d.limitAmount||0) - (d.consumido||0)), 0);
  $('summaryBar').innerHTML = `
    <div class="summary-pill"><div class="num">${todayList.length}</div><div class="lbl">Disponibles</div></div>
    <div class="summary-pill"><div class="num">$${totalAhorro.toLocaleString('es-AR')}</div><div class="lbl">Ahorro restante</div></div>
  `;
}

function renderDaySelector() {
  $('daySelector').innerHTML = DAYS.map((d,i) =>
    `<button class="day-btn ${i===selectedDay?'active':''}" onclick="selectDay(${i})">${d}</button>`
  ).join('');
}
function renderRubroFilter() {
  $('rubroFilter').innerHTML =
    `<button class="rubro-btn ${activeRubro==='all'?'active':''}" onclick="setRubro('all')">Todos</button>` +
    RUBROS.map(r => `<button class="rubro-btn r-${r.id} ${activeRubro===r.id?'active':''}" onclick="setRubro('${r.id}')">${r.icon} ${r.label}</button>`).join('');
}
function setRubro(id){ activeRubro=id; renderRubroFilter(); renderDiscounts(); }
function selectDay(i){ selectedDay=i; renderDaySelector(); renderDiscounts(); renderSummary(); }

function renderDiscounts() {
  const el = $('discountList');
  if(!discounts.length){
    el.innerHTML=`<div class="empty-state">Sin descuentos cargados.<br><br><button class="btn-sync" onclick="loadFromSheets()">🔄 Cargar desde Sheets</button></div>`;
    return;
  }
  let list = discounts.filter(d => d.days.includes(selectedDay));
  if(activeRubro !== 'all') list = list.filter(d => d.rubro===activeRubro);
  if(!list.length){ el.innerHTML=`<div class="empty-state">Sin descuentos para el ${DAYS_FULL[selectedDay]}</div>`; return; }
  el.innerHTML = list.map((d,i) => cardHTML(d,i)).join('');
}

function cardHTML(d, idx) {
  const r = R(d.rubro);
  const consumido = d.consumido || 0;
  const restante = Math.max(0, (d.limitAmount||0) - consumido);
  const pct_usado = d.limitAmount ? Math.min(100, Math.round(consumido/d.limitAmount*100)) : 0;
  const fillColor = pct_usado>=100 ? 'var(--farmacia)' : pct_usado>=75 ? 'var(--cafeteria)' : 'var(--super)';
  const logo = brandLogoHTML(d.name, d.rubro, 44);
  const delay = Math.min(idx * 0.06, 0.4);

  return `<div class="discount-card card-r-${d.rubro}" style="animation-delay:${delay}s">
    <div class="card-header">
      <div class="card-left">
        ${logo}
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
        <span style="color:${restante===0?'var(--farmacia)':'var(--super)'}">Resta: <strong>$${restante.toLocaleString('es-AR')}</strong></span>
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

function updateConsumed(id, val) {
  const idx = discounts.findIndex(x => x.id===id);
  if(idx===-1) return;
  discounts[idx].consumido = Number(val) || 0;
  markChanged();
}

// ── EDITAR ──
function editDiscount(id) {
  const d = discounts.find(x => x.id===id);
  if(!d){ showToast('No se encontró el descuento'); return; }
  editingIdx = id;
  fRubro = d.rubro; fDays = [...d.days]; fPeriod = d.period || 'mensual';
  showTab('cargar');
  setTimeout(()=>{
    $('f-name').value = d.name; $('f-bank').value = d.bank;
    $('f-pct').value = d.pct; $('f-min').value = d.minBuy;
    $('f-max').value = d.maxReturn; $('f-limit').value = d.limitAmount || '';
    buildCargarForm();
    $('edit-notice').style.display = 'block';
    $('submitBtn').textContent = '💾 Guardar cambios';
    $('submitBtn').classList.add('save-mode');
    $('form-msg').textContent = '';
  }, 50);
}

// ── FORM ──
function buildCargarForm(){ buildFormRubro(); buildDaysCheck(); buildPeriodSelect(); }
function buildFormRubro() {
  $('rubroSelect').innerHTML = RUBROS.map(r =>
    `<div class="rubro-opt ro-${r.id} ${fRubro===r.id?'selected':''}" onclick="selectFormRubro('${r.id}')">${r.icon} ${r.label}</div>`
  ).join('');
}
function buildDaysCheck() {
  $('daysCheck').innerHTML = DAYS.map((d,i) =>
    `<div class="day-check ${fDays.includes(i)?'selected':''}" onclick="toggleDay(${i})">${d}</div>`
  ).join('');
}
function buildPeriodSelect() {
  document.querySelectorAll('.period-opt').forEach(el => {
    const p = el.textContent.includes('Semanal') ? 'semanal' : 'mensual';
    el.classList.toggle('selected', fPeriod===p);
  });
}
function selectFormRubro(id){ fRubro=id; buildFormRubro(); }
function selectPeriod(p){ fPeriod=p; buildPeriodSelect(); }
function toggleDay(i){ fDays=fDays.includes(i)?fDays.filter(x=>x!==i):[...fDays,i]; buildDaysCheck(); }

function resetForm() {
  editingIdx=null; fDays=[]; fRubro=''; fPeriod='';
  ['f-name','f-bank','f-pct','f-min','f-max','f-limit'].forEach(id=>{ const e=$(id); if(e) e.value=''; });
  $('edit-notice').style.display='none';
  $('submitBtn').textContent='Agregar descuento';
  $('submitBtn').classList.remove('save-mode');
  $('form-msg').textContent='';
}

function submitForm() {
  const name=$('f-name').value.trim(), bank=$('f-bank').value.trim();
  const pct=parseInt($('f-pct').value), minBuy=parseInt($('f-min').value);
  const maxReturn=parseInt($('f-max').value), limitAmount=parseInt($('f-limit').value);
  const msg=$('form-msg');
  if(!fRubro||!name||!bank||!fDays.length||isNaN(pct)||isNaN(minBuy)||isNaN(maxReturn)||isNaN(limitAmount)||!fPeriod){
    msg.style.color='var(--farmacia)'; msg.textContent='Completá todos los campos.'; return;
  }
  const obj={rubro:fRubro,name,bank,days:[...fDays],pct,minBuy,maxReturn,limitAmount,period:fPeriod,consumido:0};
  if(editingIdx!==null){
    const idx=discounts.findIndex(x=>x.id===editingIdx);
    if(idx!==-1) discounts[idx]={...obj, id:editingIdx, consumido:discounts[idx].consumido||0};
    msg.style.color='var(--super)'; msg.textContent='✓ Editado correctamente.';
  } else {
    discounts.push({...obj, id:nextId++});
    msg.style.color='var(--super)'; msg.textContent='✓ Agregado correctamente.';
  }
  markChanged();
  setTimeout(()=>{ resetForm(); buildCargarForm(); },2000);
}

// ── LISTA ──
function renderAllList() {
  const el=$('allList');
  if(!discounts.length){ el.innerHTML=`<div class="empty-state">No hay descuentos cargados</div>`; return; }
  const grouped=RUBROS.map(r=>({rubro:r,items:discounts.filter(d=>d.rubro===r.id)})).filter(g=>g.items.length);
  el.innerHTML=grouped.map(g=>`
    <p class="section-title-sm">${g.rubro.icon} ${g.rubro.label}</p>
    ${g.items.map(d=>`
      <div class="list-item card-r-${d.rubro}">
        <div class="list-info">
          ${brandLogoHTML(d.name, d.rubro, 32)}
          <div class="list-text">
            <div class="list-name">${d.name} — ${d.bank} <strong>${d.pct}%</strong></div>
            <div class="list-sub">${d.days.map(i=>DAYS[i]).join(', ')} · mín $${d.minBuy.toLocaleString('es-AR')} · tope $${d.maxReturn.toLocaleString('es-AR')} · límite ${d.period} $${(d.limitAmount||0).toLocaleString('es-AR')} · consumido $${(d.consumido||0).toLocaleString('es-AR')}</div>
          </div>
        </div>
        <div class="list-actions">
          <button class="btn-list-edit" onclick="editDiscount(${d.id})">✏️</button>
          <button class="del-btn" onclick="deleteDiscount(${d.id})">✕</button>
        </div>
      </div>`).join('')}
  `).join('');
}

function deleteDiscount(id) {
  if(!confirm('¿Eliminar este descuento?')) return;
  discounts=discounts.filter(d=>d.id!==id);
  renderAllList(); markChanged();
  showToast('Eliminado. Se guardará automáticamente.');
}

// ── EXPORT ──
function exportXLS() {
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

function clearAll() {
  if(!confirm('¿Borrar datos locales de esta sesión?')) return;
  discounts=[]; nextId=1; pendingChanges=false;
  $('autosaveBar').style.display='none';
  renderDiscounts(); renderAllList(); renderSummary();
  setSyncStatus('🗑️ Datos borrados',false);
}

// ── INIT ──
initTheme();
buildDaysCheck(); renderAll(); buildCargarForm();
loadFromSheets();
