// AI Project Manager - Web Demo
// API Integration with HuggingFace

const API_URL = 'https://im-lenore-aiready-database-api.hf.space';
let sessionId = null;
let chatHistory = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeSession();
    adjustTextareaHeight();
});

// Create new session
async function initializeSession() {
    try {
        const response = await fetch(`${API_URL}/api/v1/chat/session`, {
            method: 'POST'
        });
        const data = await response.json();
        sessionId = data.session_id;
        console.log('Session initialized:', sessionId);
    } catch (error) {
        console.error('Failed to initialize session:', error);
        showError('Failed to connect to API. Please refresh the page.');
    }
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Auto-resize textarea
function adjustTextareaHeight() {
    const textarea = document.getElementById('user-input');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    });
}

// Send message
async function sendMessage() {
    const input = document.getElementById('user-input');
    const question = input.value.trim();

    if (!question) return;

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Hide welcome message if exists
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();

    // Add user message to UI
    addMessage('user', question);

    // Add to history
    addToHistory(question);

    // Show loading
    const loadingDiv = addMessage('assistant', '<span class="loading"></span>');

    // Disable send button
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;

    try {
        // Send query to API
        const response = await fetch(`${API_URL}/api/v1/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                session_id: sessionId,
                include_sql: false
            })
        });

        const data = await response.json();

        // Remove loading message
        loadingDiv.remove();

        // Display response
        if (data.success) {
            displayResponse(data);
        } else {
            addMessage('assistant', `Error: ${data.error || 'Unknown error occurred'}`);
        }
    } catch (error) {
        loadingDiv.remove();
        addMessage('assistant', `Error: Failed to get response. ${error.message}`);
        console.error('Query error:', error);
    } finally {
        sendBtn.disabled = false;
    }
}

// Send suggested query
function sendSuggestion(text) {
    const input = document.getElementById('user-input');
    input.value = text;
    sendMessage();
}

// Add message to chat
function addMessage(role, content) {
    const messagesDiv = document.getElementById('messages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';

    const roleSpan = document.createElement('span');
    roleSpan.className = 'message-role';
    roleSpan.textContent = role === 'user' ? 'You' : 'AI Assistant';

    headerDiv.appendChild(roleSpan);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;

    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);

    messagesDiv.appendChild(messageDiv);

    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return messageDiv;
}

// Display API response
function displayResponse(data) {
    let html = '';

    // Show SQL query if available
    if (data.sql) {
        html += '<div class="sql-badge">SQL Query</div>';
        html += `<div class="sql-query">${escapeHtml(data.sql)}</div>`;
    }

    // Show data
    if (data.data && data.data.length > 0) {
        html += `<p><strong>Results:</strong> ${data.row_count} row(s) found</p>`;
        html += renderTable(data.data);
    } else if (data.data && data.data.length === 0) {
        html += '<p><em>No results found.</em></p>';
    }

    addMessage('assistant', html);
}

// Render data table
function renderTable(data) {
    if (!data || data.length === 0) return '';

    const keys = Object.keys(data[0]);

    let html = '<table class="data-table"><thead><tr>';

    // Headers
    keys.forEach(key => {
        html += `<th>${escapeHtml(key)}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Rows
    data.forEach(row => {
        html += '<tr>';
        keys.forEach(key => {
            const value = row[key];
            html += `<td>${value !== null && value !== undefined ? escapeHtml(String(value)) : '<em>null</em>'}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';

    return html;
}

// Add to history sidebar
function addToHistory(question) {
    chatHistory.unshift(question);

    // Keep only last 10
    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(0, 10);
    }

    renderHistory();
}

// Render history
function renderHistory() {
    const historyDiv = document.getElementById('history-list');
    historyDiv.innerHTML = '';

    chatHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyItem.onclick = () => {
            document.getElementById('user-input').value = item;
            document.getElementById('user-input').focus();
        };
        historyDiv.appendChild(historyItem);
    });
}

// New chat
function newChat() {
    // Clear messages
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to AI Project Manager</h2>
            <p>Ask questions about your projects, users, tasks, and more!</p>
            <div class="suggested-queries">
                <button class="suggestion" onclick="sendSuggestion('Show me all projects')">Show me all projects</button>
                <button class="suggestion" onclick="sendSuggestion('How many pending projects?')">How many pending projects?</button>
                <button class="suggestion" onclick="sendSuggestion('What is the average budget?')">What's the average budget?</button>
                <button class="suggestion" onclick="sendSuggestion('Projects over budget')">Projects over budget</button>
            </div>
        </div>
    `;

    // Initialize new session
    initializeSession();

    // Clear input
    document.getElementById('user-input').value = '';
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark');

    // Save preference
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark');
    }
});

// Show error
function showError(message) {
    addMessage('assistant', `<strong>Error:</strong> ${escapeHtml(message)}`);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
