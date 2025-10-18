// Quotes data structure
let defaultQuotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Self" }
];

function loadQuotes() {
  const saved = localStorage.getItem('quotes');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...defaultQuotes];
    }
  }
  return [...defaultQuotes];
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

let quotes = loadQuotes();

function saveLastQuoteIndex(index) { sessionStorage.setItem('lastViewedQuoteIndex', String(index)); }
function getLastQuoteIndex() { const idx = sessionStorage.getItem('lastViewedQuoteIndex'); return idx !== null ? parseInt(idx, 10) : null; }

function saveLastFilterCategory(category) {
  localStorage.setItem('lastFilterCategory', category);
}
function loadLastFilterCategory() {
  return localStorage.getItem('lastFilterCategory') || 'all';
}

// Populate the category dropdown based on quotes
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  let existing = new Set();

  // Save current selected value (so we don't surprise the user)
  const lastValue = select.value;

  // Remove all options except first ('all')
  while (select.options.length > 1) select.remove(1);
  quotes.forEach(q => existing.add(q.category));
  Array.from(existing).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  // Restore last selected filter
  if ([...existing, 'all'].includes(lastValue)) {
    select.value = lastValue;
  } else {
    select.value = 'all';
  }
}

// Display a random filtered quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const category = document.getElementById('categoryFilter')?.value || 'all';
  let availableQuotes = (category === 'all') ? quotes : quotes.filter(q => q.category === category);
  if (availableQuotes.length === 0) {
    quoteDisplay.innerText = 'No quotes available for this category.';
    return;
  }
  let randomIndex = Math.floor(Math.random() * availableQuotes.length);
  saveLastQuoteIndex(randomIndex);
  const quote = availableQuotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}:</strong> "${quote.text}"`;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Filtering logic
defaultFilteredQuotes = null;
function filterQuotes() {
  const select = document.getElementById('categoryFilter');
  const category = select.value;
  saveLastFilterCategory(category);
  showQuotesForCategory(category);
}

function showQuotesForCategory(category) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filtered = (category === 'all') ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length === 0) {
    quoteDisplay.innerText = 'No quotes available for this category.';
    return;
  }
  // Show all matching quotes (or random if preferred)
  // Here, display just the first, to keep simple for now:
  const first = filtered[0];
  quoteDisplay.innerHTML = `<strong>${first.category}:</strong> "${first.text}"`;
}

// Create add quote form
function createAddQuoteForm() {
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
  saveQuotes();
  quoteTextInput.value = '';
  quoteCategoryInput.value = '';
  populateCategories();
  // Set category filter to new category
  document.getElementById('categoryFilter').value = category;
  filterQuotes();
}

function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1500);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("File must contain an array of quotes");
      for (const q of importedQuotes) {
        if (!q.text || !q.category) throw new Error("Each quote must have text and category");
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      populateCategories();
      filterQuotes();
    } catch (e) {
      alert('Failed to import: ' + e.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- INIT ---
populateCategories();
const lastCategory = loadLastFilterCategory();
document.getElementById('categoryFilter').value = lastCategory;
filterQuotes();
createAddQuoteForm();
