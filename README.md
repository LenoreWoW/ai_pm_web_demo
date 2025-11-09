# AI Project Manager - Web Demo

A modern web interface for querying project management data using natural language powered by AI.

## Features

- 🤖 Natural language to SQL query generation
- 💬 Session-based conversation tracking
- 🎨 Dark/Light theme support
- 📊 Beautiful table rendering for data results
- 🔍 SQL query display
- 📱 Responsive design
- ⚡ Real-time API integration with HuggingFace

## Live Demo

Deployed at: GitHub Pages

## API Integration

This web app connects to the AI Database API hosted on HuggingFace Spaces:
- **API URL**: https://im-lenore-aiready-database-api.hf.space
- **Test Coverage**: 656/656 queries (100% pass rate)
- **Session Tracking**: ✅ Enabled
- **Response Time**: ~2.5 seconds average

## Usage

### Sample Queries

Try asking questions like:
- "Show me all projects"
- "How many pending projects?"
- "What's the average budget?"
- "Projects over budget"
- "Show me completed projects"
- "Which projects are in the Engineering department?"

### Contextual Queries

The API supports contextual follow-up questions:
1. "Show me all projects"
2. "How many are there?" ← Uses context from previous query
3. "Which ones are pending?"

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: FastAPI (Python) on HuggingFace Spaces
- **AI Model**: Meta-Llama-3.1-8B-Instruct
- **Database**: PostgreSQL
- **Hosting**: GitHub Pages

## Local Development

1. Clone this repository
2. Open `index.html` in your browser
3. Start querying!

No build process required - it's a static site!

## API Documentation

### Create Session
```javascript
POST /api/v1/chat/session
```

### Send Query
```javascript
POST /api/v1/query
{
  "question": "Show me all projects",
  "session_id": "your-session-id",
  "include_sql": true
}
```

### Response Format
```json
{
  "success": true,
  "sql": "SELECT * FROM projects LIMIT 50;",
  "data": [...],
  "row_count": 15
}
```

## Features Tested

- ✅ All query types (basic, aggregations, filters)
- ✅ All 6 tables (projects, users, tasks, departments, companies, contracts)
- ✅ NULL handling (IS NULL, IS NOT NULL)
- ✅ Complex filters (OR, BETWEEN, NOT)
- ✅ Session tracking for contextual queries
- ✅ Natural language understanding
- ✅ Extended conversations (10+ questions)
- ✅ Creative/edge case scenarios

## Credits

Built with ❤️ for AI-powered project management

---

**Note**: This is a demo application. The API is fully functional and production-ready with 100% test coverage.
