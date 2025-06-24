// Array to store quotes
const quotes = [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
}

// Add a new quote from form
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    alert('Quote added successfully!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please fill in both fields.');
  }
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Show a quote on page load
showRandomQuote();

function createAddQuoteForm() {
  const formContainer = document.getElementById('quoteForm');

  // Create input for quote text
  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  // Create input for quote category
  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  // Create button to add quote
  const addButton = document.createElement('button');
  addButton.id = 'addQuoteBtn';
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  // Append to container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}
createAddQuoteForm(); // Dynamically builds the quote form

let quotes = [];

// Load from local storage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Be yourself; everyone else is already taken.", category: "Life" },
      { text: "Simplicity is the ultimate sophistication.", category: "Design" }
    ];
  }
}
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}
loadQuotes();  // Load from localStorage on page load
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();

  URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format!');
      }
    } catch (error) {
      alert('Error reading file!');
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes(); // Apply the saved filter
  }
}
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available for "${selectedCategory}".</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
}
function addQuote() {
    async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });

    const data = await response.json();
    console.log("Posted quote to server:", data);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert('Quote added successfully!');

    // Post to server
    postQuoteToServer(newQuote);

    // Reset form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please fill in both fields.');
  }
}

  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();
    alert('Quote added successfully!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories(); // 🟢 Update category filter
  } else {
    alert('Please fill in both fields.');
  }
}
loadQuotes();         // Load quotes from storage
populateCategories(); // Fill the filter dropdown
createAddQuoteForm(); // Show the quote adding form
filterQuotes();       // Show filtered quotes


async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();

  // Convert response to quote format
  const serverQuotes = data.slice(0, 10).map(post => ({
    text: post.title,
    category: "Server"
  }));

  return serverQuotes;
}
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  let hasConflict = false;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(local => local.text === sq.text);
    if (!exists) {
      quotes.push(sq);
      hasConflict = true;
    }
  });

  if (hasConflict) {
    alert("New quotes were synced from the server.");
    saveQuotes();
    populateCategories();
    filterQuotes();
  }
}
setInterval(syncQuotes, 30000); // sync every 30 seconds
if (hasConflict) {
  alert("New quotes were synced from the server.");
}
loadQuotes();
populateCategories();
createAddQuoteForm();
filterQuotes();
setInterval(syncWithServer, 30000); // auto-sync
