'use strict';
const LANG_KEY='robo-language';
const DOCS=Object.freeze({
  guide:{file:'files/ROBO_Experience_Guide_AR.pdf',ar:'دليل تجربة ROBO',en:'ROBO Experience Guide',back:'join.html'},
  participation:{file:'files/ROBO_Participation_Terms_Privacy_AR.pdf',ar:'شروط المشاركة والخصوصية',en:'Participation Terms & Privacy',back:'join.html'},
  privacy:{file:'files/ROBO_Privacy_Policy_AR.pdf',ar:'سياسة خصوصية ROBO',en:'ROBO Privacy Policy',back:'legal.html'},
  use:{file:'files/ROBO_Terms_of_Use_AR.pdf',ar:'شروط استخدام ROBO',en:'ROBO Terms of Use',back:'legal.html'}
});
function currentLang(){return document.documentElement.lang==='en'?'en':'ar';}
function setLanguage(language){
  const lang=language==='en'?'en':'ar';
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(node=>{
    node.textContent=node.getAttribute('data-'+lang);
  });
  document.querySelectorAll('.lang').forEach(button=>{button.textContent=lang==='ar'?'EN':'عربي';});
  const title=document.getElementById('pdfTitle');
  if(title && title.dataset.docKey && DOCS[title.dataset.docKey]) title.textContent=DOCS[title.dataset.docKey][lang];
  try{localStorage.setItem(LANG_KEY,lang);}catch(_e){}
}
function initViewer(){
  const frame=document.getElementById('pdfFrame');if(!frame)return;
  const key=new URLSearchParams(location.search).get('doc');
  // Explicit whitelist prevents URL or path traversal through query parameters.
  const doc=Object.prototype.hasOwnProperty.call(DOCS,key)?DOCS[key]:null;
  if(!doc){location.replace('legal.html');return;}
  const title=document.getElementById('pdfTitle');title.dataset.docKey=key;title.textContent=doc[currentLang()];
  frame.src=doc.file+'#toolbar=1&navpanes=0';
  document.getElementById('pdfDownload').href=doc.file;
  document.getElementById('pdfDirect').href=doc.file;
  document.getElementById('goBack').addEventListener('click',()=>{
    let sameOrigin=false;
    try{sameOrigin=!!document.referrer && new URL(document.referrer).origin===location.origin;}catch(_e){}
    if(sameOrigin && history.length>1)history.back();else location.href=doc.back;
  });
}
function initForm(){
  const form=document.getElementById('participationForm');if(!form)return;
  const endpoint=window.ROBO_CONFIG&&window.ROBO_CONFIG.sheetsEndpoint;
  if(typeof endpoint==='string' && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)){
    form.action=endpoint;
  }
  form.addEventListener('submit',e=>{
    const email=form.querySelector('#email');
    const marketing=form.querySelector('input[name="marketing_consent"]');
    if(marketing.checked && !email.value.trim()){
      e.preventDefault();email.setCustomValidity(currentLang()==='ar'?'أدخل بريدك الإلكتروني للاشتراك.':'Enter your email to subscribe.');email.reportValidity();return;
    }
    email.setCustomValidity('');
  });
  form.querySelector('#email').addEventListener('input',e=>e.target.setCustomValidity(''));
}
document.addEventListener('DOMContentLoaded',()=>{
  let saved='ar';try{saved=localStorage.getItem(LANG_KEY)||'ar';}catch(_e){}
  setLanguage(saved);
  document.querySelectorAll('.lang').forEach(b=>b.addEventListener('click',()=>setLanguage(currentLang()==='ar'?'en':'ar')));
  const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');
  if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));}
  initViewer();initForm();
});
