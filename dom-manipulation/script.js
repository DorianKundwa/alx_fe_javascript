// Quotes data structure
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Self" }
];

// Function to display a random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.innerText = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}:</strong> "${quote.text}"`;
}

function createAddQuoteForm() {
  // Remove old form if present (prevent duplicating on re-call)
  const oldForm = document.getElementById('addQuoteFormWrapper');
  if (oldForm) oldForm.remove();

  const formDiv = document.createElement('div');
  formDiv.setAttribute('id', 'addQuoteFormWrapper');

  const quoteInput = document.createElement('input');
  quoteInput.setAttribute('id', 'newQuoteText');
  quoteInput.setAttribute('type', 'text');
  quoteInput.setAttribute('placeholder', 'Enter a new quote');

  const categoryInput = document.createElement('input');
  categoryInput.setAttribute('id', 'newQuoteCategory');
  categoryInput.setAttribute('type', 'text');
  categoryInput.setAttribute('placeholder', 'Enter quote category');

  const addBtn = document.createElement('button');
  addBtn.setAttribute('id', 'addQuoteBtn');
  addBtn.textContent = 'Add Quote';
  addBtn.onclick = addQuote;

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addBtn);

  // Insert after quoteDisplay/newQuote button
  const quoteBtn = document.getElementById('newQuote');
  quoteBtn.insertAdjacentElement('afterend', formDiv);
}

function addQuote() {
  const quoteTextInput = document.getElementById('newQuoteText');
  const quoteCategoryInput = document.getElementById('newQuoteCategory');
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();
  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }
  quotes.push({ text, category });
  quoteTextInput.value = '';
  quoteCategoryInput.value = '';
  showRandomQuote();
}

// Show a quote on page load
showRandomQuote();
createAddQuoteForm();
