// js/analytics.js
window.analytics = {
    trackPageView: function() {
        console.log("Adobe Analytics: Tracking Page View", window.digitalData.page);
    },
    trackProductView: function(product) {
        console.log("Adobe Analytics: Tracking Product View", product.title);
    }
};