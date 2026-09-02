document.addEventListener('DOMContentLoaded',()=>{
 const header=document.querySelector('.site-header');
 const toggle=document.querySelector('.mobile-menu-toggle');
 const nav=document.querySelector('.site-header .nav');
 if(toggle&&nav){
  toggle.addEventListener('click',()=>{
   const open=nav.classList.toggle('is-open');
   toggle.setAttribute('aria-expanded',String(open));
   toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
   nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open navigation');
  }));
 }
 const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
 const form=document.getElementById('enquiryForm');
 if(form){form.addEventListener('submit',e=>{e.preventDefault(); const d=new FormData(form); const text=`Hello Etnova Pharma,\n\nWebsite enquiry\nName: ${d.get('name')||''}\nCompany: ${d.get('company')||''}\nEmail: ${d.get('email')||''}\nCountry: ${d.get('country')||''}\nRequirement: ${d.get('message')||''}`; const subject=encodeURIComponent('Etnova Pharma Website Enquiry'); const body=encodeURIComponent(text); const wa=`https://wa.me/918983128824?text=${encodeURIComponent(text)}`; window.open(wa,'_blank','noopener'); setTimeout(()=>{window.location.href=`mailto:etnovapharma@gmail.com?subject=${subject}&body=${body}`},250);});}
});

document.addEventListener('DOMContentLoaded',()=>{
 const stars=[...document.querySelectorAll('.feedback-stars button')]; const out=document.getElementById('selectedRating'); let rating=0;
 stars.forEach(btn=>btn.addEventListener('click',()=>{rating=Number(btn.dataset.rating); stars.forEach(x=>x.classList.toggle('selected',Number(x.dataset.rating)<=rating)); if(out)out.textContent=`${rating} / 5 selected`;}));
 const f=document.getElementById('feedbackForm'); if(f)f.addEventListener('submit',e=>{e.preventDefault(); if(!rating){alert('Please select a star rating first.');return;} const d=new FormData(f); const body=`Hello Etnova Pharma,\n\nCustomer feedback\nRating: ${rating}/5\nName: ${d.get('name')}\nEmail: ${d.get('email')}\n\nFeedback:\n${d.get('feedback')}`; location.href=`mailto:etnovapharma@gmail.com?subject=${encodeURIComponent('Customer Feedback - '+rating+'/5')}&body=${encodeURIComponent(body)}`;});
});
