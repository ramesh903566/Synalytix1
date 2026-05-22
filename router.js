(function() {
    // Basic auth state mocking via localStorage
    const isAuthenticated = localStorage.getItem('synalytix_auth') === 'true';
    const path = window.location.pathname;

    // Define public routes
    const publicRoutes = ['/', '/login', '/login/', '/register', '/register/', '/auth/callback', '/auth/callback/'];

    // Define auth routes that redirect to dashboard if already logged in
    const authRoutes = ['/login', '/login/', '/register', '/register/'];

    const isPublic = publicRoutes.some(r => path === r || (path.startsWith(r) && r !== '/'));
    const isAuthRoute = authRoutes.some(r => path === r);

    if (isAuthenticated) {
        if (isAuthRoute || path === '/' || path === '/index.html') {
            window.location.replace('/dashboard');
        }
    } else {
        if (!isPublic && path !== '/index.html') {
            const redirectParam = encodeURIComponent(path + window.location.search);
            window.location.replace(`/login?redirect=${redirectParam}`);
        }
    }
})();

// Function to simulate login for testing
window.mockLogin = function() {
    localStorage.setItem('synalytix_auth', 'true');
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/dashboard';
    window.location.href = redirect;
};

// Function to simulate logout
window.mockLogout = function() {
    localStorage.removeItem('synalytix_auth');
    window.location.href = '/login';
};
