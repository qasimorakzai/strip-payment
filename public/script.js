let stripe = null;
let elements = null;

// Split elements
let cardNumberEl = null;
let cardExpiryEl = null;
let cardCvcEl = null;

let selectedProduct = null;

// DOM
const grid = document.getElementById('productsGrid');
const modal = document.getElementById('paymentModal');
const form = document.getElementById('paymentForm');
const payBtn = document.getElementById('payButton');
const errorsBox = document.getElementById('card-errors');
const successBox = document.getElementById('successMessage');

const fetchJSON = async (url, opts = {}) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

const price = (n) => `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;


document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeStripe();
    await loadProducts();
  } catch (e) {
    console.error(e);
    grid.innerHTML = `<div class="card"><div class="error" style="display:block">Initialization failed. Check .env Stripe keys.</div></div>`;
  }
});


async function initializeStripe() {
  const { publishableKey } = await fetchJSON('/api/stripe-key');
  stripe = Stripe(publishableKey);
  elements = stripe.elements();
}

function mountSplitElements() {
  const style = {
    base: {
      fontSize: '16px',
      color: '#111827',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#b91c1c' },
  };

  
  destroyElements();

  cardNumberEl = elements.create('cardNumber', { style, showIcon: true });
  cardExpiryEl = elements.create('cardExpiry', { style });
  cardCvcEl = elements.create('cardCvc', { style });

  cardNumberEl.mount('#card-number');
  cardExpiryEl.mount('#card-expiry');
  cardCvcEl.mount('#card-cvc');

  [cardNumberEl, cardExpiryEl, cardCvcEl].forEach(el => {
    el.on('change', (event) => event.error ? showError(event.error.message) : hideError());
  });
}

function destroyElements() {
  try { cardNumberEl?.destroy(); } catch {}
  try { cardExpiryEl?.destroy(); } catch {}
  try { cardCvcEl?.destroy(); } catch {}
  cardNumberEl = cardExpiryEl = cardCvcEl = null;
}


async function loadProducts() {
  grid.innerHTML = '';
  const products = await fetchJSON('/api/products');

  if (!products.length) {
    grid.innerHTML = `<div class="card">No products available</div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="card">
      <span class="badge">${p.name}</span>
      <img class="product-img"
           src="${p.image}"
           referrerpolicy="no-referrer"
           loading="lazy"
           alt="${p.name}"
           onerror="this.src='https://www.notebookcheck.net/fileadmin/_processed_/webp/Notebooks/Apple/MacBook_Air_13_M4_Entry/mba_13_m4_case_07-JPG-q82-w2560-h.webp'">
      <h3 class="name">${p.name}</h3>
      <p class="desc">${p.description}</p>
      <div class="price">${price(p.price)}</div>
      <button class="btn" onclick="buyProduct('${p._id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">
        Buy Now
      </button>
    </div>
  `).join('');
}

window.buyProduct = (id, name, price) => {
  selectedProduct = { id, name, price };
  openModal();
};


function openModal() {
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  mountSplitElements();
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  resetForm();
}
window.closeModal = closeModal;

function resetForm() {
  form.reset();
  hideError();
  successBox.style.display = 'none';
  destroyElements();
  selectedProduct = null;
}

function showError(msg) {
  errorsBox.textContent = msg;
  errorsBox.style.display = 'block';
  document.querySelectorAll('.stripe-host').forEach(h => h.classList.add('error'));
}
function hideError() {
  errorsBox.style.display = 'none';
  document.querySelectorAll('.stripe-host').forEach(h => h.classList.remove('error'));
}
function showSuccess(msg) {
  successBox.textContent = msg;
  successBox.style.display = 'block';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedProduct) return alert('Select a product first');

  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  if (!name || !email) return showError('Please fill in name and email');

  payBtn.disabled = true; payBtn.textContent = 'Processing…';

  try {
  
    const { clientSecret, orderId } = await fetchJSON('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        productId: selectedProduct.id,
        customerName: name,
        customerEmail: email,
      }),
    });

   
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberEl,      // cardNumber carries other fields implicitly
        billing_details: { name, email },
      },
    });
    if (error) throw new Error(error.message);

  
    await fetchJSON('/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });

    showSuccess(`Payment successful! Thanks for purchasing ${selectedProduct.name}.`);
    setTimeout(() => closeModal(), 2200);
  } catch (err) {
    console.error(err);
    showError(err.message);
  } finally {
    payBtn.disabled = false; payBtn.textContent = 'Pay Now';
  }
});


window.onclick = (e) => { if (e.target === modal) closeModal(); };


