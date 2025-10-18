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

// --- SessionStorage for last viewed quote ---
function saveLastQuoteIndex(index) {
  sessionStorage.setItem('lastViewedQuoteIndex', String(index));
}

function getLastQuoteIndex() {
  const idx = sessionStorage.getItem('lastViewedQuoteIndex');
  return idx !== null ? parseInt(idx, 10) : null;
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.innerText = 'No quotes available.';
    return;
  }
  let randomIndex = Math.floor(Math.random() * quotes.length);
  saveLastQuoteIndex(randomIndex);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}:</strong> "${quote.text}"`;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// --- FORM CREATOR ---
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
  saveQuotes();
  quoteTextInput.value = '';
  quoteCategoryInput.value = '';
  showRandomQuote();
}

// --- EXPORT ---
function createJsonExportButton() {
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Quotes (JSON)';
  exportBtn.onclick = function() {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  // Insert after add-quote form wrapper
  const formDiv = document.getElementById('addQuoteFormWrapper');
  formDiv.insertAdjacentElement('afterend', exportBtn);
}

// --- IMPORT ---
function createJsonImportInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'importFile';
  input.accept = '.json';
  input.addEventListener('change', importFromJsonFile);

  // Insert after export button
  const exportBtn = document.querySelector('button[download], button:contains("Export Quotes")');
  document.body.appendChild(input); // Ensures it is visible even if above selector fails
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("File must contain an array of quotes");
      for (const q of importedQuotes) {
        if (!q.text || !q.category) throw new Error("Each quote must have text and category");
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      showRandomQuote();
    } catch (e) {
      alert('Failed to import: ' + e.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- INIT ---
showRandomQuote();
createAddQuoteForm();
createJsonExportButton();
createJsonImportInput();
// If desired, restore last viewed quote using sessionStorage (optional, could display on load)
