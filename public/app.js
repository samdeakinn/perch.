(function(){if(!document.getElementById('appStats'))return;

var STORE='perch_app_data',NSKEY='perch_app_notify';

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}

function load(){try{var d=localStorage.getItem(STORE);return d?JSON.parse(d):{items:[],settings:{notifications:true}}}catch(e){return{items:[],settings:{notifications:true}}}}
function save(data){try{localStorage.setItem(STORE,JSON.stringify(data))}catch(e){}}

var data=load();
var currentFilter='all';
var currentView='list';
var calYear,calMonth;

function persist(){data.settings.notifications=document.getElementById('appNotifyToggle').checked;save(data);renderAll();}

function getAnnual(it){return it.period==='month'?it.amount*12:it.amount;}
function getVerdict(it){
  if(it.change&&it.change!=='stable'){
    var n=parseFloat(it.change);if(!isNaN(n)&&n>15)return'renegotiate';if(!isNaN(n)&&n>0)return'renegotiate';
  }
  var now=Date.now(),rd=new Date(it.renewsAt).getTime();
  if(rd<now)return'expired';
  if(it.notes&&it.notes.toLowerCase().indexOf('unused')>-1)return'cancel';
  if(it.category==='subscription'&&getAnnual(it)>600)return'cancel';
  return'renew';
}
function getFiltered(){return data.items.filter(function(it){return currentFilter==='all'||it.category===currentFilter;}).sort(function(a,b){return new Date(a.renewsAt).getTime()-new Date(b.renewsAt).getTime();});}

function addItem(item){
  item.id=uid();item.createdAt=Date.now();item.history=item.history||[];item.verdict=item.verdict||getVerdict(item);item.status='active';
  if(!item.category){
    var p=item.provider.toLowerCase();
    if(/insur|policy|claim/.test(p))item.category='insurance';
    else if(/broadband|virgin|bt|sky|talktalk|ee|vodafone|three|o2|mobile|sim|wifi|internet|utility|energy/.test(p))item.category='broadband';
    else if(/domain|hosting|namecheap|godaddy|cloudflare/.test(p))item.category='domain';
    else if(/gym|netflix|spotify|apple|google|adobe|microsoft|amazon|disney|cloud|saas|software|app|sub/.test(p))item.category='subscription';
    else item.category='other';
  }
  data.items.unshift(item);
  data.items.sort(function(a,b){return new Date(a.renewsAt).getTime()-new Date(b.renewsAt).getTime();});
  persist();
}

function updateHistory(item,newAmount){
  if(!item.history)item.history=[];
  if(item.amount&&item.amount!==newAmount){item.history.push({date:new Date().toISOString().slice(0,10),amount:item.amount});}
  item.amount=parseFloat(newAmount)||0;
  item.verdict=getVerdict(item);
}

function parseEmail(text){
  var result={provider:'',amount:0,period:'year',renewsAt:'',change:'stable',category:'other'};
  if(!text||text.trim().length<10)return null;
  var t=text.toLowerCase();
  // Provider detection
  var providers=['admiral','direct line','aviva','churchill','lvhastings','axa','more than','tesco bank','saga','ageas','esure','sheilas wheels','virgin media','virgin','bt','sky','talktalk','ee','vodafone','three','o2','plusnet','hyperoptic','zen','namecheap','godaddy','cloudflare','google','adobe','microsoft','apple','spotify','netflix','disney','amazon','puregym','the gym','david lloyd','nuffield health'];
  for(var i=0;i<providers.length;i++){if(t.indexOf(providers[i])>-1){result.provider=providers[i].replace(/\b\w/g,function(c){return c.toUpperCase();});break;}}
  if(!result.provider){
    var lines=text.split('\n');
    for(var j=0;j<Math.min(lines.length,5);j++){var l=lines[j].trim();if(l.length>3&&l.length<60&&l.indexOf('re:')===-1&&l.indexOf('subject')===-1&&l.indexOf('from:')===-1&&l.indexOf('to:')===-1){result.provider=l;break;}}
  }
  // Amount detection
  var amtMatch=text.match(/[£$€]\s*([\d,]+(?:\.\d{2}))/);
  if(amtMatch){result.amount=parseFloat(amtMatch[1].replace(/,/g,''));}
  if(!result.amount){var numMatch=text.match(/([\d,]+\.\d{2})\s*(?:per\s*(year|month|yr|mo|annum|annual))/i);if(numMatch){result.amount=parseFloat(numMatch[1].replace(/,/g,''));if(numMatch[2]&&/month|mo/.test(numMatch[2].toLowerCase()))result.period='month';}}
  if(!result.amount){var anyMatch=text.match(/£([\d,]+(?:\.\d{2})?)/);if(anyMatch)result.amount=parseFloat(anyMatch[1].replace(/,/g,''));}
  // Period detection
  if(/per\s*month|\/mo|monthly|p\/m|per\s*calendar\s*month/i.test(text))result.period='month';
  else if(/per\s*year|\/yr|annually|per\s*annum|annual|p\/a/i.test(text))result.period='year';
  // Date detection
  var dateMatch=text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})/i);
  if(dateMatch){
    var months={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:0,january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
    var m=months[dateMatch[2].toLowerCase()];var d=parseInt(dateMatch[1],10);var y=parseInt(dateMatch[3],10);
    result.renewsAt=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  }else{var isoMatch=text.match(/(\d{4})-(\d{2})-(\d{2})/);if(isoMatch)result.renewsAt=isoMatch[1]+'-'+isoMatch[2]+'-'+isoMatch[3];}
  if(!result.renewsAt){
    var renewMatch=text.match(/renew(?:s|al)?\s*(?:on|date)?[:\s]*(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4})/i);
    if(renewMatch){var dd=parseInt(renewMatch[1],10);var mm=parseInt(renewMatch[2],10);var yy=parseInt(renewMatch[3],10);if(yy<100)yy+=2000;result.renewsAt=yy+'-'+String(mm).padStart(2,'0')+'-'+String(dd).padStart(2,'0');}
  }
  // Change detection
  var changeMatch=text.match(/[+\u2191]\s*(\d+(?:\.\d+)?)\s*%/);
  if(changeMatch){result.change='+'+changeMatch[1]+'%';}else if(/stable|no change|unchanged|same price|price unchanged|price is the same/i.test(text)){result.change='stable';}
  else{var fromTo=text.match(/from\s*[£$€]?\s*([\d,]+(?:\.\d{2})?)\s*(?:to|up to|now)\s*[£$€]?\s*([\d,]+(?:\.\d{2})?)/i);
    if(fromTo){var fromAmt=parseFloat(fromTo[1].replace(/,/g,''));var toAmt=parseFloat(fromTo[2].replace(/,/g,''));if(fromAmt>0){var pc=Math.round((toAmt-fromAmt)/fromAmt*100);result.change=(pc>=0?'+':'')+pc+'%';}}
  }
  if(!result.amount){result.amount=0;}
  return result;
}

// ─── UI References ───
var el={};
function cacheUI(){
  el.addTabs=document.querySelectorAll('.app-add-tab');
  el.addBodies=document.querySelectorAll('.app-add-body');
  el.pasteInput=document.getElementById('appPasteInput');
  el.parseBtn=document.getElementById('appParseBtn');
  el.parseResult=document.getElementById('appParseResult');
  el.dropZone=document.getElementById('appDropZone');
  el.fileInput=document.getElementById('appFileInput');
  el.uploadResult=document.getElementById('appUploadResult');
  el.manualForm=document.getElementById('appManualForm');
  el.stats={total:document.getElementById('appStatTotal'),annual:document.getElementById('appStatAnnual'),action:document.getElementById('appStatAction'),saved:document.getElementById('appStatSaved')};
  el.filters=document.getElementById('appFilters');
  el.items=document.getElementById('appItems');
  el.empty=document.getElementById('appEmpty');
  el.list=document.getElementById('appList');
  el.calendar=document.getElementById('appCalendar');
  el.calGrid=document.getElementById('calGrid');
  el.calMonth=document.getElementById('calMonth');
  el.calPrev=document.getElementById('calPrev');
  el.calNext=document.getElementById('calNext');
  el.digest=document.getElementById('appDigest');
  el.digestContent=document.getElementById('digestContent');
  el.digestEmpty=document.getElementById('digestEmpty');
  el.digestDate=document.getElementById('digestDate');
  el.exportBtn=document.getElementById('appExportBtn');
  el.clearBtn=document.getElementById('appClearBtn');
  el.notifyToggle=document.getElementById('appNotifyToggle');
}
cacheUI();

// ─── Tab Switching ───
el.addTabs.forEach(function(t){t.addEventListener('click',function(){
  el.addTabs.forEach(function(x){x.classList.remove('active');});t.classList.add('active');
  el.addBodies.forEach(function(x){x.classList.remove('active');});
  var mode=t.getAttribute('data-mode');
  if(mode==='paste')document.getElementById('appAddPaste').classList.add('active');
  else if(mode==='upload')document.getElementById('appAddUpload').classList.add('active');
  else document.getElementById('appAddManual').classList.add('active');
});});

// ─── Paste & Parse ───
el.parseBtn.addEventListener('click',function(){
  var text=el.pasteInput.value.trim();if(!text)return;
  var parsed=parseEmail(text);
  if(!parsed||!parsed.provider||!parsed.amount){
    el.parseResult.style.display='block';el.parseResult.innerHTML='<div class="app-result-warn">could not parse the email. try adding manually below, or check that the email contains an amount and provider name.</div>';return;
  }
  if(!parsed.renewsAt){parsed.renewsAt=new Date(Date.now()+30*86400000).toISOString().slice(0,10);}
  addItem({provider:parsed.provider,amount:parsed.amount,period:parsed.period,renewsAt:parsed.renewsAt,change:parsed.change||'stable',category:'',source:'email',notes:''});
  el.parseResult.style.display='block';el.parseResult.innerHTML='<div class="app-result-ok">✓ '+parsed.provider+' — £'+parsed.amount.toFixed(2)+'/'+parsed.period+' — renews '+new Date(parsed.renewsAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+(parsed.change!=='stable'?' — '+parsed.change:'')+'</div>';
  el.pasteInput.value='';
});

// ─── File Upload ───
el.dropZone.addEventListener('click',function(){el.fileInput.click();});
el.dropZone.addEventListener('dragover',function(e){e.preventDefault();el.dropZone.classList.add('app-drop-active');});
el.dropZone.addEventListener('dragleave',function(){el.dropZone.classList.remove('app-drop-active');});
el.dropZone.addEventListener('drop',function(e){e.preventDefault();el.dropZone.classList.remove('app-drop-active');if(e.dataTransfer.files.length)handleFile(e.dataTransfer.files[0]);});
el.fileInput.addEventListener('change',function(){if(this.files.length)handleFile(this.files[0]);});

function handleFile(file){
  var ext=file.name.split('.').pop().toLowerCase();
  if(ext==='pdf'){parsePDF(file);}else{parseImage(file);}
}
function parsePDF(file){
  var reader=new FileReader();
  reader.onload=function(){
    var typedArray=new Uint8Array(reader.result);
    pdfjsLib.getDocument({data:typedArray}).promise.then(function(pdf){
      var text='';
      function getPage(n){
        if(n>pdf.numPages){processExtractedText(text);return;}
        pdf.getPage(n).then(function(page){return page.getTextContent();}).then(function(content){
          text+=content.items.map(function(i){return i.str;}).join(' ')+'\n';getPage(n+1);
        });
      }
      getPage(1);
    }).catch(function(){showUploadError('could not read pdf. try pasting the text instead.');});
  };
  reader.readAsArrayBuffer(file);
}
function parseImage(file){
  showUploadError('image files are not supported yet. try pasting the text instead, or enter the details manually.');
}
function processExtractedText(text){
  var parsed=parseEmail(text);
  if(!parsed||!parsed.provider||!parsed.amount){showUploadError('could not extract details from the file. try pasting the text or adding manually.');return;}
  if(!parsed.renewsAt)parsed.renewsAt=new Date(Date.now()+30*86400000).toISOString().slice(0,10);
  addItem({provider:parsed.provider,amount:parsed.amount,period:parsed.period,renewsAt:parsed.renewsAt,change:parsed.change||'stable',category:'',source:'pdf',notes:''});
  el.uploadResult.style.display='block';el.uploadResult.innerHTML='<div class="app-result-ok">✓ '+parsed.provider+' — £'+parsed.amount.toFixed(2)+'/'+parsed.period+' — added from pdf</div>';
}
function showUploadError(msg){el.uploadResult.style.display='block';el.uploadResult.innerHTML='<div class="app-result-warn">'+msg+'</div>';}

// ─── Manual Form ───
el.manualForm.addEventListener('submit',function(e){
  e.preventDefault();
  var item={provider:document.getElementById('mfProvider').value.trim(),amount:parseFloat(document.getElementById('mfAmount').value)||0,period:document.getElementById('mfPeriod').value,renewsAt:document.getElementById('mfDate').value,change:document.getElementById('mfChange').value||'stable',category:document.getElementById('mfCategory').value,source:'manual',notes:document.getElementById('mfNotes').value};
  if(!item.provider||!item.amount){return;}
  addItem(item);
  el.manualForm.reset();
});

// ─── Filters ───
el.filters.querySelectorAll('.app-filter').forEach(function(f){
  f.addEventListener('click',function(){
    el.filters.querySelectorAll('.app-filter').forEach(function(x){x.classList.remove('active');});
    f.classList.add('active');currentFilter=f.getAttribute('data-filter');renderAll();
  });
});

// ─── View Toggles ───
document.querySelectorAll('.app-view-btn').forEach(function(v){
  v.addEventListener('click',function(){
    document.querySelectorAll('.app-view-btn').forEach(function(x){x.classList.remove('active');});
    v.classList.add('active');currentView=v.getAttribute('data-view');
    document.querySelectorAll('.app-view').forEach(function(x){x.classList.remove('app-view-active');});
    if(currentView==='list')el.list.classList.add('app-view-active');
    else if(currentView==='calendar'){el.calendar.classList.add('app-view-active');renderCalendar();}
    else if(currentView==='digest'){el.digest.classList.add('app-view-active');renderDigest();}
  });
});

// ─── Export ───
el.exportBtn.addEventListener('click',function(){
  var rows=[['Provider','Amount','Period','Annual','Renews','Change','Category','Verdict','Notes']];
  data.items.forEach(function(it){rows.push([it.provider,it.amount.toFixed(2),it.period,getAnnual(it).toFixed(2),it.renewsAt,it.change,it.category,it.verdict,it.notes]);});
  var csv=rows.map(function(r){return r.map(function(c){return'"'+(c||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob=new Blob([csv],{type:'text/csv'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='perch-renewals-'+new Date().toISOString().slice(0,10)+'.csv';a.click();
});

// ─── Clear ───
el.clearBtn.addEventListener('click',function(){if(confirm('delete all tracked renewals? this cannot be undone.')){data.items=[];save(data);renderAll();}});

// ─── Notifications ───
el.notifyToggle.addEventListener('change',function(){data.settings.notifications=this.checked;save(data);});
if(data.settings.notifications){requestNotificationPermission();}
function requestNotificationPermission(){if('Notification' in window&&Notification.permission==='default'){Notification.requestPermission();}}
function scheduleNotifications(){
  if(!data.settings.notifications||!('Notification' in window)||Notification.permission!=='granted')return;
  data.items.forEach(function(it){if(it.status!=='active')return;
    var rd=new Date(it.renewsAt).getTime();var now=Date.now();var daysUntil=Math.floor((rd-now)/86400000);
    if(daysUntil>0&&daysUntil<=30&&!it._notified)
    {it._notified=true;save(data);
      if(daysUntil<=7)new Notification('perch. renewal alert',{body:it.provider+' renews in '+daysUntil+' days — £'+(it.period==='month'?it.amount+'/mo':it.amount+'/yr'),icon:'/favicon.svg'});
    }
  });
}

// ─── Render All ───
function renderAll(){renderStats();renderList();if(currentView==='calendar')renderCalendar();if(currentView==='digest')renderDigest();scheduleNotifications();}

function renderStats(){
  var items=data.items.filter(function(it){return it.status==='active';});
  el.stats.total.textContent=items.length;
  var ann=items.reduce(function(s,it){return s+getAnnual(it);},0);
  el.stats.annual.textContent='£'+ann.toLocaleString();
  var act=items.filter(function(it){return it.verdict!=='renew';}).length;
  el.stats.action.textContent=act;
  var sav=Math.round(ann*0.25);
  el.stats.saved.textContent='£'+sav.toLocaleString();
}

function renderList(){
  var items=getFiltered();
  if(items.length===0&&data.items.length===0){el.empty.style.display='block';el.items.innerHTML='';return;}
  if(items.length===0){el.empty.style.display='block';el.items.innerHTML='';return;}
  el.empty.style.display='none';
  var html='';
  items.forEach(function(it,i){
    var ann=getAnnual(it);
    var daysUntil=Math.floor((new Date(it.renewsAt).getTime()-Date.now())/86400000);
    var urgencyClass=daysUntil<=14?'urgent':daysUntil<=30?'soon':'ok';
    var verdictClass='app-verdict-'+it.verdict;
    html+='<div class="app-item" data-id="'+it.id+'"><div class="app-item-header" onclick="window._toggleAppItem(\''+it.id+'\')"><div class="app-item-icon">'+getIcon(it.category)+'</div><div class="app-item-body"><div class="app-item-name">'+esc(it.provider)+'</div><div class="app-item-sub">'+(it.period==='month'?'£'+it.amount.toFixed(2)+'/mo':'£'+it.amount.toFixed(2)+'/yr')+' · renews '+new Date(it.renewsAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+(daysUntil>=0?' · <span class="app-urgency app-urgency-'+urgencyClass+'">'+daysUntil+'d</span>':'')+'</div></div><span class="app-item-tag '+verdictClass+'">'+it.verdict+'</span></div><div class="app-item-data"><div class="app-item-data-inner"><div class="app-data-grid"><div><span class="app-data-label">annual cost</span><span class="app-data-value">£'+ann.toLocaleString()+'</span></div><div><span class="app-data-label">price change</span><span class="app-data-value '+(it.change!=='stable'?'app-data-neg':'')+'">'+it.change+'</span></div><div><span class="app-data-label">source</span><span class="app-data-value">'+it.source+'</span></div><div><span class="app-data-label">category</span><span class="app-data-value">'+it.category+'</span></div></div>'+(it.notes?'<div class="app-item-notes">'+esc(it.notes)+'</div>':'')+(it.history&&it.history.length?'<div class="app-item-history"><div class="app-item-history-title">price history</div>'+it.history.slice(-5).reverse().map(function(h){return'<div class="app-history-row"><span>'+h.date+'</span><span>£'+h.amount.toFixed(2)+'</span></div>';}).join('')+'</div>':'')+'<div class="app-item-actions"><button onclick="window._editAppItem(\''+it.id+'\')" class="app-item-act">edit</button><button onclick="window._deleteAppItem(\''+it.id+'\')" class="app-item-act app-item-act-del">delete</button></div></div></div></div>';
  });
  el.items.innerHTML=html;
}

function getIcon(cat){if(cat==='insurance')return'🛡️';if(cat==='subscription')return'🎬';if(cat==='broadband')return'🌐';if(cat==='domain')return'🔗';return'📄';}
function esc(s){if(!s)return'';return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ─── Edit Modal ───
function editItem(id){
  var it=data.items.find(function(x){return x.id===id;});if(!it)return;
  var html='<div class="app-modal-overlay" id="appEditModal" onclick="if(event.target===this)this.remove()"><div class="app-modal"><h3>edit renewal</h3><form id="appEditForm"><div class="app-form-grid"><div class="app-form-group"><label>provider</label><input type="text" id="efProvider" value="'+esc(it.provider)+'" required></div><div class="app-form-group"><label>amount</label><input type="text" id="efAmount" value="'+it.amount.toFixed(2)+'" required></div><div class="app-form-group"><label>period</label><select id="efPeriod"><option value="year" '+(it.period==='year'?'selected':'')+'>per year</option><option value="month" '+(it.period==='month'?'selected':'')+'>per month</option></select></div><div class="app-form-group"><label>renewal date</label><input type="date" id="efDate" value="'+it.renewsAt+'" required></div><div class="app-form-group"><label>category</label><select id="efCategory">'+['insurance','subscription','broadband','domain','other'].map(function(c){return'<option value="'+c+'" '+(it.category===c?'selected':'')+'>'+c+'</option>';}).join('')+'</select></div><div class="app-form-group"><label>price change</label><input type="text" id="efChange" value="'+esc(it.change)+'"></div><div class="app-form-group app-form-full"><label>notes</label><input type="text" id="efNotes" value="'+esc(it.notes||'')+'"></div></div><div class="app-form-actions"><button type="button" onclick="document.getElementById(\'appEditModal\').remove()" class="app-parse-btn" style="background:var(--bg-soft);color:var(--text-dim);">cancel</button><button type="submit" class="app-parse-btn">save changes</button></div></form></div></div>';
  document.body.insertAdjacentHTML('beforeend',html);
  document.getElementById('appEditForm').addEventListener('submit',function(e){
    e.preventDefault();
    var newAmount=parseFloat(document.getElementById('efAmount').value)||0;
    updateHistory(it,newAmount);
    it.provider=document.getElementById('efProvider').value.trim();
    it.period=document.getElementById('efPeriod').value;
    it.renewsAt=document.getElementById('efDate').value;
    it.category=document.getElementById('efCategory').value;
    it.change=document.getElementById('efChange').value||'stable';
    it.notes=document.getElementById('efNotes').value;
    it.verdict=getVerdict(it);
    persist();
    document.getElementById('appEditModal').remove();
  });
}

function deleteItem(id){
  if(!confirm('delete this item? this cannot be undone.'))return;
  data.items=data.items.filter(function(x){return x.id!==id;});
  persist();
}

function toggleItem(id){
  var el=document.querySelector('.app-item[data-id="'+id+'"]');
  if(!el)return;
  var was=el.classList.contains('app-item-expanded');
  document.querySelectorAll('.app-item-expanded').forEach(function(x){x.classList.remove('app-item-expanded');});
  if(!was)el.classList.add('app-item-expanded');
}

window._toggleAppItem=toggleItem;
window._editAppItem=editItem;
window._deleteAppItem=deleteItem;

// ─── Calendar ───
var now=new Date();calYear=now.getFullYear();calMonth=now.getMonth();
el.calPrev.addEventListener('click',function(){calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCalendar();});
el.calNext.addEventListener('click',function(){calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCalendar();});

function renderCalendar(){
  var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  el.calMonth.textContent=months[calMonth]+' '+calYear;
  var firstDay=new Date(calYear,calMonth,1).getDay();firstDay=firstDay===0?6:firstDay-1;
  var daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  var itemsByDate={};
  data.items.forEach(function(it){
    var d=it.renewsAt;
    if(!d)return;
    var m=parseInt(d.slice(5,7),10)-1;
    if(m===calMonth&&d.slice(0,4)===String(calYear)){
      var day=parseInt(d.slice(8,10),10);
      if(!itemsByDate[day])itemsByDate[day]=[];
      itemsByDate[day].push(it);
    }
  });
  var today=new Date().toISOString().slice(0,10);
  var html='<div class="app-cal-weekdays"><span>mon</span><span>tue</span><span>wed</span><span>thu</span><span>fri</span><span>sat</span><span>sun</span></div>';
  for(var i=0;i<firstDay;i++)html+='<div class="app-cal-day app-cal-day-empty"></div>';
  for(var d=1;d<=daysInMonth;d++){
    var dateStr=calYear+'-'+String(calMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var isToday=dateStr===today;
    var hasItem=itemsByDate[d];
    html+='<div class="app-cal-day'+(isToday?' app-cal-today':'')+'"><span class="app-cal-day-num">'+d+'</span>';
    if(hasItem){html+='<div class="app-cal-dots">'+hasItem.map(function(it){return'<span class="app-cal-dot app-cal-dot-'+it.verdict+'" title="'+esc(it.provider)+' — £'+it.amount+'"></span>';}).join('')+'</div>';}
    html+='</div>';
  }
  el.calGrid.innerHTML=html;
}

// ─── Digest ───
function renderDigest(){
  var items=data.items.filter(function(it){return it.status==='active';});
  if(items.length===0){el.digestEmpty.style.display='block';el.digestContent.innerHTML='';el.digestDate.textContent='not enough items';return;}
  el.digestEmpty.style.display='none';
  var d=new Date();d.setDate(d.getDate()-(d.getDay()+6)%7);
  el.digestDate.textContent='issued '+d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short',year:'numeric'});
  var needsAction=items.filter(function(it){return it.verdict!=='renew';}).sort(function(a,b){return new Date(a.renewsAt).getTime()-new Date(b.renewsAt).getTime();});
  var safe=items.filter(function(it){return it.verdict==='renew';}).sort(function(a,b){return new Date(a.renewsAt).getTime()-new Date(b.renewsAt).getTime();});
  var html='<div class="app-digest-intro">good morning. here\'s what renews this week and what needs your attention.</div>';
  if(needsAction.length>0){
    html+='<div class="app-digest-block"><div class="app-digest-block-heading"><span class="app-digest-dot-urgent"></span> needs action ('+needsAction.length+')</div>';
    needsAction.slice(0,8).forEach(function(it){
      var daysUntil=Math.floor((new Date(it.renewsAt).getTime()-Date.now())/86400000);
      html+='<div class="app-digest-row"><span class="app-digest-badge app-digest-badge-'+it.verdict+'">'+it.verdict+'</span><span>'+esc(it.provider)+'</span><span class="app-digest-meta">'+(it.period==='month'?'£'+it.amount.toFixed(2)+'/mo':'£'+it.amount.toFixed(2)+'/yr')+(daysUntil>=0?' · '+daysUntil+'d':'')+'</span></div>';
    });
    html+='</div>';
  }
  if(safe.length>0){
    html+='<div class="app-digest-block"><div class="app-digest-block-heading"><span class="app-digest-dot-ok"></span> all clear ('+safe.length+')</div>';
    safe.slice(0,5).forEach(function(it){
      html+='<div class="app-digest-row"><span class="app-digest-badge app-digest-badge-renew">renew</span><span>'+esc(it.provider)+'</span><span class="app-digest-meta">'+(it.period==='month'?'£'+it.amount.toFixed(2)+'/mo':'£'+it.amount.toFixed(2)+'/yr')+'</span></div>';
    });
    html+='</div>';
  }
  var ann=items.reduce(function(s,it){return s+getAnnual(it);},0);
  html+='<div class="app-digest-summary"><strong>total annual exposure:</strong> £'+ann.toLocaleString()+' · <strong>items tracked:</strong> '+items.length+' · <strong>potential savings:</strong> ~£'+Math.round(ann*0.25).toLocaleString()+'</div>';
  el.digestContent.innerHTML=html;
}

// ─── Init ───
renderAll();
setTimeout(function(){},100);
})();
