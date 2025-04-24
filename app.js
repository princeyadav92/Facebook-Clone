// Main application JavaScript for Facebook Clone

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize the application
function initApp() {
    // Check if user is logged in
    const user = getCurrentUser();
    
    // Update UI based on authentication status
    updateAuthUI(user);
    
    // Load posts for the feed
    loadFeed();
    
    // Track page view if user is logged in
    if (user) {
        trackPageView(user.id, 'home');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Post form submission
    const postSubmitButton = document.getElementById('post-submit-button');
    if (postSubmitButton) {
        postSubmitButton.addEventListener('click', createPost);
    }
    
    // Logout buttons
    const logoutButton = document.getElementById('logout-button');
    const mobileLogoutButton = document.getElementById('mobile-logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', logout);
    }
}

// Load posts for the feed
function loadFeed() {
    const user = getCurrentUser();
    const postsContainer = document.getElementById('posts-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const emptyFeedMessage = document.getElementById('empty-feed-message');
    const postFormContainer = document.getElementById('post-form-container');
    
    // Show loading indicator
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    
    // Hide other elements
    if (postsContainer) {
        postsContainer.classList.add('hidden');
    }
    
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
    
    if (emptyFeedMessage) {
        emptyFeedMessage.classList.add('hidden');
    }
    
    // Show post form if user is logged in
    if (user && postFormContainer) {
        postFormContainer.classList.remove('hidden');
    }
    
    // Simulate API call to get posts
    setTimeout(() => {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        // Get mock posts
        const posts = getMockPosts();
        
        if (posts.length === 0) {
            // Show empty feed message
            if (emptyFeedMessage) {
                emptyFeedMessage.classList.remove('hidden');
                
                // Update empty feed text based on auth status
                const emptyFeedText = document.getElementById('empty-feed-text');
                const authButtons = document.getElementById('auth-buttons');
                
                if (emptyFeedText && authButtons) {
                    if (user) {
                        emptyFeedText.textContent = "Your feed is empty. Start by creating a post or finding friends!";
                        authButtons.classList.add('hidden');
                    } else {
                        emptyFeedText.textContent = "Please log in to see your personalized feed and interact with posts.";
                        authButtons.classList.remove('hidden');
                    }
                }
            }
        } else {
            // Show posts container
            if (postsContainer) {
                postsContainer.classList.remove('hidden');
                
                // Render posts
                renderPosts(posts, postsContainer, user);
            }
        }
    }, 1000);
}

// Render posts in the container
function renderPosts(posts, container, currentUser) {
    // Clear container
    container.innerHTML = '';
    
    // Render each post
    posts.forEach(post => {
        const postElement = createPostElement(post, currentUser);
        container.appendChild(postElement);
    });
}

// Create a post element
function createPostElement(post, currentUser) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.dataset.postId = post.id;
    
    const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
    
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.author.username.charAt(0).toUpperCase()}</div>
            <div class="post-user-info">
                <a href="profile.html?username=${post.author.username}" class="post-user-name">${post.author.fullName || post.author.username}</a>
                <div class="post-timestamp">${formatDate(post.createdAt)}</div>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" class="post-image">` : ''}
        <div class="post-stats">
            <span>${post.likes} likes</span>
            <span>${post.comments.length} comments</span>
        </div>
        <div class="post-actions">
            <button class="post-action-button ${isLiked ? 'liked' : ''}" data-action="like">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Like
            </button>
            <button class="post-action-button" data-action="comment">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Comment
            </button>
        </div>
        <div class="comments-section hidden">
            <div class="comments-container"></div>
            ${currentUser ? `
                <form class="comment-form">
                    <input type="text" class="comment-input" placeholder="Write a comment...">
                    <button type="submit" class="comment-submit">Post</button>
                </form>
            ` : ''}
        </div>
    `;
    
    // Add event listeners to post actions
    const likeButton = postElement.querySelector('[data-action="like"]');
    const commentButton = postElement.querySelector('[data-action="comment"]');
    const commentsSection = postElement.querySelector('.comments-section');
    const commentForm = postElement.querySelector('.comment-form');
    
    if (likeButton) {
        likeButton.addEventListener('click', () => {
            if (currentUser) {
                handleLike(post.id, currentUser.id, likeButton, postElement);
            } else {
                window.location.href = 'login.html';
            }
        });
    }
    
    if (commentButton && commentsSection) {
        commentButton.addEventListener('click', () => {
            commentsSection.classList.toggle('hidden');
            
            // Load comments if section is visible
            if (!commentsSection.classList.contains('hidden')) {
                const commentsContainer = commentsSection.querySelector('.comments-container');
                renderComments(post.comments, commentsContainer);
            }
        });
    }
    
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentInput = commentForm.querySelector('.comment-input');
            const commentText = commentInput.value.trim();
            
            if (commentText && currentUser) {
                handleComment(post.id, currentUser.id, commentText, commentsSection);
                commentInput.value = '';
            }
        });
    }
    
    return postElement;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Handle like action
function handleLike(postId, userId, likeButton, postElement) {
    // Toggle liked state
    const isLiked = likeButton.classList.contains('liked');
    
    // Update UI
    likeButton.classList.toggle('liked');
    
    // Update like count
    const likeCountElement = postElement.querySelector('.post-stats span:first-child');
    let likeCount = parseInt(likeCountElement.textContent);
    
    if (isLiked) {
        likeCount--;
        likeCountElement.textContent = `${likeCount} likes`;
    } else {
        likeCount++;
        likeCountElement.textContent = `${likeCount} likes`;
    }
    
    // Track like interaction
    trackPostInteraction(userId, postId, isLiked ? 'unlike' : 'like');
}

// Handle comment action
function handleComment(postId, userId, commentText, commentsSection) {
    // Create new comment
    const comment = {
        id: Date.now(),
        author: getCurrentUser(),
        content: commentText,
        createdAt: new Date().toISOString()
    };
    
    // Update UI
    const commentsContainer = commentsSection.querySelector('.comments-container');
    const commentElement = createCommentElement(comment);
    commentsContainer.appendChild(commentElement);
    
    // Update comment count
    const commentCountElement = commentsSection.closest('.post').querySelector('.post-stats span:last-child');
    let commentCount = parseInt(commentCountElement.textContent);
    commentCount++;
    commentCountElement.textContent = `${commentCount} comments`;
    
    // Track comment interaction
    trackPostInteraction(userId, postId, 'comment');
}

// Create a comment element
function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    commentElement.innerHTML = `
        <div class="comment-avatar">${comment.author.username.charAt(0).toUpperCase()}</div>
        <div class="comment-content">
            <div class="comment-user-name">${comment.author.fullName || comment.author.username}</div>
            <div class="comment-text">${comment.content}</div>
        </div>
    `;
    
    return commentElement;
}

// Render comments in the container
function renderComments(comments, container) {
    // Clear container
    container.innerHTML = '';
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="no-comments">No comments yet.</p>';
        return;
    }
    
    // Render each comment
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        container.appendChild(commentElement);
    });
}

// Create a new post
function createPost() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const postContent = document.getElementById('post-content');
    const content = postContent.value.trim();
    
    if (!content) {
        return;
    }
    
    // Create new post
    const post = {
        id: Date.now(),
        author: user,
        content: content,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        likedBy: []
    };
    
    // Clear form
    postContent.value = '';
    
    // Add post to feed
    const postsContainer = document.getElementById('posts-container');
    const emptyFeedMessage = document.getElementById('empty-feed-message');
    
    if (postsContainer) {
        // Hide empty feed message if visible
        if (emptyFeedMessage && !emptyFeedMessage.classList.contains('hidden')) {
            emptyFeedMessage.classList.add('hidden');
            postsContainer.classList.remove('hidden');
        }
        
        // Add post to beginning of feed
        const postElement = createPostElement(post, user);
        postsContainer.insertBefore(postElement, postsContainer.firstChild);
    }
    
    // Track post creation
    trackPostCreation(user.id, post.id);
}

// Get mock posts for the feed
function getMockPosts() {
    return [
        {
            id: 1,
            author: {
                id: 2,
                username: 'janedoe',
                fullName: 'Jane Doe'
            },
            content: 'Just finished a great book! Would highly recommend "The Midnight Library" by Matt Haig. Has anyone else read it?',
            createdAt: '2025-04-23T14:30:00.000Z',
            likes: 15,
            comments: [
                {
                    id: 1,
                    author: {
                        id: 3,
                        username: 'bobsmith',
                        fullName: 'Bob Smith'
                    },
                    content: 'I loved that book too! The concept was so interesting.',
                    createdAt: '2025-04-23T15:00:00.000Z'
                }
            ],
            likedBy: [3, 4, 5]
        },
        {
            id: 2,
            author: {
                id: 3,
                username: 'bobsmith',
                fullName: 'Bob Smith'
            },
            content: 'Beautiful day for hiking! 🏔️ #nature #outdoors',
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
            createdAt: '2025-04-22T10:15:00.000Z',
            likes: 24,
            comments: [
                {
                    id: 2,
                    author: {
                        id: 2,
                        username: 'janedoe',
                        fullName: 'Jane Doe'
                    },
                    content: 'Wow, what a view! Where is this?',
                    createdAt: '2025-04-22T11:30:00.000Z'
                },
                {
                    id: 3,
                    author: {
                        id: 3,
                        username: 'bobsmith',
                        fullName: 'Bob Smith'
                    },
                    content: 'This is at Mount Rainier National Park!',
                    createdAt: '2025-04-22T12:00:00.000Z'
                }
            ],
            likedBy: [1, 2, 4, 5]
        },
        {
            id: 3,
            author: {
                id: 4,
                username: 'sarahj',
                fullName: 'Sarah Johnson'
            },
            content: 'Just launched my new website! It\'s been a lot of work but I\'m so happy with how it turned out. Check it out and let me know what you think!',
            createdAt: '2025-04-21T09:45:00.000Z',
            likes: 32,
            comments: [
                {
                    id: 4,
                    author: {
                        id: 1,
                        username: 'johndoe',
                        fullName: 'John Doe'
                    },
                    content: 'Looks amazing! Great job!',
                    createdAt: '2025-04-21T10:30:00.000Z'
                }
            ],
            likedBy: [1, 2, 3, 5]
        }
    ];
        }
  
