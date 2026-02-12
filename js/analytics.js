// Initialize the Data Layer
window.digitalData = window.digitalData || {
    page: {},
    product: [],
    cart: {},
    transaction: {}
};

/**
 * ADOBE ANALYTICS MAPPING EXPLANATION:
 * - Page Name -> s.pageName (prop / eVar)
 * - Category -> s.channel (prop / eVar)
 * - Events -> s.events (prodView, scAdd, purchase)
 */

const analytics = {
    trackPageView: function() {
        console.log("Adobe Analytics: Tracking Page View", window.digitalData.page);
        // Adobe Code: s.t();
    },
    trackAction: function(actionName, data) {
        console.log(`Adobe Analytics: Tracking Action - ${actionName}`, data);
        // Adobe Code: s.tl(this, 'o', actionName);
    }
};