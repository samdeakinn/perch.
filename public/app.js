(function(){if(!document.getElementById('appStats'))return;

var STORE='perch_app_data',ONBOARD_KEY='perch_app_onboarded';

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function load(){try{var d=localStorage.getItem(STORE);return d?JSON.parse(d):{items:[],settings:{notifications:true}}}catch(e){return{items:[],settings:{notifications:true}}}}
function save(data){try{localStorage.setItem(STORE,JSON.stringify(data))}catch(e){}}
var data=load();
var currentFilter='all',currentView='list',calYear,calMonth;

function persist(){data.settings.notifications=document.getElementById('appNotifyToggle').checked;save(data);renderAll();}
function getAnnual(it){return it.period==='month'?it.amount*12:it.amount;}
function getVerdict(it){
  if(it.change&&it.change!=='stable'){var n=parseFloat(it.change);if(!isNaN(n)&&n>15)return'renegotiate';if(!isNaN(n)&&n>0)return'renegotiate';}
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
    if(/insur|policy|claim|protect|cover/i.test(p))item.category='insurance';
    else if(/broadband|virgin|bt|sky|talktalk|ee|vodafone|three|o2|giffgaff|lebara|tesco mobile|smarty|voxi|mobile|sim|wifi|internet|utility|energy|gas|electric|water/i.test(p))item.category='broadband';
    else if(/domain|hosting|namecheap|godaddy|cloudflare|google domains|hover|porkbun|dns|ssl/i.test(p))item.category='domain';
    else if(/gym|netflix|spotify|apple|google|adobe|microsoft|amazon|disney|cloud|saas|software|app|sub|membership|stream/i.test(p))item.category='subscription';
    else item.category='other';
  }
  data.items.unshift(item);data.items.sort(function(a,b){return new Date(a.renewsAt).getTime()-new Date(b.renewsAt).getTime();});persist();
}

function updateHistory(item,newAmount){
  if(!item.history)item.history=[];
  if(item.amount&&item.amount!==newAmount){item.history.push({date:new Date().toISOString().slice(0,10),amount:item.amount});}
  item.amount=parseFloat(newAmount)||0;item.verdict=getVerdict(item);
}

// ─── PARSER 2.0 ───

function getProviderList(){return[
  // Insurance
  'admiral','admiral car insurance','direct line','direct line insurance','direct line home insurance','aviva','churchill','lv','lv hastings','axa','axa insurance','more than','tesco bank','tesco insurance','saga','saga insurance','ageas','esure','sheilas wheels','hastings direct','hastings','rac','aa','the aa','quote me happy','nfumutual','nfumutual insurance','john lewis insurance','john lewis','co-op insurance','coop insurance','swinton','swinton insurance','privilege','privilege insurance','zurich','allianz','1st central','first central','diamond','biba','brightside','bupa','bupa insurance','axa ppp','axa health','vitality','vitality insurance','petplan','pet plan','animal friends','manypets','bought by many','waggel',
  // Broadband/Telecoms
  'virgin media','virgin media broadband','virgin media o2','bt','bt broadband','bt group','sky','sky broadband','sky tv','talktalk','ee','ee broadband','vodafone','three','o2','plusnet','hyperoptic','zen internet','zen','now tv','now broadband','utility warehouse','the phone co-op','shell energy broadband','shell broadband','community fibre','gigascleargigaclear','airband','airband broadband','idmobile','asmobile','giffgaff','lebara','lebara mobile','tesco mobile','tesco telecom','smarty','voxi','honest mobile','lycamobile',
  // Domains/Hosting
  'namecheap','godaddy','cloudflare','google domains','hover','porkbun','dynadot','namesilo','ionos','1and1','fasthosts','123reg','123 reg','heart internet','tsohost','tshost','kualo','siteground','wpengine','wp engine','krystal','krystal hosting','20i','stablepoint',
  // Subscriptions/Streaming
  'netflix','spotify','apple','apple music','apple tv','appletv','disney','disney plus','disney+','amazon','amazon prime','prime video','amazon music','paramount','paramount plus','paramount+','now tv','nowtv','youtube','youtube premium','youtube music','tidal','deezer','audible','kindle','kindle unlimited',
  // SaaS/Software
  'adobe','adobe creative cloud','adobe cc','microsoft','microsoft 365','office 365','google','google workspace','gsuite','g suite','dropbox','notion','slack','figma','canva','linear','github','gitlab','atlassian','jira','confluence','monday','monday.com','hubspot','salesforce','zendesk','intercom','mailchimp','convertkit','substack','beehiiv','webflow','wix','squarespace','shopify','carrd','ghost',
  // Gym/Fitness
  'puregym','pure gym','the gym','the gym group','david lloyd','nuffield health','virgin active','bannatyne','bannatynes','anytime fitness','anytimefitness','jd gyms','jdsports','better leisure','better uk','everyone active','gymbox','third space','equinox','classpass','class pass','barry\'s','barrys bootcamp','f45','crossfit','bouldermovement','the climbing hangar','clipnclimb'
];}

function parseEmail(text){
  var result={provider:'',amount:0,period:'year',renewsAt:'',change:'stable',category:'other',contractLength:'',cancelWindow:'',previousAmount:0};
  if(!text||text.trim().length<10)return null;
  var t=text.toLowerCase();

  // Provider detection — 50+ providers
  var providers=getProviderList();
  for(var i=0;i<providers.length;i++){
    if(t.indexOf(providers[i])>-1){
      result.provider=providers[i].replace(/\b\w/g,function(c){return c.toUpperCase();});
      if(/insurance|policy|insure/i.test(result.provider.toLowerCase()))result.category='insurance';
      else if(/broadband|media|bt|sky|talktalk|ee|vodafone|o2|three|plusnet|hyperoptic|zen|mobile|sim|giffgaff|lebara|smarty|voxi/i.test(result.provider.toLowerCase()))result.category='broadband';
      else if(/namecheap|godaddy|cloudflare|domain|hosting|hover|porkbun|ionos|fasthosts|siteground|wpengine/i.test(result.provider.toLowerCase()))result.category='domain';
      else if(/netflix|spotify|apple|disney|prime|paramount|youtube|tidal|deezer|audible|adobe|microsoft|google|dropbox|notion|slack|figma|canva|linear|github|gitlab|jira|confluence|hubspot|salesforce|zendesk|mailchimp|convertkit|webflow|wix|shopify|substack|beehiiv/i.test(result.provider.toLowerCase()))result.category='subscription';
      else if(/gym|fitness|david lloyd|nuffield|virgin active|bannatyne|anytime|classpass|crossfit|climbing/i.test(result.provider.toLowerCase()))result.category='subscription';
      break;
    }
  }
  if(!result.provider){
    var lines=text.split('\n');
    for(var j=0;j<Math.min(lines.length,5);j++){
      var l=lines[j].trim();
      if(l.length>3&&l.length<60&&!/re:|subject|from:|to:|forwarded/i.test(l)){result.provider=l.charAt(0).toUpperCase()+l.slice(1);break;}
    }
  }

  // Amount detection — multiple formats
  var amtMatch=text.match(/[£$€]\s*([\d,]+(?:\.\d{2}))/);
  if(amtMatch)result.amount=parseFloat(amtMatch[1].replace(/,/g,''));
  if(!result.amount){
    var numMatch=text.match(/([\d,]+\.\d{2})\s*(?:per\s*(year|month|yr|mo|annum|annual))/i);
    if(numMatch){result.amount=parseFloat(numMatch[1].replace(/,/g,''));if(numMatch[2]&&/month|mo/i.test(numMatch[2].toLowerCase()))result.period='month';}
  }
  if(!result.amount){
    var anyMatch=text.match(/£([\d,]+(?:\.\d{2})?)/);
    if(anyMatch)result.amount=parseFloat(anyMatch[1].replace(/,/g,''));
  }
  if(!result.amount){
    var paraMatch=text.match(/(?:premium|cost|price|amount|total|fee|charge)[^\d]*?[£$€]?\s*([\d,]+(?:\.\d{2})?)/i);
    if(paraMatch)result.amount=parseFloat(paraMatch[1].replace(/,/g,''));
  }

  // Period detection
  if(/per\s*month|\/mo|monthly|p\/m|per\s*calendar\s*month/i.test(t))result.period='month';
  else if(/per\s*year|\/yr|annually|per\s*annum|annual|p\/a/i.test(t))result.period='year';

  // Contract length detection
  var clMatch=text.match(/(\d{1,2})[\s-]*(?:month|mon)[\s-]*(?:contract|term|plan|deal|agreement|minimum|min|fixed)/i);
  if(clMatch)result.contractLength=clMatch[1]+' months';
  if(!result.contractLength){var clMatch2=text.match(/minimum\s*(?:term|contract|period)[^\d]*(\d{1,2})\s*(?:month|mon)/i);if(clMatch2)result.contractLength=clMatch2[1]+' months';}
  if(!result.contractLength){if(/\b12[\s-]*month\b/i.test(t))result.contractLength='12 months';else if(/\b18[\s-]*month\b/i.test(t))result.contractLength='18 months';else if(/\b24[\s-]*month\b/i.test(t))result.contractLength='24 months';}

  // Cancellation window detection
  var cwMatch=text.match(/(\d{1,2})\s*(?:calendar\s*)?days?\s*(?:notice|before|prior|cancel)/i);
  if(cwMatch)result.cancelWindow=cwMatch[1]+' days';
  if(!result.cancelWindow){var cwMatch2=text.match(/notice\s*(?:period|window)[^\d]*(\d{1,2})\s*(?:calendar\s*)?days?/i);if(cwMatch2)result.cancelWindow=cwMatch2[1]+' days';}

  // Date detection — expanded formats
  var dateMatch=text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})/i);
  if(dateMatch){
    var months={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:0,january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
    var m=months[dateMatch[2].toLowerCase()],d=parseInt(dateMatch[1],10),y=parseInt(dateMatch[3],10);
    result.renewsAt=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  }else{
    var isoMatch=text.match(/(\d{4})-(\d{2})-(\d{2})/);if(isoMatch)result.renewsAt=isoMatch[1]+'-'+isoMatch[2]+'-'+isoMatch[3];
  }
  if(!result.renewsAt){
    var renewMatch=text.match(/renew(?:s|al)?\s*(?:on|date)?[:\s]*(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4})/i);
    if(renewMatch){var dd=parseInt(renewMatch[1],10),mm=parseInt(renewMatch[2],10),yy=parseInt(renewMatch[3],10);if(yy<100)yy+=2000;result.renewsAt=yy+'-'+String(mm).padStart(2,'0')+'-'+String(dd).padStart(2,'0');}
  }
  if(!result.renewsAt){
    var expiresMatch=text.match(/expir(?:e|es|y|ation)\s*(?:on|date)?[:\s]*(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{4})/i);
    if(expiresMatch){var mm2=months[expiresMatch[2].toLowerCase()],dd2=parseInt(expiresMatch[1],10),yy2=parseInt(expiresMatch[3],10);result.renewsAt=yy2+'-'+String(mm2+1).padStart(2,'0')+'-'+String(dd2).padStart(2,'0');}
  }

  // Change detection — expanded
  var changeMatch=text.match(/[+\u2191]\s*(\d+(?:\.\d+)?)\s*%/);
  if(changeMatch)result.change='+'+changeMatch[1]+'%';
  else if(/stable|no change|unchanged|same price|price unchanged|price is the same|price has not changed|no increase/i.test(t))result.change='stable';
  else{
    var fromTo=text.match(/from\s*[£$€]?\s*([\d,]+(?:\.\d{2})?)\s*(?:to|up to|now)\s*[£$€]?\s*([\d,]+(?:\.\d{2})?)/i);
    if(fromTo){var fromAmt=parseFloat(fromTo[1].replace(/,/g,'')),toAmt=parseFloat(fromTo[2].replace(/,/g,''));if(fromAmt>0){var pc=Math.round((toAmt-fromAmt)/fromAmt*100);result.change=(pc>=0?'+':'')+pc+'%';result.previousAmount=fromAmt;}}
  }
  if(result.change==='stable'){
    var wasMatch=text.match(/was\s*[£$€]?\s*([\d,]+(?:\.\d{2})?)/i);
    if(wasMatch){var wasAmt=parseFloat(wasMatch[1].replace(/,/g,''));if(wasAmt>0&&result.amount>0&&result.amount!==wasAmt){var pc2=Math.round((result.amount-wasAmt)/wasAmt*100);result.change=(pc2>=0?'+':'')+pc2+'%';result.previousAmount=wasAmt;}}
  }
  if(!result.amount)result.amount=0;
  return result;
}

// ─── Bulk Paste ───
function parseBulkPaste(text){
  var blocks=text.split(/---{3,}\n?|\n{3,}/).filter(function(b){return b.trim().length>10;});
  if(blocks.length<=1)return[parseEmail(text)];
  return blocks.map(function(b){return parseEmail(b.trim());}).filter(function(p){return p&&p.provider&&p.amount;});
}

// ─── Smart Insights ───
function generateInsights(){
  var items=data.items.filter(function(it){return it.status==='active';});
  if(items.length<2)return null;
  var insights=[];
  // Biggest overpayment
  var byChange=items.filter(function(it){return it.change!=='stable';}).sort(function(a,b){return parseFloat(b.change)-parseFloat(a.change);});
  if(byChange.length)insights.push('your biggest price hike is <strong>'+esc(byChange[0].provider)+'</strong> at <strong>'+byChange[0].change+'</strong>. renegotiating this alone could save <strong>~£'+Math.round(byChange[0].amount*parseFloat(byChange[0].change)/100*12).toLocaleString()+'/yr</strong>.');
  // Upcoming
  var now=Date.now(),soon=items.filter(function(it){var d=new Date(it.renewsAt).getTime();return d>now&&d<now+30*86400000;});
  if(soon.length>0)insights.push('<strong>'+soon.length+' item'+(soon.length>1?'s':'')+'</strong> renew'+(soon.length>1?'':'s')+' this month. '+soon.map(function(it){return esc(it.provider);}).slice(0,3).join(', ')+(soon.length>3?' + '+(soon.length-3)+' more':'')+'.');
  // Total
  var ann=items.reduce(function(s,it){return s+getAnnual(it);},0);
  var pot=Math.round(ann*0.28);
  insights.push('your total annual exposure is <strong>£'+ann.toLocaleString()+'</strong>. you could potentially save <strong>~£'+pot.toLocaleString()+'</strong> by renegotiating or cancelling unused items.');
  return insights;
}

// ─── UI References ───
var el={};
function cacheUI(){
  el.addTabs=document.querySelectorAll('.app-add-tab');el.addBodies=document.querySelectorAll('.app-add-body');
  el.pasteInput=document.getElementById('appPasteInput');el.parseBtn=document.getElementById('appParseBtn');el.parseResult=document.getElementById('appParseResult');
  el.bulkBtn=document.getElementById('appBulkBtn');el.sampleBtn=document.getElementById('appSampleBtn');
  el.dropZone=document.getElementById('appDropZone');el.fileInput=document.getElementById('appFileInput');el.uploadResult=document.getElementById('appUploadResult');
  el.manualForm=document.getElementById('appManualForm');
  el.stats={total:document.getElementById('appStatTotal'),annual:document.getElementById('appStatAnnual'),action:document.getElementById('appStatAction'),saved:document.getElementById('appStatSaved')};
  el.insightsPanel=document.getElementById('appInsights');
  el.filters=document.getElementById('appFilters');el.items=document.getElementById('appItems');el.empty=document.getElementById('appEmpty');el.list=document.getElementById('appList');
  el.calendar=document.getElementById('appCalendar');el.calGrid=document.getElementById('calGrid');el.calMonth=document.getElementById('calMonth');el.calPrev=document.getElementById('calPrev');el.calNext=document.getElementById('calNext');
  el.digest=document.getElementById('appDigest');el.digestContent=document.getElementById('digestContent');el.digestEmpty=document.getElementById('digestEmpty');el.digestDate=document.getElementById('digestDate');
  el.exportBtn=document.getElementById('appExportBtn');el.clearBtn=document.getElementById('appClearBtn');el.notifyToggle=document.getElementById('appNotifyToggle');
  el.onboardOverlay=document.getElementById('appOnboard');
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

// ─── Paste & Parse (single + bulk) ───
el.parseBtn.addEventListener('click',function(){
  var text=el.pasteInput.value.trim();if(!text)return;
  var results=parseBulkPaste(text);
  if(results.length===0||!results[0]||!results[0].provider){
    el.parseResult.style.display='block';el.parseResult.innerHTML='<div class="app-result-warn">could not parse the email. try adding manually below, or check that the email contains an amount and provider name.</div>';return;
  }
  var added=[];
  results.forEach(function(parsed){
    if(!parsed||!parsed.provider)return;
    if(!parsed.renewsAt)parsed.renewsAt=new Date(Date.now()+30*86400000).toISOString().slice(0,10);
    var cw=parsed.cancelWindow||'';var cl=parsed.contractLength||'';
    addItem({provider:parsed.provider,amount:parsed.amount,period:parsed.period,renewsAt:parsed.renewsAt,change:parsed.change||'stable',category:parsed.category||'',source:'email',notes:(cl?'contract: '+cl+'. ':'')+(cw?'cancel within '+cw:''),previousAmount:parsed.previousAmount||0});
    added.push('<span class="app-result-item">✓ '+esc(parsed.provider)+' — £'+parsed.amount.toFixed(2)+'/'+parsed.period+(parsed.change!=='stable'?' — '+parsed.change:'')+(cl?' — '+cl:'')+(cw?' — '+cw:'')+'</span>');
  });
  el.parseResult.style.display='block';el.parseResult.innerHTML='<div class="app-result-ok">'+added.length+' item'+(added.length>1?'s':'')+' added:<br>'+added.join('<br>')+'</div>';
  el.pasteInput.value='';renderInsights();
});

// ─── Bulk toggle ───
if(el.bulkBtn){el.bulkBtn.addEventListener('click',function(){
  var v=el.pasteInput.value;
  if(!v||v.indexOf('---')>-1){el.pasteInput.value=v?''+v:'--- paste first email ---\n\n--- paste second email ---';}
});}

// ─── Sample Email ───
if(el.sampleBtn){el.sampleBtn.addEventListener('click',function(){
  el.pasteInput.value='Subject: Your car insurance is renewing soon\nFrom: Admiral Car Insurance\n\nDear customer,\n\nyour policy for your toyota yaris (reg AB12 CDE) will renew on 14 August 2026.\n\nyour new premium is £612.40 per year. this represents a change of +22% from your previous year\'s premium of £502.00.\n\nyour policy includes comprehensive cover with £250 voluntary excess.\n\nif you want to cancel or make changes, please contact us at least 14 days before the renewal date.\n\nyour policy is on a 12-month contract.\n\nregards,\nAdmiral Insurance';
});}

// ─── Onboarding ───
if(el.onboardOverlay){
  var onboarded=false;try{onboarded=localStorage.getItem(ONBOARD_KEY)==='1';}catch(e){}
  if(!onboarded){el.onboardOverlay.style.display='flex';}
  el.onboardOverlay.querySelectorAll('.app-onboard-step').forEach(function(s){
    s.addEventListener('click',function(){
      var step=parseInt(s.getAttribute('data-step'),10);
      if(step===1){
        el.sampleBtn&&el.sampleBtn.click();el.onboardOverlay.querySelector('.app-onboard-badge').textContent='2/3';
        el.onboardOverlay.querySelector('.app-onboard-body').textContent='you\'ve loaded a sample email. click "parse & add" to extract the details — perch. will read the provider, amount, date, and price change automatically.';
        s.setAttribute('data-step','2');s.textContent='parse it →';
      }else if(step===2){
        el.parseBtn.click();el.onboardOverlay.querySelector('.app-onboard-badge').textContent='3/3';
        el.onboardOverlay.querySelector('.app-onboard-body').textContent='item added. switch to the "digest" view to see your weekly roundup, or click on the item to expand and see all parsed fields. you can edit or delete items anytime.';
        s.setAttribute('data-step','3');s.textContent='see digest →';
      }else{
        switchTab('digest');el.onboardOverlay.style.display='none';try{localStorage.setItem(ONBOARD_KEY,'1');}catch(e){}
      }
    });
  });
  el.onboardOverlay.querySelector('.app-onboard-skip').addEventListener('click',function(){
    el.onboardOverlay.style.display='none';try{localStorage.setItem(ONBOARD_KEY,'1');}catch(e){}
  });
}

function switchTab(tabName){
  document.querySelectorAll('.app-view-btn').forEach(function(x){x.classList.remove('active');});
  var btn=document.querySelector('.app-view-btn[data-view="'+tabName+'"]');if(btn)btn.classList.add('active');
  currentView=tabName;
  document.querySelectorAll('.app-view').forEach(function(x){x.classList.remove('app-view-active');});
  if(tabName==='list')el.list.classList.add('app-view-active');
  else if(tabName==='calendar'){el.calendar.classList.add('app-view-active');renderCalendar();}
  else if(tabName==='digest'){el.digest.classList.add('app-view-active');renderDigest();}
}

// ─── File Upload ───
el.dropZone&&el.dropZone.addEventListener('click',function(){el.fileInput.click();});
el.dropZone&&el.dropZone.addEventListener('dragover',function(e){e.preventDefault();el.dropZone.classList.add('app-drop-active');});
el.dropZone&&el.dropZone.addEventListener('dragleave',function(){el.dropZone.classList.remove('app-drop-active');});
el.dropZone&&el.dropZone.addEventListener('drop',function(e){e.preventDefault();el.dropZone.classList.remove('app-drop-active');if(e.dataTransfer.files.length)handleFile(e.dataTransfer.files[0]);});
el.fileInput&&el.fileInput.addEventListener('change',function(){if(this.files.length)handleFile(this.files[0]);});

function handleFile(file){var ext=file.name.split('.').pop().toLowerCase();if(ext==='pdf')parsePDF(file);else parseImage(file);}
function parsePDF(file){
  var reader=new FileReader();
  reader.onload=function(){
    var typedArray=new Uint8Array(reader.result);
    pdfjsLib.getDocument({data:typedArray}).promise.then(function(pdf){
      var text='';
      function getPage(n){if(n>pdf.numPages){processExtractedText(text);return;}pdf.getPage(n).then(function(page){return page.getTextContent();}).then(function(content){text+=content.items.map(function(i){return i.str;}).join(' ')+'\n';getPage(n+1);});}
      getPage(1);
    }).catch(function(){showUploadError('could not read pdf. try pasting the text instead.');});
  };reader.readAsArrayBuffer(file);
}
function parseImage(file){showUploadError('image files are not supported yet. try pasting the text instead, or enter the details manually.');}
function processExtractedText(text){
  var results=parseBulkPaste(text);
  if(!results.length||!results[0]||!results[0].provider){showUploadError('could not extract details from the file. try pasting the text or adding manually.');return;}
  results.forEach(function(parsed){
    if(!parsed||!parsed.provider)return;
    if(!parsed.renewsAt)parsed.renewsAt=new Date(Date.now()+30*86400000).toISOString().slice(0,10);
    addItem({provider:parsed.provider,amount:parsed.amount,period:parsed.period,renewsAt:parsed.renewsAt,change:parsed.change||'stable',category:parsed.category||'',source:'pdf',notes:'',previousAmount:parsed.previousAmount||0});
  });
  el.uploadResult.style.display='block';el.uploadResult.innerHTML='<div class="app-result-ok">✓ '+results.length+' item'+(results.length>1?'s':'')+' added from pdf</div>';
}
function showUploadError(msg){el.uploadResult.style.display='block';el.uploadResult.innerHTML='<div class="app-result-warn">'+msg+'</div>';}

// ─── Manual Form ───
el.manualForm&&el.manualForm.addEventListener('submit',function(e){
  e.preventDefault();
  var item={provider:document.getElementById('mfProvider').value.trim(),amount:parseFloat(document.getElementById('mfAmount').value)||0,period:document.getElementById('mfPeriod').value,renewsAt:document.getElementById('mfDate').value,change:document.getElementById('mfChange').value||'stable',category:document.getElementById('mfCategory').value,source:'manual',notes:document.getElementById('mfNotes').value};
  if(!item.provider||!item.amount)return;
  addItem(item);el.manualForm.reset();renderInsights();
});

// ─── Insights ───
function renderInsights(){
  if(!el.insightsPanel)return;
  var insights=generateInsights();
  if(!insights||insights.length===0){el.insightsPanel.style.display='none';return;}
  el.insightsPanel.style.display='block';
  el.insightsPanel.innerHTML='<div class="app-insights-title">💡 insights</div>'+insights.map(function(i){return'<div class="app-insight">'+i+'</div>';}).join('');
}

// ─── Filters ───
el.filters.querySelectorAll('.app-filter').forEach(function(f){
  f.addEventListener('click',function(){el.filters.querySelectorAll('.app-filter').forEach(function(x){x.classList.remove('active');});f.classList.add('active');currentFilter=f.getAttribute('data-filter');renderAll();});
});

// ─── View Toggles ───
document.querySelectorAll('.app-view-btn').forEach(function(v){
  v.addEventListener('click',function(){switchTab(v.getAttribute('data-view'));});
});

// ─── Export / Clear / Notify ───
el.exportBtn.addEventListener('click',function(){
  var rows=[['Provider','Amount','Period','Annual','Renews','Change','Category','Verdict','Notes']];
  data.items.forEach(function(it){rows.push([it.provider,it.amount.toFixed(2),it.period,getAnnual(it).toFixed(2),it.renewsAt,it.change,it.category,it.verdict,it.notes]);});
  var csv=rows.map(function(r){return r.map(function(c){return'"'+(c||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='perch-renewals-'+new Date().toISOString().slice(0,10)+'.csv';a.click();
});
el.clearBtn.addEventListener('click',function(){if(confirm('delete all tracked renewals? this cannot be undone.')){data.items=[];save(data);renderAll();renderInsights();}});
el.notifyToggle.addEventListener('change',function(){data.settings.notifications=this.checked;save(data);});
if(data.settings.notifications){requestNotificationPermission();}
function requestNotificationPermission(){if('Notification' in window&&Notification.permission==='default'){Notification.requestPermission();}}
function scheduleNotifications(){
  if(!data.settings.notifications||!('Notification' in window)||Notification.permission!=='granted')return;
  data.items.forEach(function(it){if(it.status!=='active')return;var rd=new Date(it.renewsAt).getTime(),now=Date.now(),daysUntil=Math.floor((rd-now)/86400000);
    if(daysUntil>0&&daysUntil<=30&&!it._notified){it._notified=true;save(data);if(daysUntil<=7)new Notification('perch. renewal alert',{body:it.provider+' renews in '+daysUntil+' days — £'+(it.period==='month'?it.amount+'/mo':it.amount+'/yr'),icon:'/favicon.svg'});}
  });
}

// ─── Render ───
function renderAll(){renderStats();renderList();if(currentView==='calendar')renderCalendar();if(currentView==='digest')renderDigest();scheduleNotifications();}

function renderStats(){
  var items=data.items.filter(function(it){return it.status==='active';});
  el.stats.total.textContent=items.length;
  var ann=items.reduce(function(s,it){return s+getAnnual(it);},0);
  el.stats.annual.textContent='£'+ann.toLocaleString();
  var act=items.filter(function(it){return it.verdict!=='renew';}).length;
  el.stats.action.textContent=act;el.stats.saved.textContent='£'+Math.round(ann*0.28).toLocaleString();
}

function renderList(){
  var items=getFiltered();
  if(items.length===0&&data.items.length===0){el.empty.style.display='block';el.items.innerHTML='';return;}
  if(items.length===0){el.empty.style.display='block';el.items.innerHTML='';return;}
  el.empty.style.display='none';var html='';
  items.forEach(function(it){
    var ann=getAnnual(it),daysUntil=Math.floor((new Date(it.renewsAt).getTime()-Date.now())/86400000);
    var urgencyClass=daysUntil<=14?'urgent':daysUntil<=30?'soon':'ok';
    html+='<div class="app-item" data-id="'+it.id+'"><div class="app-item-header" onclick="window._toggleAppItem(\''+it.id+'\')"><div class="app-item-icon">'+getIcon(it.category)+'</div><div class="app-item-body"><div class="app-item-name">'+esc(it.provider)+'</div><div class="app-item-sub">'+(it.period==='month'?'£'+it.amount.toFixed(2)+'/mo':'£'+it.amount.toFixed(2)+'/yr')+' · renews '+new Date(it.renewsAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+(daysUntil>=0?' · <span class="app-urgency app-urgency-'+urgencyClass+'">'+daysUntil+'d</span>':'')+'</div></div><span class="app-item-tag app-verdict-'+it.verdict+'">'+it.verdict+'</span></div><div class="app-item-data"><div class="app-item-data-inner"><div class="app-data-grid"><div><span class="app-data-label">annual cost</span><span class="app-data-value">£'+ann.toLocaleString()+'</span></div><div><span class="app-data-label">price change</span><span class="app-data-value '+(it.change!=='stable'?'app-data-neg':'')+'">'+it.change+'</span></div><div><span class="app-data-label">source</span><span class="app-data-value">'+it.source+'</span></div><div><span class="app-data-label">category</span><span class="app-data-value">'+it.category+'</span></div></div>'+(it.notes?'<div class="app-item-notes">'+esc(it.notes)+'</div>':'')+(it.history&&it.history.length?'<div class="app-item-history"><div class="app-item-history-title">price history</div>'+it.history.slice(-5).reverse().map(function(h){return'<div class="app-history-row"><span>'+h.date+'</span><span>£'+h.amount.toFixed(2)+'</span></div>';}).join('')+'</div>':'')+'<div class="app-item-actions"><button onclick="window._editAppItem(\''+it.id+'\')" class="app-item-act">edit</button><button onclick="window._deleteAppItem(\''+it.id+'\')" class="app-item-act app-item-act-del">delete</button></div></div></div></div>';
  });el.items.innerHTML=html;
}
function getIcon(cat){if(cat==='insurance')return'🛡️';if(cat==='subscription')return'🎬';if(cat==='broadband')return'🌐';if(cat==='domain')return'🔗';return'📄';}
function esc(s){if(!s)return'';return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ─── Edit Modal ───
function editItem(id){
  var it=data.items.find(function(x){return x.id===id;});if(!it)return;
  var html='<div class="app-modal-overlay" id="appEditModal" onclick="if(event.target===this)this.remove()"><div class="app-modal"><h3>edit renewal</h3><form id="appEditForm"><div class="app-form-grid"><div class="app-form-group"><label>provider</label><input type="text" id="efProvider" value="'+esc(it.provider)+'" required></div><div class="app-form-group"><label>amount</label><input type="text" id="efAmount" value="'+it.amount.toFixed(2)+'" required></div><div class="app-form-group"><label>period</label><select id="efPeriod"><option value="year" '+(it.period==='year'?'selected':'')+'>per year</option><option value="month" '+(it.period==='month'?'selected':'')+'>per month</option></select></div><div class="app-form-group"><label>renewal date</label><input type="date" id="efDate" value="'+it.renewsAt+'" required></div><div class="app-form-group"><label>category</label><select id="efCategory">'+['insurance','subscription','broadband','domain','other'].map(function(c){return'<option value="'+c+'" '+(it.category===c?'selected':'')+'>'+c+'</option>';}).join('')+'</select></div><div class="app-form-group"><label>price change</label><input type="text" id="efChange" value="'+esc(it.change)+'"></div><div class="app-form-group app-form-full"><label>notes</label><input type="text" id="efNotes" value="'+esc(it.notes||'')+'"></div></div><div class="app-form-actions"><button type="button" onclick="document.getElementById(\'appEditModal\').remove()" class="app-parse-btn" style="background:var(--bg-soft);color:var(--text-dim);">cancel</button><button type="submit" class="app-parse-btn">save changes</button></div></form></div></div>';
  document.body.insertAdjacentHTML('beforeend',html);
  document.getElementById('appEditForm').addEventListener('submit',function(e){e.preventDefault();var na=parseFloat(document.getElementById('efAmount').value)||0;updateHistory(it,na);it.provider=document.getElementById('efProvider').value.trim();it.period=document.getElementById('efPeriod').value;it.renewsAt=document.getElementById('efDate').value;it.category=document.getElementById('efCategory').value;it.change=document.getElementById('efChange').value||'stable';it.notes=document.getElementById('efNotes').value;it.verdict=getVerdict(it);persist();document.getElementById('appEditModal').remove();});
}
function deleteItem(id){if(!confirm('delete this item?'))return;data.items=data.items.filter(function(x){return x.id!==id;});persist();renderInsights();}
function toggleItem(id){var d=document.querySelector('.app-item[data-id="'+id+'"]');if(!d)return;var was=d.classList.contains('app-item-expanded');document.querySelectorAll('.app-item-expanded').forEach(function(x){x.classList.remove('app-item-expanded');});if(!was)d.classList.add('app-item-expanded');}
window._toggleAppItem=toggleItem;window._editAppItem=editItem;window._deleteAppItem=deleteItem;

// ─── Calendar ───
var now=new Date();calYear=now.getFullYear();calMonth=now.getMonth();
el.calPrev&&el.calPrev.addEventListener('click',function(){calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCalendar();});
el.calNext&&el.calNext.addEventListener('click',function(){calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCalendar();});
function renderCalendar(){
  var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  el.calMonth.textContent=months[calMonth]+' '+calYear;
  var firstDay=new Date(calYear,calMonth,1).getDay();firstDay=firstDay===0?6:firstDay-1;
  var daysInMonth=new Date(calYear,calMonth+1,0).getDate(),itemsByDate={};
  data.items.forEach(function(it){var d=it.renewsAt;if(!d)return;var m=parseInt(d.slice(5,7),10)-1;if(m===calMonth&&d.slice(0,4)===String(calYear)){var day=parseInt(d.slice(8,10),10);if(!itemsByDate[day])itemsByDate[day]=[];itemsByDate[day].push(it);}});
  var today=new Date().toISOString().slice(0,10);
  var html='<div class="app-cal-weekdays"><span>mon</span><span>tue</span><span>wed</span><span>thu</span><span>fri</span><span>sat</span><span>sun</span></div>';
  for(var i=0;i<firstDay;i++)html+='<div class="app-cal-day app-cal-day-empty"></div>';
  for(var d=1;d<=daysInMonth;d++){
    var ds=calYear+'-'+String(calMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),isToday=ds===today,hasItem=itemsByDate[d];
    html+='<div class="app-cal-day'+(isToday?' app-cal-today':'')+'"><span class="app-cal-day-num">'+d+'</span>';
    if(hasItem)html+='<div class="app-cal-dots">'+hasItem.map(function(it){return'<span class="app-cal-dot app-cal-dot-'+it.verdict+'" title="'+esc(it.provider)+' — £'+it.amount+'"></span>';}).join('')+'</div>';
    html+='</div>';
  }el.calGrid.innerHTML=html;
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
  if(needsAction.length>0){html+='<div class="app-digest-block"><div class="app-digest-block-heading"><span class="app-digest-dot-urgent"></span> needs action ('+needsAction.length+')</div>';needsAction.slice(0,8).forEach(function(it){var d=Math.floor((new Date(it.renewsAt).getTime()-Date.now())/86400000);html+='<div class="app-digest-row"><span class="app-digest-badge app-digest-badge-'+it.verdict+'">'+it.verdict+'</span><span>'+esc(it.provider)+'</span><span class="app-digest-meta">'+(it.period==='month'?'£'+it.amount.toFixed(2)+'/mo':'£'+it.amount.toFixed(2)+'/yr')+(d>=0?' · '+d+'d':'')+'</span></div>';});html+='</div>';}
  if(safe.length>0){html+='<div class="app-digest-block"><div class="app-digest-block-heading"><span class="app-digest-dot-ok"></span> all clear ('+safe.length+')</div>';safe.slice(0,5).forEach(function(it){html+='<div class="app-digest-row"><span class="app-digest-badge app-digest-badge-renew">renew</span><span>'+esc(it.provider)+'</span><span class="app-digest-meta">'+(it.period==='month'?'£'+it.amount.toFixed(2)+'/mo':'£'+it.amount.toFixed(2)+'/yr')+'</span></div>';});html+='</div>';}
  var ann=items.reduce(function(s,it){return s+getAnnual(it);},0);
  html+='<div class="app-digest-summary"><strong>total annual exposure:</strong> £'+ann.toLocaleString()+' · <strong>items tracked:</strong> '+items.length+' · <strong>potential savings:</strong> ~£'+Math.round(ann*0.28).toLocaleString()+'</div>';
  el.digestContent.innerHTML=html;
}

renderAll();if(data.items.length>0)renderInsights();
})();