const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const date = document.getElementById('date');
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const transactionsUL = document.getElementById('transactions');

// Load transactions from localStorage or start empty
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.type === 'income' ? '+' : '-';
  const item = document.createElement('li');
  item.classList.add(transaction.type);
  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)} (${transaction.date})</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">&times;</button>
  `;
  transactionsUL.appendChild(item);
}

// Update balance, income, expense
function updateValues() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  balance.innerText = (income - expense).toFixed(2);
  moneyPlus.innerText = income.toFixed(2);
  moneyMinus.innerText = expense.toFixed(2);
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  transactionsUL.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || !type.value || !date.value) {
    alert('Please fill in all fields');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value.trim(),
    amount: Math.abs(parseFloat(amount.value)),
    type: type.value,
    date: date.value,
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  form.reset();
});

// Start the app
init();

// Make removeTransaction global for inline onclick
window.removeTransaction = removeTransaction;
