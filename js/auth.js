const auth = {
    register: function(email, password) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({ email, password, role: 'user' });
        localStorage.setItem('users', JSON.stringify(users));
        analytics.trackAction('registration_complete', { email });
    },
    login: function(email, password) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            analytics.trackAction('login_success', { email });
            return true;
        }
        return false;
    },
    logout: function() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        analytics.trackAction('logout', { email: user?.email });
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
};

// Update Data Layer with User Info
window.digitalData.user = JSON.parse(localStorage.getItem('currentUser')) || { role: 'guest' };