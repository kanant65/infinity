/**
 * DATABASE MANAGER
 * Central utility for all database operations
 * Uses localStorage as the persistent database layer
 */

const DBManager = {
    /**
     * ORDERS MANAGEMENT
     */
    
    // Add a new order to the database
    addOrder(order) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            
            // Ensure order has required fields
            const completeOrder = {
                orderId: order.orderId || "ORD-" + Math.floor(Math.random() * 1000000),
                user: order.user,
                items: order.items || [],
                total: order.total || 0,
                date: order.date || new Date().toISOString(),
                status: order.status || "pending",
                shippingInfo: order.shippingInfo || {},
                paymentInfo: order.paymentInfo || {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            orders.push(completeOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            console.log("Order saved:", completeOrder.orderId);
            return completeOrder;
        } catch (e) {
            console.error("Error saving order:", e);
            return null;
        }
    },

    // Get all orders
    getAllOrders() {
        try {
            return JSON.parse(localStorage.getItem('orders') || '[]');
        } catch (e) {
            console.error("Error retrieving orders:", e);
            return [];
        }
    },

    // Get orders for a specific user
    getOrdersByUser(email) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            return orders.filter(o => o.user === email);
        } catch (e) {
            console.error("Error retrieving user orders:", e);
            return [];
        }
    },

    // Get a single order by ID
    getOrderById(orderId) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            return orders.find(o => o.orderId === orderId);
        } catch (e) {
            console.error("Error retrieving order:", e);
            return null;
        }
    },

    // Update order status
    updateOrderStatus(orderId, status) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(o => o.orderId === orderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                orders[orderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
                console.log("Order status updated:", orderId, status);
                return orders[orderIndex];
            }
            return null;
        } catch (e) {
            console.error("Error updating order:", e);
            return null;
        }
    },

    // Delete an order
    deleteOrder(orderId) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const filteredOrders = orders.filter(o => o.orderId !== orderId);
            localStorage.setItem('orders', JSON.stringify(filteredOrders));
            console.log("Order deleted:", orderId);
            return true;
        } catch (e) {
            console.error("Error deleting order:", e);
            return false;
        }
    },

    // Get order statistics
    getOrderStats() {
        try {
            const orders = this.getAllOrders();
            return {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
                pendingOrders: orders.filter(o => o.status === 'pending').length,
                completedOrders: orders.filter(o => o.status === 'completed').length,
                averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0
            };
        } catch (e) {
            console.error("Error calculating stats:", e);
            return {
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                completedOrders: 0,
                averageOrderValue: 0
            };
        }
    },

    /**
     * USERS MANAGEMENT
     */
    
    getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch (e) {
            console.error("Error retrieving users:", e);
            return [];
        }
    },

    // Save shipping information for a user
    saveUserShippingInfo(email, shippingInfo) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);
            
            if (user) {
                user.shippingInfo = {
                    fullName: shippingInfo.fullName,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zip: shippingInfo.zip,
                    country: shippingInfo.country,
                    savedAt: new Date().toISOString()
                };
                localStorage.setItem('users', JSON.stringify(users));
                console.log("User shipping info saved:", email);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Error saving user shipping info:", e);
            return false;
        }
    },

    // Get shipping information for a user
    getUserShippingInfo(email) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);
            
            if (user && user.shippingInfo) {
                return user.shippingInfo;
            }
            return null;
        } catch (e) {
            console.error("Error retrieving user shipping info:", e);
            return null;
        }
    },

    /**
     * PRODUCTS MANAGEMENT
     */
    
    getAllProducts() {
        try {
            return JSON.parse(localStorage.getItem('customProducts') || '[]');
        } catch (e) {
            console.error("Error retrieving products:", e);
            return [];
        }
    },

    /**
     * EXPORT DATA
     */
    
    // Export all orders as JSON
    exportOrdersJSON() {
        try {
            const orders = this.getAllOrders();
            return JSON.stringify(orders, null, 2);
        } catch (e) {
            console.error("Error exporting orders:", e);
            return null;
        }
    },

    // Export all orders as CSV
    exportOrdersCSV() {
        try {
            const orders = this.getAllOrders();
            if (orders.length === 0) return "No orders to export";
            
            let csv = "Order ID,User,Date,Items Count,Total,Status\n";
            orders.forEach(order => {
                csv += `"${order.orderId}","${order.user}","${order.date}",${order.items.length},$${order.total.toFixed(2)},"${order.status}"\n`;
            });
            return csv;
        } catch (e) {
            console.error("Error exporting orders as CSV:", e);
            return null;
        }
    },

    /**
     * DATABASE MAINTENANCE
     */
    
    // Clear all data (be careful with this!)
    clearAllData() {
        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            localStorage.removeItem('orders');
            localStorage.removeItem('users');
            localStorage.removeItem('customProducts');
            localStorage.removeItem('cart');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentOrder');
            console.log("All data cleared");
            return true;
        }
        return false;
    },

    // Get database size
    getDatabaseSize() {
        try {
            let size = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    size += localStorage[key].length + key.length;
                }
            }
            return (size / 1024).toFixed(2) + " KB";
        } catch (e) {
            console.error("Error calculating database size:", e);
            return "Unknown";
        }
    }
};
