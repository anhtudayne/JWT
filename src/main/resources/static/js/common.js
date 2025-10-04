// Common JavaScript functions for JWT Demo

// API Base URL
const API_BASE_URL = 'http://localhost:8005';

// Local Storage Keys
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_info';

/**
 * Get JWT token from localStorage
 */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set JWT token to localStorage
 */
function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove JWT token from localStorage
 */
function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    
    try {
        // Decode JWT payload (simple check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        return payload.exp > now;
    } catch (e) {
        return false;
    }
}

/**
 * Make authenticated API request
 */
async function apiRequest(url, options = {}) {
    const token = getToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        
        // Handle different response types
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.detail || data.message || data || 'Request failed',
                data: data
            };
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        
        // Handle network errors
        if (!error.status) {
            throw {
                status: 0,
                message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
                data: null
            };
        }
        
        throw error;
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'danger', containerId = 'alert-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    container.innerHTML = alertHtml;
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

/**
 * Get alert icon based on type
 */
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Format date string
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Get user initials for avatar
 */
function getUserInitials(fullName) {
    if (!fullName) return 'U';
    
    const names = fullName.split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName[0].toUpperCase();
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Logout user
 */
function logout() {
    removeToken();
    showAlert('Đăng xuất thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

/**
 * Show/hide loading spinner
 */
function toggleLoading(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check for login page
    if (window.location.pathname.includes('login.html')) {
        // Redirect to profile if already authenticated
        if (isAuthenticated()) {
            window.location.href = 'profile.html';
        }
        return;
    }
    
    // Require authentication for other pages
    if (!window.location.pathname.includes('register.html')) {
        requireAuth();
    }
});
