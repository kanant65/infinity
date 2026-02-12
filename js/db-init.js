/**
 * DATABASE INITIALIZATION
 * This script simulates a database using LocalStorage.
 * It injects default data for Products, Users, and Orders.
 */

const defaultProducts = [
    { id: "P101", name: "Premium Wireless Headphones", price: 199, category: "Electronics", img: "https://via.placeholder.com/150" },
    { id: "P102", name: "Smart Fitness Watch", price: 149, category: "Electronics", img: "https://via.placeholder.com/150" },
    { id: "P103", name: "Ergonomic Office Chair", price: 299, category: "Furniture", img: "https://via.placeholder.com/150" }
];

const defaultUsers = [
    { email: "admin@practice.com", password: "password123", role: "admin" },
    { email: "test@user.com", password: "password123", role: "user" }
];

const defaultOrders = [];

function initDatabase() {
    // Inject Products if empty
    if (!localStorage.getItem('customProducts')) {
        localStorage.setItem('customProducts', JSON.stringify(defaultProducts));
        console.log("DB: Products Injected");
    }

    // Inject Users if empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log("DB: Users Injected");
    }

    // Initialize Orders array if empty
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(defaultOrders));
        console.log("DB: Orders Table Initialized");
    }

    // Migrate old orderHistory to new orders table if it exists
    const oldOrderHistory = localStorage.getItem('orderHistory');
    if (oldOrderHistory) {
        try {
            const orders = JSON.parse(oldOrderHistory);
            if (orders.length > 0) {
                const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                // Merge without duplicates
                const mergedOrders = [...currentOrders];
                orders.forEach(order => {
                    if (!mergedOrders.find(o => o.orderId === order.orderId)) {
                        mergedOrders.push(order);
                    }
                });
                localStorage.setItem('orders', JSON.stringify(mergedOrders));
                console.log("DB: Migrated legacy orderHistory to orders table");
            }
        } catch (e) {
            console.error("DB: Error migrating orderHistory", e);
        }
    }
}

// Run initialization
initDatabase();