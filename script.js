document.addEventListener('DOMContentLoaded', () => {
    let posts = [
        { id: 1, title: 'AI in 2025', content: 'The future of artificial intelligence is here...', category: 'technology', tags: ['AI', 'Tech'], image: 'https://images.unsplash.com/photo-1516321310762-479e93c1e7f3' },
        { id: 2, title: 'Mindful Living', content: 'Tips for a balanced lifestyle...', category: 'lifestyle', tags: ['Health', 'Mindfulness'], image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773' },
        { id: 3, title: 'Hidden Gems to Travel', content: 'Explore offbeat destinations...', category: 'travel', tags: ['Travel', 'Adventure'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' }
    ];

    let comments = {};
    let loggedIn = false;

    // Display Posts
    const postGrid = document.getElementById('post-grid');
    const displayPosts = (category = 'all', searchQuery = '') => {
        postGrid.innerHTML = '';
        posts.forEach(post => {
            if ((category === 'all' || post.category === category) &&
                (searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
                const postCard = document.createElement('div');
                postCard.classList.add('post-card', 'animate-slide-up');
                postCard.innerHTML = `
                    <img src="${post.image}" alt="${post.title}">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${post.title}</h3>
                        <p class="text-gray-600 mb-4">${post.content.substring(0, 100)}...</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="comment-section">
                            <h4 class="text-lg font-semibold mb-2">Comments</h4>
                            <div id="comments-${post.id}" class="space-y-2"></div>
                            ${loggedIn ? `
                                <input type="text" id="comment-${post.id}" placeholder="Add a comment" class="mb-2">
                                <button onclick="addComment(${post.id})" class="transition-colors duration-300">Comment</button>
                            ` : '<p class="text-gray-500">Please log in to comment.</p>'}
                        </div>
                    </div>
                `;
                postGrid.appendChild(postCard);
                displayComments(post.id);
            }
        });
    };

    // Display Comments
    const displayComments = (postId) => {
        const commentSection = document.getElementById(`comments-${postId}`);
        commentSection.innerHTML = '';
        if (comments[postId]) {
            comments[postId].forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('text-gray-700', 'p-2', 'border-l-4', 'border-blue-400', 'animate-slide-up');
                commentDiv.textContent = comment;
                commentSection.appendChild(commentDiv);
            });
        }
    };

    // Add Comment
    window.addComment = (postId) => {
        const commentInput = document.getElementById(`comment-${postId}`);
        const commentText = commentInput.value.trim();
        if (commentText) {
            if (!comments[postId]) comments[postId] = [];
            comments[postId].push(commentText);
            commentInput.value = '';
            displayComments(postId);
        }
    };

    // Login Modal
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.getElementById('login-form');
    loginBtn.onclick = (e) => {
        e.preventDefault();
        loginModal.classList.remove('hidden');
    };
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'password') {
            loggedIn = true;
            loginModal.classList.add('hidden');
            alert('Logged in successfully!');
            displayPosts();
        } else {
            alert('Invalid credentials');
        }
    };

    // Admin Panel
    const adminModal = document.getElementById('admin-modal');
    const adminBtn = document.getElementById('admin-btn');
    const adminForm = document.getElementById('admin-form');
    const adminPosts = document.getElementById('admin-posts');
    adminBtn.onclick = (e) => {
        e.preventDefault();
        if (loggedIn) {
            adminModal.classList.remove('hidden');
            displayAdminPosts();
        } else {
            alert('Please log in to access the admin panel.');
        }
    };

    adminForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const category = document.getElementById('post-category').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        posts.push({
            id: posts.length + 1,
            title,
            content,
            category,
            tags,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
        });
        adminModal.classList.add('hidden');
        adminForm.reset();
        displayPosts();
        displayAdminPosts();
    };

    // Edit Post
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    window.editPost = (postId) => {
        const post = posts.find(p => p.id === postId);
        if (post) {
            document.getElementById('edit-post-id').value = post.id;
            document.getElementById('edit-post-title').value = post.title;
            document.getElementById('edit-post-content').value = post.content;
            document.getElementById('edit-post-category').value = post.category;
            document.getElementById('edit-post-tags').value = post.tags.join(', ');
            editModal.classList.remove('hidden');
        }
    };

    editForm.onsubmit = (e) => {
        e.preventDefault();
        const postId = parseInt(document.getElementById('edit-post-id').value);
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.title = document.getElementById('edit-post-title').value;
            post.content = document.getElementById('edit-post-content').value;
            post.category = document.getElementById('edit-post-category').value;
            post.tags = document.getElementById('edit-post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
            editModal.classList.add('hidden');
            editForm.reset();
            displayPosts();
            displayAdminPosts();
        }
    };

    // Display Admin Posts
    const displayAdminPosts = () => {
        adminPosts.innerHTML = '';
        posts.forEach(post => {
            const li = document.createElement('li');
            li.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'border-b');
            li.innerHTML = `
                ${post.title}
                <div>
                    <button onclick="editPost(${post.id})" class="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600 transition-colors duration-300">Edit</button>
                    <button onclick="deletePost(${post.id})" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300">Delete</button>
                </div>
            `;
            adminPosts.appendChild(li);
        });
    };

    // Delete Post
    window.deletePost = (postId) => {
        const index = posts.findIndex(post => post.id === postId);
        if (index !== -1) {
            posts.splice(index, 1);
            displayPosts();
            displayAdminPosts();
        }
    };

    // Category Filtering
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            displayPosts(category, document.getElementById('search-bar').value);
        };
    });

    // Search Functionality
    document.getElementById('search-bar').addEventListener('input', (e) => {
        const activeCategory = document.querySelector('.nav-link.active')?.dataset.category || 'all';
        displayPosts(activeCategory, e.target.value);
    });

    // Close Modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = () => {
            loginModal.classList.add('hidden');
            adminModal.classList.add('hidden');
            editModal.classList.add('hidden');
        };
    });

    // Initial Display
    displayPosts();
});