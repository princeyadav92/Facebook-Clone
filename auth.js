// Authentication functions for Facebook Clone

// Get current user from local storage
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Update UI based on authentication status
function updateAuthUI(user) {
    // Desktop menu items
    const profileLink = document.getElementById('profile-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');
    
    // Mobile menu items
    const mobileProfileLink = document.getElementById('mobile-profile-link');
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileRegisterLink = document.getElementById('mobile-register-link');
    const mobileLogoutButton = document.getElementById('mobile-logout-button');
    
    if (user) {
        // User is logged in
        if (profileLink) {
            profileLink.href = `profile.html?username=${user.username}`;
            profileLink.classList.remove('hidden');
        }
        
        if (mobileProfileLink) {
            mobileProfileLink.href = `profile.html?username=${user.username}`;
            mobileProfileLink.classList.remove('hidden');
        }
        
        if (loginLink) loginLink.classList.add('hidden');
        if (registerLink) registerLink.classList.add('hidden');
        if (logoutButton) logoutButton.classList.remove('hidden');
        
        if (mobileLoginLink) mobileLoginLink.classList.add('hidden');
        if (mobileRegisterLink) mobileRegisterLink.classList.add('hidden');
        if (mobileLogoutButton) mobileLogoutButton.classList.remove('hidden');
    } else {
        // User is not logged in
        if (profileLink) profileLink.classList.add('hidden');
        if (loginLink) loginLink.classList.remove('hidden');
        if (registerLink) registerLink.classList.remove('hidden');
        if (logoutButton) logoutButton.classList.add('hidden');
        
        if (mobileProfileLink) mobileProfileLink.classList.add('hidden');
        if (mobileLoginLink) mobileLoginLink.classList.remove('hidden');
        if (mobileRegisterLink) mobileRegisterLink.classList.remove('hidden');
        if (mobileLogoutButton) mobileLogoutButton.classList.add('hidden');
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // Simple validation
    if (!email || !password) {
        if (errorElement) {
            errorElement.textContent = 'Please enter both email and password.';
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any credentials
        // In a real app, this would validate against a backend
        const user = {
            id: 1,
            username: 'johndoe',
            email: email,
            fullName: 'John Doe'
        };
        
        // Save user to local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Track login event
        trackLogin(user.id);
        
        // Redirect to home page
        window.location.href = 'index.html';
    }, 1000);
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('register-error');
    
    // Simple validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
        if (errorElement) {
            errorElement.textContent = 'Please fill in all fields.';
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    if (password !== confirmPassword) {
        if (errorElement) {
            errorElement.textContent = 'Passwords do not match.';
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, always succeed
        // In a real app, this would create a user in the backend
        const user = {
            id: Date.now(),
            username: username,
            email: email,
            fullName: fullName
        };
        
        // Save user to local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Track registration event
        trackRegistration(user.id);
        
        // Redirect to home page
        window.location.href = 'index.html';
    }, 1000);
}

// Logout function
function logout() {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Update UI based on auth status
    updateAuthUI(getCurrentUser());
});
      
