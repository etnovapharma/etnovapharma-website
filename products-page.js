const enquiry = new Map();
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const sendBtn = document.getElementById('sendEnquiry');
const notes = document.getElementById('cartNotes');
const modal = document.getElementById('productModal');
const modalProduct = document.getElementById('modalProduct');
const selectedProduct = document.getElementById('selectedProduct');

const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get('category');
if (requestedCategory && ['erectile','tablets','specialty'].includes(requestedCategory)) {
  document.getElementById('categoryFilter').value = requestedCategory;
}

function openProductModal(name){
  const p = products.find(x => x.name === name);
  if(!p) return;
  modalProduct.textContent = `${p.name} · ${p.strength} · ${p.pack}`;
  selectedProduct.value = p.name;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.getElementById('customerName').focus();
}
function closeProductModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}
document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeProductModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeProductModal(); });

function renderProducts(){
  const q=(document.getElementById('productSearch').value||'').toLowerCase().trim();
  const cat=document.getElementById('categoryFilter').value;
  const list=products.filter(p=>{
    const t=(p.name+' '+p.brand+' '+p.strength).toLowerCase();
    return (!q||t.includes(q))&&(cat==='all'||p.category===cat);
  });
  const grid=document.getElementById('productGrid');
  grid.innerHTML=list.map(p=>`<article class="product-card catalog-product product-card-clickable" tabindex="0" data-product="${encodeURIComponent(p.name)}"><div class="product-body"><span class="pill">${p.brand}</span><h3>${p.name}</h3><dl><div><dt>Strength</dt><dd>${p.strength}</dd></div><div><dt>Pack / form</dt><dd>${p.pack}</dd></div></dl><button class="btn btn-small add-enquiry" data-name="${encodeURIComponent(p.name)}">Request Availability</button></div></article>`).join('');
  document.getElementById('noResults').hidden=list.length>0;
  document.querySelectorAll('.add-enquiry').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openProductModal(decodeURIComponent(b.dataset.name));}));
  document.querySelectorAll('.product-card-clickable').forEach(card=>{
    const go=()=>openProductModal(decodeURIComponent(card.dataset.product));
    card.addEventListener('click',go);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
  });
}
function renderCart(){
  cartCount.textContent=enquiry.size;
  sendBtn.disabled=!enquiry.size;
  cartItems.innerHTML=enquiry.size?[...enquiry.values()].map(p=>`<div class="cart-item"><span>${p.name}</span><button aria-label="Remove ${p.name}" data-remove="${encodeURIComponent(p.name)}">×</button></div>`).join(''):'<div class="cart-empty">No products selected yet.</div>';
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{enquiry.delete(decodeURIComponent(b.dataset.remove));renderCart();});
}
document.getElementById('productSearch').addEventListener('input',renderProducts);
document.getElementById('categoryFilter').addEventListener('change',renderProducts);
sendBtn.addEventListener('click',()=>{const list=[...enquiry.values()].map((p,i)=>`${i+1}. ${p.name} | ${p.strength} | ${p.pack}`).join('\n');const body=`Hello Etnova Pharma,\n\nI would like to enquire about the following products:\n\n${list}\n\nQuantity / notes:\n${notes.value||''}\n\nDestination country:\n\nPlease share current price, availability, packaging and export/commercial details.`;const emailUrl=`mailto:etnovapharma@gmail.com?subject=${encodeURIComponent('Product Enquiry - Etnova Pharma')}&body=${encodeURIComponent(body)}`;const waUrl=`https://wa.me/918983128824?text=${encodeURIComponent(body)}`;window.open(waUrl,'_blank','noopener');window.location.href=emailUrl;});

document.getElementById('productEnquiryForm').addEventListener('submit',e=>{
  e.preventDefault();
  const body=`Hello Etnova Pharma,\n\nI would like to request availability for:\n${selectedProduct.value}\n\nFull Name: ${document.getElementById('customerName').value}\nCompany: ${document.getElementById('companyName').value}\nEmail: ${document.getElementById('customerEmail').value}\nPhone / WhatsApp: ${document.getElementById('customerPhone').value}\nDestination Country: ${document.getElementById('destinationCountry').value}\nRequired Quantity: ${document.getElementById('requiredQuantity').value}\nMessage: ${document.getElementById('customerMessage').value}\n\nPlease confirm current availability, pricing, packaging and export requirements.`;
  const subject='Product Availability Request - '+selectedProduct.value;
  const waUrl=`https://wa.me/918983128824?text=${encodeURIComponent(body)}`;
  const emailUrl=`mailto:etnovapharma@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(waUrl,'_blank','noopener');
  window.location.href=emailUrl;
});
renderProducts();
renderCart();
