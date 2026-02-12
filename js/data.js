// Note: Products are initialized via db-init.js into localStorage
// Retrieve from storage or use default
const products = JSON.parse(localStorage.getItem('customProducts')) || [
    { id: "P101", name: "Premium Wireless Headphones", price: 199, category: "Electronics", img: "https://via.placeholder.com/150" },
    { id: "P102", name: "Smart Fitness Watch", price: 149, category: "Electronics", img: "https://via.placeholder.com/150" },
    { id: "P103", name: "Ergonomic Office Chair", price: 299, category: "Furniture", img: "https://via.placeholder.com/150" }
];