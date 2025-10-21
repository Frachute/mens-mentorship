/**
 * Men's Mentorship Website
 * Main JavaScript File
 * Handles navigation, animations, and interactive features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NAVIGATION MENU TOGGLE ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // ========== STICKY NAVBAR ON SCROLL ==========
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll if it's a valid anchor (not just #)
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ========== COLLAPSIBLE LESSON CATEGORIES ==========
    const collapseBtns = document.querySelectorAll('.collapse-btn');
    
    collapseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const categoryHeader = this.closest('.category-header');
            
            if (targetContent) {
                // Toggle active class
                this.classList.toggle('active');
                targetContent.classList.toggle('active');
                
                // Optional: Close other open categories (accordion behavior)
                // Uncomment the code below if you want only one category open at a time
                /*
                const allContents = document.querySelectorAll('.category-content');
                const allBtns = document.querySelectorAll('.collapse-btn');
                
                allContents.forEach(content => {
                    if (content !== targetContent && content.classList.contains('active')) {
                        content.classList.remove('active');
                    }
                });
                
                allBtns.forEach(otherBtn => {
                    if (otherBtn !== this && otherBtn.classList.contains('active')) {
                        otherBtn.classList.remove('active');
                    }
                });
                */
            }
        });
    });
    
    // Auto-open first category on lessons page
    const firstCollapseBtn = document.querySelector('.collapse-btn');
    if (firstCollapseBtn && window.location.pathname.includes('lessons')) {
        firstCollapseBtn.click();
    }
    
    // ========== SOCIAL SHARE FUNCTIONALITY ==========
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('i').classList.contains('fa-facebook') ? 'facebook' :
                           this.querySelector('i').classList.contains('fa-whatsapp') ? 'whatsapp' :
                           this.querySelector('i').classList.contains('fa-twitter') ? 'twitter' : '';
            
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // ========== CONTACT FORM HANDLING ==========
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                subscribe: document.getElementById('subscribe').checked
            };
            
            // Here you would typically send the data to your server
            // For now, we'll just show a success message
            console.log('Form submitted:', formData);
            
            // Show success message
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.classList.add('show');
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }
            
            // Reset form
            contactForm.reset();
            
            // In production, you would integrate with an email service or backend API
            // Example:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(data => console.log('Success:', data))
            // .catch(error => console.error('Error:', error));
        });
    }
    
    // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .lesson-card, .about-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Initialize animations
    animateOnScroll();
    
    // ========== AUDIO PLAYER ENHANCEMENTS ==========
    const audioPlayers = document.querySelectorAll('audio');
    
    audioPlayers.forEach(audio => {
        // Add custom styling or controls if needed
        audio.addEventListener('play', function() {
            console.log('Audio playing:', this.src);
        });
        
        audio.addEventListener('ended', function() {
            console.log('Audio ended:', this.src);
        });
    });
    
    // ========== UTILITY FUNCTIONS ==========
    
    /**
     * Debounce function to limit rate of function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ========== FORM VALIDATION ==========
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Add real-time validation for email field
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#ef4444';
                
                // Show error message
                let errorMsg = this.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#ef4444';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.marginTop = '0.25rem';
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = 'Please enter a valid email address';
                    this.parentNode.appendChild(errorMsg);
                }
            } else {
                this.style.borderColor = '';
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
    }
    
    // ========== BACK TO TOP BUTTON ==========
    const createBackToTop = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Back to top');
        
        // Style the button
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            font-size: 1.25rem;
        `;
        
        document.body.appendChild(button);
        
        // Show/hide button based on scroll position
        const toggleButton = throttle(() => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        }, 100);
        
        window.addEventListener('scroll', toggleButton);
        
        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px)';
            button.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    };
    
    // Initialize back to top button
    createBackToTop();
    
    // ========== LAZY LOADING IMAGES ==========
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // ========== CONSOLE MESSAGE ==========
    console.log('%cMen\'s Mentorship Website', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cBuilding men of character, faith, and purpose', 'font-size: 14px; color: #6b7280;');
    
});

// ========== EXTERNAL LINK WARNING (Optional) ==========
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    
    if (link && link.hostname !== window.location.hostname && link.href.startsWith('http')) {
        // Optionally add a warning for external links
        // Uncomment to enable
        /*
        e.preventDefault();
        if (confirm('You are about to leave Men\'s Mentorship. Continue?')) {
            window.open(link.href, link.target || '_self');
        }
        */
    }
});

// ========== SERVICE WORKER FOR PWA (Optional) ==========
// Uncomment to enable Progressive Web App capabilities
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}
*/