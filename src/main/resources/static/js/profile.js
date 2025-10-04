// Profile JavaScript for JWT Demo

document.addEventListener('DOMContentLoaded', function() {
    // Load user profile on page load
    loadUserProfile();
    loadUsersList();
});

/**
 * Load current user profile
 */
async function loadUserProfile() {
    try {
        // Show loading
        toggleLoading('loadingSpinner', true);
        
        // Call API to get current user info
        const user = await apiRequest('/users/me');
        
        // Hide loading
        toggleLoading('loadingSpinner', false);
        
        // Show profile card
        document.getElementById('profileCard').classList.remove('d-none');
        
        // Update profile information
        updateProfileUI(user);
        
    } catch (error) {
        console.error('Load profile error:', error);
        
        // Hide loading
        toggleLoading('loadingSpinner', false);
        
        let errorMessage = 'Không thể tải thông tin profile!';
        
        switch (error.status) {
            case 401:
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!';
                setTimeout(() => {
                    logout();
                }, 2000);
                break;
            case 403:
                errorMessage = 'Bạn không có quyền truy cập!';
                break;
            case 0:
                errorMessage = error.message;
                break;
            default:
                errorMessage = error.message || 'Có lỗi xảy ra khi tải profile!';
        }
        
        showAlert(errorMessage, 'danger');
    }
}

/**
 * Update profile UI with user data
 */
function updateProfileUI(user) {
    // Update profile header
    document.getElementById('profileName').textContent = user.fullName || 'N/A';
    document.getElementById('profileEmail').textContent = user.email || 'N/A';
    
    // Update profile avatar with initials
    const avatarElement = document.getElementById('profileAvatar');
    avatarElement.innerHTML = getUserInitials(user.fullName);
    
    // Update profile details
    document.getElementById('userId').textContent = user.id || '-';
    document.getElementById('userFullName').textContent = user.fullName || '-';
    document.getElementById('userEmail').textContent = user.email || '-';
    document.getElementById('userImages').textContent = user.images || 'Không có';
    document.getElementById('userCreatedAt').textContent = formatDate(user.createdAt);
    document.getElementById('userUpdatedAt').textContent = formatDate(user.updatedAt);
    
    // Update status badge
    const statusElement = document.getElementById('userStatus');
    if (user.enabled) {
        statusElement.textContent = 'Hoạt động';
        statusElement.className = 'badge bg-success';
    } else {
        statusElement.textContent = 'Bị khóa';
        statusElement.className = 'badge bg-danger';
    }
}

/**
 * Load users list (demo function)
 */
async function loadUsersList() {
    const usersListElement = document.getElementById('usersList');
    
    try {
        // For demo, we'll try to load user by ID 1
        const user1 = await apiRequest('/users/1');
        
        const usersHtml = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="profile-avatar me-3" style="width: 50px; height: 50px; font-size: 1.2rem;">
                            ${getUserInitials(user1.fullName)}
                        </div>
                        <div>
                            <h6 class="mb-1">${user1.fullName}</h6>
                            <small class="text-muted">${user1.email}</small>
                        </div>
                        <div class="ms-auto">
                            <span class="badge bg-primary">ID: ${user1.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        usersListElement.innerHTML = usersHtml;
        
    } catch (error) {
        console.error('Load users error:', error);
        
        let errorMessage = 'Không thể tải danh sách người dùng';
        
        if (error.status === 401) {
            errorMessage = 'Không có quyền xem danh sách người dùng';
        } else if (error.status === 404) {
            errorMessage = 'Không tìm thấy người dùng nào';
        }
        
        usersListElement.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${errorMessage}
            </div>
        `;
    }
}

/**
 * Refresh profile data
 */
function refreshProfile() {
    loadUserProfile();
    loadUsersList();
    showAlert('Đã làm mới dữ liệu!', 'info');
}

/**
 * Edit profile (placeholder function)
 */
function editProfile() {
    showAlert('Chức năng chỉnh sửa profile sẽ được phát triển trong tương lai!', 'info');
}

/**
 * Change password (placeholder function)
 */
function changePassword() {
    showAlert('Chức năng đổi mật khẩu sẽ được phát triển trong tương lai!', 'info');
}
