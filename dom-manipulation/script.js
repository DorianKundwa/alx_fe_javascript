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

// Function to handle adding new quotes
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

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
