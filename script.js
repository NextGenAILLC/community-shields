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
    themeIcon.textContent=dark?'☀':'☾';
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

  const form=document.getElementById('interest-form');
  const submitButton=document.getElementById('submit-button');
  const submitLabel=document.getElementById('submit-label');
  const feedback=document.getElementById('form-feedback');
  const mode=document.getElementById('form-mode');
  const draftPanel=document.getElementById('draft-panel');
  const draftText=document.getElementById('draft-text');
  const copyDraft=document.getElementById('copy-draft');

  // Only send to a valid Formspree form ID. Never post a visitor's information to an unconfigured URL.
  const url=form.getAttribute('action');
  const endpointPattern=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
  const configured=endpointPattern.test(url)&&!url.includes('REPLACE_WITH');
  if(configured){
    mode.textContent='Your inquiry will be securely sent through Formspree.';
  }else{
    mode.classList.add('is-preview');
    mode.textContent='Preview mode — the contact inbox has not been connected yet. No information will be sent.';
  }
  function inform(message,type){
    feedback.hidden=false;
    feedback.className='form-feedback '+type;
    feedback.textContent=message;
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
    draftPanel.hidden=true;
    if(!form.checkValidity()){
      form.reportValidity();
      inform('Please complete the required fields and agree to be contacted.','error');
      return;
    }
    const data=new FormData(form);
    if(data.get('_gotcha'))return; // Honeypot: silently ignore automated spam.
    if(!configured){
      const lines=[
        'Subject: Community Shields — New town interest',
        '',
        'Name: '+data.get('name'),
        'Email: '+data.get('email'),
        'Town / community: '+data.get('town'),
        'Role: '+data.get('role'),
        '',
        'Community interests / needs:',
        data.get('message')||'(Not provided)',
        '',
        'Permission to contact: Yes'
      ];
      draftText.value=lines.join('\n');
      draftPanel.hidden=false;
      inform('The contact inbox is not configured. No message was sent. A copyable draft is shown below.','info');
      draftPanel.scrollIntoView({block:'nearest',behavior:'smooth'});
      return;
    }
    submitButton.disabled=true;
    submitLabel.textContent='Sending…';
    submitButton.setAttribute('aria-busy','true');
    try{
      const response=await fetch(url,{method:'POST',body:data,headers:{'Accept':'application/json'}});
      if(response.ok){
        inform('Thank you! Your message was sent successfully. The team can review your Community Shields inquiry.','success');
        form.reset();
      }else{
        let errorMessage='We could not send your message. Please try again.';
        try{
          const result=await response.json();
          if(Array.isArray(result.errors)&&result.errors.length){
            errorMessage=result.errors.map(x=>x.message).filter(x=>typeof x==='string').join(' ');
          }else if(typeof result.error==='string'){errorMessage=result.error;}
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
  copyDraft.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(draftText.value);
      copyDraft.textContent='Copied!';
      copyDraft.setAttribute('aria-label','Message draft copied');
    }catch(_){
      draftText.focus();draftText.select();
      copyDraft.textContent='Select all and copy';
    }
  });
})();
