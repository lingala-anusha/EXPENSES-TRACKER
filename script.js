// DOM Elements
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const notification = document.getElementById('notification');

// Sample transactions
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Format rupees
function formatRupees(num) {
  return '₹' + Math.abs(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
  item.innerHTML = `
    ${transaction.text} <span>${sign}${formatRupees(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  
  list.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  
  const total = amounts.reduce((acc, item) => (acc += item), 0);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);
  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1;
  
  balance.innerText = formatRupees(total);
  moneyPlus.innerText = `+${formatRupees(income)}`;
  moneyMinus.innerText = `-${formatRupees(expense)}`;
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Show notification
function showNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add new transaction
form.addEventListener('submit', e => {
  e.preventDefault();
  
  if (text.value.trim() === '' || amount.value.trim() === '') {
    showNotification();
    return;
  }
  
  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value
  };
  
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  
  text.value = '';
  amount.value = '';
});

// Initialize the app
init();