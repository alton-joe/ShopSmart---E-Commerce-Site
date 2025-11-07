function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

function getCart(){
  return JSON.parse(localStorage.getItem('shop_cart') || '[]');
}
function saveCart(cart){
  localStorage.setItem('shop_cart', JSON.stringify(cart));
}
function addToCartId(id, qty=1){
  const products = JSON.parse(localStorage.getItem('shop_products')||'[]');
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += qty;
  else cart.push({id:p.id,name:p.name,price:p.price,qty});
  saveCart(cart);
}
function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('[id^="nav-cart"]').forEach(el=>{
    el.textContent = `Cart (${count})`;
  });
}
function showToast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position='fixed';el.style.right='18px';el.style.bottom='18px';
  el.style.padding='10px 14px';el.style.background='rgba(0,0,0,0.8)';el.style.color='#fff';
  el.style.borderRadius='8px';el.style.zIndex=9999;el.style.fontSize='14px';
  document.body.appendChild(el);
  setTimeout(()=>el.style.opacity='0',1200);
  setTimeout(()=>el.remove(),1800);
}

function renderCart(){
  const area = document.getElementById('cartArea');
  const cart = getCart();
  if(!area) return;
  if(cart.length===0){
    area.innerHTML = '<p class="muted">Your cart is empty. <a href="products.html">Shop products</a></p>';
    updateCartCount();
    return;
  }

  const products = JSON.parse(localStorage.getItem('shop_products')||'[]');
  let total = 0;
  area.innerHTML = '';
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id) || {};
    total += item.qty * (item.price || 0);
    const div = document.createElement('div');
    div.className = 'cart-row';
    div.innerHTML = `
      <div style="flex:1"><strong>${escapeHtml(item.name)}</strong><div class="muted">₹ ${item.price} each</div></div>
      <div>
        <input class="qty-input" type="number" min="1" value="${item.qty}" data-id="${item.id}">
      </div>
      <div style="width:90px;text-align:right"><strong>₹ ${item.qty * item.price}</strong></div>
      <div><button class="btn ghost remove-btn" data-id="${item.id}">Remove</button></div>
    `;
    area.appendChild(div);
  });

  const summary = document.createElement('div');
  summary.className = 'card';
  summary.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
    <div><strong>Total</strong></div><div><strong>₹ ${total}</strong></div>
  </div>
  <div style="margin-top:12px;display:flex;gap:8px">
    <a class="btn primary" href="checkout.html">Proceed to checkout</a>
    <button id="clearCart" class="btn ghost">Clear cart</button>
  </div>`;
  area.appendChild(summary);

  area.querySelectorAll('.qty-input').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = Number(e.target.dataset.id);
      const val = Math.max(1, Number(e.target.value) || 1);
      const cart = getCart();
      const it = cart.find(x=>x.id===id);
      if(it) it.qty = val;
      saveCart(cart);
      renderCart(); updateCartCount();
    });
  });

  area.querySelectorAll('.remove-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = Number(b.dataset.id);
      let cart = getCart();
      cart = cart.filter(x=>x.id!==id);
      saveCart(cart);
      renderCart(); updateCartCount();
    });
  });

  document.getElementById('clearCart').addEventListener('click', ()=>{
    if(confirm('Clear cart?')) {
      localStorage.removeItem('shop_cart');
      renderCart(); updateCartCount();
    }
  });

  updateCartCount();
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(!localStorage.getItem('shop_products')) {
    const sampleProducts = [
      {id:1, name:"Urban Headphones", price:2899, desc:"Comfortable wireless headphones with strong bass.", color:"#FFEFD5"},
      {id:2, name:"Smart Watch Plus", price:2299, desc:"Track fitness, calls & notifications in style.", color:"#E6F7FF"},
      {id:3, name:"Compact Bluetooth Speaker", price:1799, desc:"Small size, big sound. Portable and loud.", color:"#FFF0F5"},
      {id:4, name:"Ergo Mechanical Keyboard", price:2199, desc:"Tactile keys, RGB, built to type.", color:"#F8FFF0"}
    ];
    localStorage.setItem('shop_products', JSON.stringify(sampleProducts));
  }
  updateCartCount();
});
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
