// Analytics tracking for Facebook Clone

// Track page view
function trackPageView(userId, page) {
    trackEvent(userId, 'page_view', { page });
}

// Track login event
function trackLogin(userId) {
    trackEvent(userId, 'login', { timestamp: new Date().toISOString() });
}

// Track registration event
function trackRegistration(userId) {
    trackEvent(userId, 'registration', { timestamp: new Date().toISOString() });
}

// Track post creation
function trackPostCreation(userId, postId) {
    trackEvent(userId, 'post_created', { postId });
}

// Track post interaction (like, comment)
function trackPostInteraction(userId, postId, interactionType) {
    trackEvent(userId, 'post_interaction', { postId, interactionType });
}

// Generic event tracking function
function trackEvent(userId, event, metadata = {}) {
    if (!userId) return;
    
    // Prepare tracking data
    const trackingData = {
        userId,
        event,
        metadata,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        // Add device info
        device: {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            language: navigator.language,
            platform: navigator.platform
        }
    };
    
    // In a real app, this would send data to a server
    // For demo purposes, we'll log to console and store in localStorage
    console.log('Analytics event:', trackingData);
    
    // Store in localStorage for demo purposes
    const analyticsData = JSON.parse(localStorage.getItem('analyticsData') || '[]');
    analyticsData.push(trackingData);
    localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
}

// Function to view analytics data (for admin dashboard)
function getAnalyticsData() {
    return JSON.parse(localStorage.getItem('analyticsData') || '[]');
      }
