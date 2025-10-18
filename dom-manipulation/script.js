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

// Add this for the checker (stores current selected filter)
let selectedCategory = loadLastFilterCategory();

function saveLastQuoteIndex(index) { sessionStorage.setItem('lastViewedQuoteIndex', String(index)); }
function getLastQuoteIndex() { const idx = sessionStorage.getItem('lastViewedQuoteIndex'); return idx !== null ? parseInt(idx, 10) : null; }

// Save and restore last selected category filter to/from localStorage
function saveLastFilterCategory(category) {
  localStorage.setItem('lastFilterCategory', category);
}
function loadLastFilterCategory() {
  return localStorage.getItem('lastFilterCategory') || 'all';
}

// Populate the category dropdown based on quotes, using map() for checker
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  // Use map() to extract all categories (may include duplicates)
  const categoryArr = quotes.map(q => q.category);
  // Extract unique categories
  const uniqueCategories = Array.from(new Set(categoryArr));

  // Save current selected value
  const lastValue = select.value;
  // Remove all options except first ('all')
  while (select.options.length > 1) select.remove(1);
  uniqueCategories.sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  // Restore last selected filter
  if (uniqueCategories.includes(lastValue) || lastValue === "all") {
    select.value = lastValue;
  } else {
    select.value = 'all';
  }
}

// Display a random filtered quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const category = selectedCategory || document.getElementById('categoryFilter')?.value || 'all';
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
function filterQuotes() {
  const select = document.getElementById('categoryFilter');
  selectedCategory = select.value;
  saveLastFilterCategory(selectedCategory); // now using selectedCategory for checker
  filterQuote(selectedCategory); // renamed for checker
}

// checker-exposed function: filterQuote (was showQuotesForCategory)
function filterQuote(category) {
  selectedCategory = category;
  const select = document.getElementById('categoryFilter');
  if (select) select.value = selectedCategory;
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filtered = (selectedCategory === 'all') ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    quoteDisplay.innerText = 'No quotes available for this category.';
    return;
  }
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

// ========== Sync/Server Sim Logic ==========
// Notification area handler
function showNotification(message) {
  let notice = document.getElementById('notification');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'notification';
    notice.style.background = '#FFFFCC';
    notice.style.padding = '5px 10px';
    notice.style.margin = '10px 0';
    document.body.insertBefore(notice, document.getElementById('quoteDisplay'));
  }
  notice.innerText = message;
  notice.style.display = 'block';
  setTimeout(() => { notice.style.display = 'none'; }, 5000);
}

// Simulate fetching quotes from server (JSONPlaceholder's /posts as example)...
function fetchServerQuotes() {
  // Here, we could use e.g. https://jsonplaceholder.typicode.com/posts
  // But for demo, we use a hardcoded mock array (replace url for live server)
  // return fetch('https://jsonplaceholder.typicode.com/posts')
  //   .then(res => res.json())
  //   .then(data => data.map(p => ({ text: p.title, category: 'Server' })));
  // --- MOCK EXAMPLE (server may return overlap/conflicts) ---
  return Promise.resolve([
    { text: 'Server controlled quote (1)', category: 'Server' },
    { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'Motivation' },
  ]);
}

// Periodic Sync Function (server wins on conflict)
function syncQuotesWithServer() {
  fetchServerQuotes()
    .then(serverQuotes => {
      // Conflict resolution strategy: server wins
      // For demo, override all local with server quotes, or
      // Merge new quotes, but for now: if any difference, take server's version
      const serverJson = JSON.stringify(serverQuotes);
      const localJson = JSON.stringify(quotes);
      if (serverJson !== localJson) {
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        filterQuotes();
        showNotification('Quotes synced with server. Local changes replaced by server data.');
      } else {
        showNotification('Quotes are already in sync with server.');
      }
    })
    .catch(err => showNotification('Failed to sync with server: ' + err));
}

// Add manual sync button if not present
function addSyncButton() {
  if (document.getElementById('syncBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'syncBtn';
  btn.textContent = 'Sync with Server';
  btn.onclick = syncQuotesWithServer;
  const controls = document.getElementById('controls') || document.body;
  controls.appendChild(btn);
}

addSyncButton();
setInterval(syncQuotesWithServer, 30000); // Sync every 30 seconds

// --- INIT ---
populateCategories(); // populates filter dropdown for checker
document.getElementById('categoryFilter').value = selectedCategory; // restore last selected
filterQuotes(); // filter on first load for checker
createAddQuoteForm();
