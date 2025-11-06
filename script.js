/* ============================================================
   Lumen Storage Nexus — Full JS (expanded)
   - Sidebar collapse with localStorage persist
   - Logo hides when collapsed
   - Cards rendering + search + keyboard shortcuts
   - Accessible behaviors and helpful utilities
   - Additional helpers: last opened tool state, analytics stub,
     aria updates, and small UX polish (focus management)
   ============================================================ */

/* -------------------------
   DOM Refs
   ------------------------- */
const getStartedBtn = document.getElementById('getStartedBtn');
const landing = document.getElementById('landing');
const dashboard = document.getElementById('dashboard');

const hamb = document.getElementById('hambBtn');
const sidebarWrapper = document.getElementById('sidebarWrapper');

const hrBtn = document.getElementById('hrBtn');
const storageBtn = document.getElementById('storageBtn');
const vendorBtn = document.getElementById('vendorBtn');

const boxes = document.getElementById('boxes');
const searchInput = document.getElementById('searchInput');
const currentSectionTitle = document.getElementById('currentSectionTitle');
const logoImg = document.getElementById('logoImg');

/* -------------------------
   Defensive checks
   ------------------------- */
if (!boxes) throw new Error("Missing #boxes element in DOM. Please ensure your HTML matches the expected structure.");
if (!sidebarWrapper) throw new Error("Missing #sidebarWrapper in DOM.");

/* -------------------------
   Data (cards & sections)
   ------------------------- */
const illustrations = {
  'GOC Dashboard': 'https://img.icons8.com/fluency/96/teacher.png',
  'Remedy': 'https://img.icons8.com/fluency/96/plus-math.png',
  'ServiceNow My Support Desk': 'https://img.icons8.com/fluency/96/microsoft-teams.png',
  'Vendor Services': 'https://img.icons8.com/fluency/96/businessman.png',
  'defaultCloud': 'https://img.icons8.com/fluency/96/cloud.png',
  'defaultDoc': 'https://img.icons8.com/fluency/96/document.png',
  'defaultTool': 'https://img.icons8.com/fluency/96/settings.png',
  'defaultBox': 'https://img.icons8.com/fluency/96/box.png',
  'defaultKey': 'https://img.icons8.com/fluency/96/key.png',
  'defaultLab': 'https://img.icons8.com/fluency/96/test-tube.png',
  'defaultServer': 'https://img.icons8.com/fluency/96/server.png'
};

const items = {
  "Success Factors": { url: "#", desc: "Employee self-service, performance & goals platform." , img: "https://img.icons8.com/fluency/96/manager.png"},
  "Intranet": { url: "#", desc: "Company intranet for internal resources.", img: illustrations.defaultDoc },
  "Corporate Directory": { url: "#", desc: "Find colleagues & teams quickly.", img: "https://img.icons8.com/fluency/96/address-book.png" },
  "StoHRM": { url: "#", desc: "HR case management portal.", img: illustrations.defaultCloud },
  "Percipio": { url: "#", desc: "Learning & certification hub.", img: "https://ugc.production.linktr.ee/2kwN5I8OThSrPvdtfH0O_Logo%20Percipio.png?io=true&size=thumbnail-stack-v1_0"},
  "Lumen Stars": { url: "#", desc: "Employee recognition awards.", img: "https://tse2.mm.bing.net/th/id/OIP.4CiKR98iqTCyqD_NC13NYQAAAA?pid=Api&P=0&h=180" },
  "Lumen MEDIASSIST portal": { url: "#", desc: "Healthcare claims portal.", img: "https://tse2.mm.bing.net/th/id/OIP.yfvfj3syyy0RL8XIjkuz1gAAAA?pid=Api&P=0&h=180"},
  "ServiceNow My Support Desk": { url: "#", desc: "Submit IT support tickets.", img: "https://tse4.mm.bing.net/th/id/OIP.eVzTPOUGEf2THd6jesalCwHaDn?pid=Api&P=0&h=180" },

  "GOC Dashboard": { url: "#", desc: "Monitor network operations.", img: illustrations["GOC Dashboard"] },
  "Remedy": { url: "#", desc: "Incident & request management.", img: illustrations["Remedy"] },
  "IP Center": { url: "#", desc: "IP management tools.", img: illustrations.defaultCloud },
  "DCIM Portal": { url: "#", desc: "Data center asset management.", img: illustrations.defaultServer },
  "Colt Remedy": { url: "#", desc: "Vendor change requests.", img: illustrations.defaultTool },
  "Cyxtera Portal": { url: "#", desc: "Cloud vendor portal.", img: illustrations.defaultCloud },
  "Center Square": { url: "#", desc: "Facility operations.", img: illustrations.defaultBox },
  "HUGE": { url: "#", desc: "Storage orchestration.", img: illustrations.defaultTool },
  "Opstat": { url: "#", desc: "Operational reporting.", img: "https://img.icons8.com/fluency/96/combo-chart.png" },
  "Confluence Page": { url: "#", desc: "Documentation hub.", img: illustrations.defaultDoc },
  "IOSB Inventory": { url: "#", desc: "Inventory tracking.", img: illustrations.defaultBox },
  "Yoda Lab": { url: "#", desc: "Testing environment.", img: illustrations.defaultLab },
  "Password Savvis Portal": { url: "#", desc: "Secure passwords.", img: illustrations.defaultKey },
  "In storage sharepoint": { url: "#", desc: "Storage SharePoint.", img: "https://img.icons8.com/fluency/96/share.png" },
  "Storage Grid": { url: "#", desc: "Distributed storage controls.", img: illustrations.defaultServer },

  "Park Place": { url: "#", desc: "Hardware support RMAs.", img: "https://img.icons8.com/fluency/96/warehouse.png" },
  "Service Express": { url: "#", desc: "Vendor field maintenance.", img: "https://img.icons8.com/fluency/96/mechanic.png" },
  "NetApp Support": { url: "#", desc: "NetApp support portal.", img:"https://tse2.mm.bing.net/th/id/OIP.1_a8F5TDJ3sAOUTLoO2oLAHaE8?pid=Api&P=0&h=180" }
};

/* -------------------------
   Override specific logos with custom images
   ------------------------- */
items["Remedy"].img = "https://tse2.mm.bing.net/th/id/OIP.CR5SCW3hiad9DlLcKP8StgHaDI?pid=Api&P=0&h=180";
items["Park Place"].img = "https://tse3.mm.bing.net/th/id/OIP.nkq9PBUX0rWsxpG6Yv9CYgHaEl?pid=Api&P=0&h=180";
items["Service Express"].img = "https://tse4.mm.bing.net/th/id/OIP.wFoSDsbKEqkASYeJjYNJiAHaDY?pid=Api&P=0&h=180";

/* -------------------------
   Sections mapping
   ------------------------- */
const sections = {
  "HR Tools": [
    "Success Factors","Intranet","Corporate Directory","StoHRM","Percipio",
    "Lumen Stars","Lumen MEDIASSIST portal","ServiceNow My Support Desk"
  ],
  "Storage Tools": [
    "GOC Dashboard","Remedy","IP Center","DCIM Portal","Colt Remedy","Cyxtera Portal",
    "Center Square","HUGE","Opstat","Confluence Page","IOSB Inventory","Yoda Lab",
    "Password Savvis Portal","In storage sharepoint","Storage Grid"
  ],
  "Vendor Services": [
    "Park Place","Service Express","NetApp Support"
  ]
};

/* -------------------------
   Behaviour state
   ------------------------- */
let currentSection = "HR Tools";
let currentSectionLinks = sections[currentSection].slice();
const SIDEBAR_STATE_KEY = 'lumen_sidebar_collapsed';
const LAST_OPEN_KEY = 'lumen_last_opened_tool';

/* -------------------------
   Utility helpers
   ------------------------- */
const q = (sel, ctx = document) => ctx.querySelector(sel);
const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function debounce(fn, wait = 200){
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), wait); };
}

/* safe localStorage read/write with try/catch */
function storageGet(key, fallback = null){
  try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch(e){ return fallback; }
}
function storageSet(key, value){
  try { localStorage.setItem(key, value); } catch(e){ /* ignore */ }
}

/* accessibility focus helper */
function focusFirstCard(){
  const first = boxes.querySelector('.card .open-btn');
  if (first) first.focus();
}

/* transient toast (used for toggles/feedback) */
function transientNotice(msg, timeout = 1200){
  const n = document.createElement('div');
  n.textContent = msg;
  n.style.position = 'fixed';
  n.style.right = '18px';
  n.style.bottom = '18px';
  n.style.background = 'rgba(10,10,10,0.75)';
  n.style.color = 'white';
  n.style.padding = '10px 14px';
  n.style.borderRadius = '10px';
  n.style.zIndex = 9999;
  n.style.transition = 'opacity .18s linear';
  document.body.appendChild(n);
  setTimeout(()=> n.style.opacity = '0', timeout - 200);
  setTimeout(()=> n.remove(), timeout);
}

/* small analytics stub: logs interactions to console (replace with real analytics if needed) */
function analyticsLog(eventName, meta = {}){ try { console.info(`[analytics] ${eventName}`, meta); } catch(e) {} }

/* -------------------------
   Render boxes/cards
   ------------------------- */
function showBoxes(list){
  boxes.innerHTML = '';
  if (!list || list.length === 0){
    const no = document.createElement('div');
    no.className = 'no-results';
    no.textContent = 'No tools found. Try a different search term.';
    boxes.appendChild(no);
    return;
  }

  list.forEach((name) => {
    const it = items[name] || {url:"#", desc:"No description", img: illustrations.defaultTool};
    const card = document.createElement('div');
    card.className = 'card fade-in';
    card.setAttribute('role','article');
    card.setAttribute('aria-label', name);
    card.tabIndex = 0;

    card.innerHTML = `
      <img src="${it.img}" class="illustration" alt="${name} icon">
      <h3>${name}</h3>
      <p>${it.desc}</p>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button class="open-btn" data-url="${it.url}" aria-label="Open ${name}">Open</button>
      </div>
    `;

    card.addEventListener('click', (ev) => {
      if (ev.target && ev.target.classList.contains('open-btn')) return;
      analyticsLog('card_open_click', { name });
      openTool(it, name);
    });

    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openTool(it,name); }
    });

    const btn = card.querySelector('.open-btn');
    if (btn){
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const u = e.currentTarget.getAttribute('data-url') || '#';
        analyticsLog('open_button_click', { name, url: u });
        openTool(it, name);
      });
    }

    boxes.appendChild(card);
  });

  const last = storageGet(LAST_OPEN_KEY, null);
  if (last) {
    const all = qa('.card');
    all.forEach(c => {
      if (c.textContent.includes(last)) {
        c.style.boxShadow = '0 20px 80px rgba(0,0,0,0.65)';
      }
    });
  }
}

/* -------------------------
   open tool
   ------------------------- */
function openTool(item, name){
  try { storageSet(LAST_OPEN_KEY, name); } catch(e){}
  const url = item.url || '#';
  if (url === '#' || url.trim() === '') { transientNotice(`Would open: ${name}`); analyticsLog('open_placeholder', { name }); }
  else { window.open(url, "_blank"); }
}

/* -------------------------
   Section management
   ------------------------- */
function activateSection(name){
  if (!sections[name]) return;
  currentSection = name;
  currentSectionLinks = sections[name].slice();
  if (currentSectionTitle) currentSectionTitle.textContent = name;
  if (searchInput) searchInput.value = '';
  showBoxes(currentSectionLinks);
  highlightActiveNav(name);
  analyticsLog('section_activated', { name });
}

function highlightActiveNav(name){
  qa('#sidebarWrapper .sidebar a').forEach(a => {
    const txt = a.textContent.trim().toLowerCase();
    if (txt.includes(name.toLowerCase().split(' ')[0])) { a.style.background = 'rgba(255,255,255,0.02)'; a.setAttribute('aria-current','page'); }
    else { a.style.background = 'transparent'; a.removeAttribute('aria-current'); }
  });
}

/* -------------------------
   Sidebar toggle & state
   ------------------------- */
function setCollapsed(collapsed){
  if (collapsed) sidebarWrapper.classList.add('collapsed');
  else sidebarWrapper.classList.remove('collapsed');

  storageSet(SIDEBAR_STATE_KEY, collapsed ? '1':'0');

  if (hamb) hamb.setAttribute('aria-expanded', collapsed ? 'false':'true');

  if (logoImg){
    if (collapsed){ logoImg.style.opacity = 0; logoImg.style.width = '0px'; logoImg.setAttribute('aria-hidden','true'); }
    else { logoImg.style.opacity=1; logoImg.style.width=''; logoImg.removeAttribute('aria-hidden'); }
  }
  analyticsLog('sidebar_toggled',{collapsed});
}

function initSidebarFromStorage(){
  let collapsed = false;
  try { const val = storageGet(SIDEBAR_STATE_KEY,null); collapsed = (val==='1'); } catch(e){}
  setCollapsed(collapsed);
}

function toggleSidebar(){
  const isCollapsed = sidebarWrapper.classList.contains('collapsed');
  setCollapsed(!isCollapsed);
  transientNotice(isCollapsed ? 'Sidebar expanded':'Sidebar collapsed');
}

/* -------------------------
   Search handling
   ------------------------- */
function handleSearchInput(){
  const term = (searchInput?.value||'').trim().toLowerCase();
  if (!term){ showBoxes(currentSectionLinks); return; }
  const filtered = currentSectionLinks.filter(x=>x.toLowerCase().includes(term));
  showBoxes(filtered);
}
const searchDebounced = debounce(handleSearchInput,160);

/* -------------------------
   Keyboard shortcuts
   ------------------------- */
function onKeyDown(e){
  const active = document.activeElement;
  const typing = active && (active.tagName==='INPUT'||active.tagName==='TEXTAREA'||active.isContentEditable);
  if (!typing){
    if (e.key==='/' && searchInput){ e.preventDefault(); searchInput.focus(); return; }
    if ((e.key==='g'||e.key==='G')&&boxes){ focusFirstCard(); return; }
    if (e.key==='b'||e.key==='B'){ e.preventDefault(); toggleSidebar(); return; }
    if (e.key==='?'){ transientNotice('Shortcuts: / (search), g (first card), b (toggle sidebar)'); return; }
  } else { if (e.key==='Escape'){ if(searchInput){ searchInput.value=''; searchInput.blur(); showBoxes(currentSectionLinks); transientNotice('Search cleared'); } return; } }
}

/* -------------------------
   Misc UX helpers
   ------------------------- */
function ensureDashboardShown(){
  if(landing&&dashboard){ landing.style.display='none'; dashboard.style.display='block'; activateSection(currentSection); }
}

/* -------------------------
   Initialization
   ------------------------- */
function init(){
  if(getStartedBtn){ getStartedBtn.addEventListener('click',()=>{ if(landing&&dashboard){ landing.style.display='none'; dashboard.style.display='block'; activateSection(currentSection); window.scrollTo({top:0,behavior:'smooth'}); analyticsLog('get_started_clicked',{}); } }); }

  if(hamb){ hamb.addEventListener('click',(ev)=>{ ev.preventDefault(); toggleSidebar(); }); }

  if(hrBtn) hrBtn.addEventListener('click', e=>{ e.preventDefault(); activateSection('HR Tools'); });
  if(storageBtn) storageBtn.addEventListener('click', e=>{ e.preventDefault(); activateSection('Storage Tools'); });
  if(vendorBtn) vendorBtn.addEventListener('click', e=>{ e.preventDefault(); activateSection('Vendor Services'); });

  if(searchInput){
    searchInput.addEventListener('input', searchDebounced);
    searchInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); const firstBtn=boxes.querySelector('.card .open-btn'); if(firstBtn) firstBtn.focus(); } });
  }

  document.addEventListener('keydown', onKeyDown);

  window.addEventListener('resize', debounce(()=>{ if(window.innerWidth<=640){ setCollapsed(true); } else { initSidebarFromStorage(); } },250));

  document.addEventListener('click', e=>{ /* future dropdowns */ });

  initSidebarFromStorage();
  activateSection(currentSection);

  if(!landing){ dashboard.style.display='block'; }

  const last = storageGet(LAST_OPEN_KEY,null);
  if(last){ analyticsLog('restored_last_open',{last}); }
}

/* -------------------------
   DOM ready
   ------------------------- */
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
else{ init(); }

/* -------------------------
   Export helpers for console
   ------------------------- */
window.lumen = { setCollapsed, toggleSidebar, activateSection, showBoxes, getState:()=>({ collapsed: sidebarWrapper.classList.contains('collapsed'), section: currentSection, lastOpened: storageGet(LAST_OPEN_KEY,null) }) };
