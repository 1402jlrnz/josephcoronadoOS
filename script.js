// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active Navigation Highlight on Scroll
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Save video links for Installation section
function saveLink(videoNum) {
    const input = document.querySelector(`.link-input[data-video="${videoNum}"]`);
    const link = document.getElementById(`link-${videoNum}`);
    const url = input.value.trim();

    if (url && isValidUrl(url)) {
        link.href = url;
        link.style.display = 'flex';
        input.parentElement.style.display = 'none';
        
        // Save to localStorage
        localStorage.setItem(`video-${videoNum}`, url);
        
        showNotification('Link saved successfully!');
    } else {
        showNotification('Please enter a valid URL', 'error');
    }
}

// Save activity links for Laboratory section
function saveActivityLink(activityNum) {
    const input = document.querySelector(`.link-input[data-activity="${activityNum}"]`);
    const url = input.value.trim();
    const resourceList = document.getElementById(`resources-${activityNum}`);

    if (url && isValidUrl(url)) {
        // Create new list item
        const li = document.createElement('li');
        const linkId = `activity-${activityNum}-${Date.now()}`;
        
        li.innerHTML = `
            <a href="${url}" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Resource Link</span>
            </a>
            <button class="delete-btn" onclick="deleteResource(this, '${linkId}')">🗑️</button>
        `;
        
        resourceList.appendChild(li);
        
        // Save to localStorage
        const savedLinks = JSON.parse(localStorage.getItem(`activity-${activityNum}`) || '[]');
        savedLinks.push({ id: linkId, url: url });
        localStorage.setItem(`activity-${activityNum}`, JSON.stringify(savedLinks));
        
        input.value = '';
        showNotification('Resource link added!');
    } else {
        showNotification('Please enter a valid URL', 'error');
    }
}

// Delete resource link
function deleteResource(btn, linkId) {
    const li = btn.parentElement;
    const resourceList = li.parentElement;
    const activityNum = resourceList.id.replace('resources-', '');
    
    li.remove();
    
    // Update localStorage
    let savedLinks = JSON.parse(localStorage.getItem(`activity-${activityNum}`) || '[]');
    savedLinks = savedLinks.filter(link => link.id !== linkId);
    localStorage.setItem(`activity-${activityNum}`, JSON.stringify(savedLinks));
    
    showNotification('Resource removed');
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 10px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load saved data from localStorage on page load
function loadSavedData() {
    // Load video links
    for (let i = 1; i <= 6; i++) {
        const savedUrl = localStorage.getItem(`video-${i}`);
        if (savedUrl) {
            const input = document.querySelector(`.link-input[data-video="${i}"]`);
            const link = document.getElementById(`link-${i}`);
            
            if (input && link) {
                link.href = savedUrl;
                link.style.display = 'flex';
                input.parentElement.style.display = 'none';
            }
        }
    }
    
    // Load activity links
    for (let i = 1; i <= 6; i++) {
        const savedLinks = JSON.parse(localStorage.getItem(`activity-${i}`) || '[]');
        const resourceList = document.getElementById(`resources-${i}`);
        
        if (resourceList && savedLinks.length > 0) {
            savedLinks.forEach(linkData => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="${linkData.url}" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>Resource Link</span>
                    </a>
                    <button class="delete-btn" onclick="deleteResource(this, '${linkData.id}')">🗑️</button>
                `;
                resourceList.appendChild(li);
            });
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadSavedData);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle Enter key in inputs
document.querySelectorAll('.link-input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (this.dataset.video) {
                saveLink(this.dataset.video);
            } else if (this.dataset.activity) {
                saveActivityLink(this.dataset.activity);
            }
        }
    });
});
