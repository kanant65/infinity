/**
 * GLOBAL SEARCH FUNCTIONALITY
 * Handles product search across the site
 */

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performGlobalSearch();
            }
        });
    }
});

/**
 * Perform global product search
 * Searches by product title and category
 */
async function performGlobalSearch() {
    const searchQuery = document.getElementById('global-search').value.trim();
    
    if (!searchQuery) {
        alert('Please enter a search term');
        return;
    }

    try {
        // Fetch all products from dummyjson API
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        
        // Filter products based on search query (case-insensitive)
        const filteredProducts = data.products.filter(product => 
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            alert('No products found matching: "' + searchQuery + '"');
            return;
        }

        // Store search results in localStorage and redirect to search results page
        localStorage.setItem('searchQuery', searchQuery);
        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
        
        // Redirect to PLP with search mode
        window.location.href = 'plp.html?search=true';
        
    } catch (error) {
        console.error('Search error:', error);
        alert('Error performing search. Please try again.');
    }
}

/**
 * Display search results on PLP
 * Called automatically when plp.html loads with search=true param
 */
function displaySearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const isSearchMode = urlParams.get('search') === 'true';
    
    if (!isSearchMode) {
        return; // Not in search mode, use normal PLP
    }

    const searchQuery = localStorage.getItem('searchQuery');
    const searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
    
    if (searchResults.length === 0) {
        document.getElementById('product-list').innerHTML = '<p style="color: #666; padding: 40px;">No products found.</p>';
        return;
    }

    // Display search results
    const productList = document.getElementById('product-list');
    const html = searchResults.map(product => `
        <div style="display: inline-block; margin: 10px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); width: 200px; text-align: center;">
            <img src="${product.thumbnail}" alt="${product.title}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px;">
            <h4 style="margin: 10px 0; font-size: 0.95rem;">${product.title}</h4>
            <p style="color: #666; font-size: 0.85rem; margin-bottom: 10px;">${product.category}</p>
            <p style="margin: 10px 0; font-weight: bold; color: #B12704;">$${product.price}</p>
            <p style="margin: 5px 0; font-size: 0.9rem;">⭐ ${product.rating} (${product.reviews ? product.reviews.length : 0} reviews)</p>
            <a href="pdp.html?id=${product.id}" class="btn" style="display: inline-block; padding: 8px 12px; background: #007185; color: white; text-decoration: none; border-radius: 4px; margin-top: 10px;">View Details</a>
        </div>
    `).join('');

    productList.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>Search Results for "${searchQuery}" (${searchResults.length} products found)</h3>
            <button onclick="clearSearch()" style="padding: 8px 12px; background: #ddd; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">View All Products</button>
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center;">
            ${html}
        </div>
    `;
}

/**
 * Clear search and return to normal PLP
 */
function clearSearch() {
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('searchResults');
    window.location.href = 'plp.html';
}
