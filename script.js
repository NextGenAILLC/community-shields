(()=>{
  'use strict';
  const doc=document.documentElement;
  const themeButton=document.getElementById('theme-toggle');
  const themeIcon=document.getElementById('theme-icon');
  const nav=document.getElementById('primary-nav');
  const menuButton=document.getElementById('menu-toggle');
  document.getElementById('year').textContent=new Date().getFullYear();
  function applyTheme(theme){
    const dark=theme==='dark';
    doc.setAttribute('data-theme',dark?'dark':'light');
    themeButton.setAttribute('aria-pressed',String(dark));
    themeButton.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
    themeIcon.textContent=dark?'\u2600':'\u263E';
    try{localStorage.setItem('community-shields-theme',dark?'dark':'light')}catch(e){}
  }
  let initial='light';
  try{initial=localStorage.getItem('community-shields-theme')||'light'}catch(e){}
  applyTheme(initial);
  themeButton.addEventListener('click',()=>applyTheme(doc.getAttribute('data-theme')==='dark'?'light':'dark'));
  menuButton.addEventListener('click',()=>{
    const open=!nav.classList.contains('open');
    nav.classList.toggle('open',open);
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');
  }));

  // Town / community autocomplete: Wisconsin places list (suggestions only - any place name can be typed).
  const townList=document.getElementById('wi-places');
  if(townList&&Array.isArray(window.WI_PLACES)){
    const frag=document.createDocumentFragment();
    window.WI_PLACES.forEach(function(name){const opt=document.createElement('option');opt.value=name;frag.appendChild(opt);});
    townList.appendChild(frag);
  }

  const form=document.getElementById('interest-form');
  const submitButton=document.getElementById('submit-button');
  const submitLabel=document.getElementById('submit-label');
  const feedback=document.getElementById('form-feedback');
  const message=document.getElementById('message');
  const url=form.getAttribute('action');

  // Tappable examples for the needs box: each tap adds the idea in plain words.
  document.querySelectorAll('[data-need]').forEach(function(chip){
    chip.addEventListener('click',function(){
      const text=chip.getAttribute('data-need');
      if(!message)return;
      const current=message.value.trim();
      if(current.toLowerCase().indexOf(text.toLowerCase())!==-1){message.focus();return;}
      message.value=current?(current.replace(/[.\s]+$/,'')+'. '+text+'.'):text+'.';
      message.focus();
    });
  });

  function inform(text,type){
    feedback.hidden=false;
    feedback.className='form-feedback '+type;
    feedback.textContent=text;
  }
  const fieldIds=['name','email','town','role'];
  fieldIds.forEach(id=>{
    const field=document.getElementById(id);
    field.addEventListener('invalid',()=>field.setAttribute('aria-invalid','true'));
    field.addEventListener('input',()=>{if(field.checkValidity())field.removeAttribute('aria-invalid')});
    field.addEventListener('change',()=>{if(field.checkValidity())field.removeAttribute('aria-invalid')});
  });
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    feedback.hidden=true;
    if(!form.checkValidity()){
      form.reportValidity();
      inform('Please complete the required fields and agree to be contacted.','error');
      return;
    }
    const data=new FormData(form);
    if(data.get('_gotcha'))return; // Honeypot: silently ignore automated spam.
    submitButton.disabled=true;
    submitLabel.textContent='Sending\u2026';
    submitButton.setAttribute('aria-busy','true');
    try{
      const response=await fetch(url,{method:'POST',body:data,headers:{'Accept':'application/json'}});
      if(response.ok){
        inform('Thank you \u2014 you\u2019re on the list. The Community Shields team will follow up by email.','success');
        form.reset();
      }else{
        let errorMessage='We could not send your message. Please try again \u2014 or reach us at hello@nextgenerationai360.com.';
        try{
          const result=await response.json();
          if(Array.isArray(result.errors)&&result.errors.some(x=>x&&x.field==='email')){
            errorMessage='Please double-check your email address and try again.';
          }
        }catch(_){}
        inform(errorMessage,'error');
      }
    }catch(err){
      inform('A network error prevented your message from sending. Please check your connection and try again.','error');
    }finally{
      submitButton.disabled=false;
      submitLabel.textContent='Raise my hand';
      submitButton.removeAttribute('aria-busy');
    }
  });
})();
