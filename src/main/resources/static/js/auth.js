// Authentication JavaScript for JWT Demo

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Validate form
    if (!loginData.email || !loginData.password) {
        showAlert('Vui lòng nhập đầy đủ email và mật khẩu!', 'warning');
        return;
    }
    
    // Show loading state
    setLoginLoading(true);
    
    try {
        // Call login API
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData)
        });
        
        // Save token
        setToken(response.token);
        
        // Show success message
        showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
        
        // Redirect to profile
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Đăng nhập thất bại!';
        
        switch (error.status) {
            case 401:
                errorMessage = 'Email hoặc mật khẩu không đúng!';
                break;
            case 403:
                errorMessage = 'Tài khoản của bạn đã bị khóa!';
                break;
            case 0:
                errorMessage = error.message;
                break;
            default:
                errorMessage = error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
        
        showAlert(errorMessage, 'danger');
    } finally {
        setLoginLoading(false);
    }
}

/**
 * Set loading state for login button
 */
function setLoginLoading(loading) {
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    if (loading) {
        loginBtn.disabled = true;
        loginText.textContent = 'Đang đăng nhập...';
        loginSpinner.classList.remove('d-none');
    } else {
        loginBtn.disabled = false;
        loginText.textContent = 'Đăng Nhập';
        loginSpinner.classList.add('d-none');
    }
}

/**
 * Handle register form submission (if register page exists)
 */
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const registerData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        images: formData.get('images') || 'default-avatar.png'
    };
    
    // Validate form
    if (!registerData.fullName || !registerData.email || !registerData.password) {
        showAlert('Vui lòng nhập đầy đủ thông tin!', 'warning');
        return;
    }
    
    // Show loading state
    setRegisterLoading(true);
    
    try {
        // Call register API
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerData)
        });
        
        // Show success message
        showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        
        // Clear form
        event.target.reset();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Register error:', error);
        
        let errorMessage = 'Đăng ký thất bại!';
        
        switch (error.status) {
            case 400:
                if (error.message.includes('Email already in use')) {
                    errorMessage = 'Email này đã được sử dụng!';
                } else {
                    errorMessage = error.message;
                }
                break;
            case 0:
                errorMessage = error.message;
                break;
            default:
                errorMessage = error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
        
        showAlert(errorMessage, 'danger');
    } finally {
        setRegisterLoading(false);
    }
}

/**
 * Set loading state for register button
 */
function setRegisterLoading(loading) {
    const registerBtn = document.getElementById('registerBtn');
    const registerText = document.getElementById('registerText');
    const registerSpinner = document.getElementById('registerSpinner');
    
    if (registerBtn && registerText && registerSpinner) {
        if (loading) {
            registerBtn.disabled = true;
            registerText.textContent = 'Đang đăng ký...';
            registerSpinner.classList.remove('d-none');
        } else {
            registerBtn.disabled = false;
            registerText.textContent = 'Đăng Ký';
            registerSpinner.classList.add('d-none');
        }
    }
}
