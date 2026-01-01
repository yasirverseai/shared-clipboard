# API Workflow Documentation

This document describes the complete workflow of the Shared Clipboard application, showing how the frontend and backend interact.

## 🔄 Complete User Journey

### Scenario 1: New User Without Clipboard ID

```
User Action                Frontend                    Backend                     Database
─────────────────────────────────────────────────────────────────────────────────────────────

1. Visit website     →   Detect no ID in URL
   (/)                   

2. Frontend loads    →   Call API:
                         POST /clipboard/new      →   Generate UUID
                                                      Create new clipboard   →   INSERT INTO
                                                                                  clipboards
                                                                                  (id, content='')
                                                  
                                                  ←   Return: 
                                                      { "id": "abc-123" }
                    
                    ←    Receive clipboard ID
                         
3. Redirect user     →   Navigate to:
   to new URL            /{clipboard_id}
```

---

### Scenario 2: User Visits with Existing Clipboard ID

```
User Action                Frontend                    Backend                     Database
─────────────────────────────────────────────────────────────────────────────────────────────

1. Visit URL         →   Extract ID from URL
   /{clipboard_id}       (e.g., "abc-123")
   

2. Load content      →   Call API:
                         GET /clipboard/abc-123   →   Query database        →   SELECT *
                                                      for clipboard_id           FROM clipboards
                                                                                 WHERE id='abc-123'
                                                  
                                                  ←   Return:
                                                      {
                                                        "id": "abc-123",
                                                        "content": "Hello!",
                                                        "created_at": "...",
                                                        "updated_at": "..."
                                                      }
                    
                    ←    Display content
                         in text area
```

---

### Scenario 3: User Updates Clipboard Content

```
User Action                Frontend                    Backend                     Database
─────────────────────────────────────────────────────────────────────────────────────────────

1. Type/paste text   →   User edits text area
   in clipboard          

2. Click Save or     →   Call API:
   Auto-save             PUT /clipboard/abc-123   →   Validate clipboard_id
                         Body: {                      exists
                           "content": "New text"  
                         }                            Update content        →   UPDATE clipboards
                                                      Update timestamp          SET content='New text',
                                                                                    updated_at=NOW()
                                                                                WHERE id='abc-123'
                                                  
                                                  ←   Return:
                                                      {
                                                        "id": "abc-123",
                                                        "content": "New text",
                                                        "created_at": "...",
                                                        "updated_at": "..."
                                                      }
                    
                    ←    Confirm update
                         Show success message
```

---

### Scenario 4: Multiple Users Sharing Same Clipboard

```
User A                     User B                     Backend                     Database
────────────────────────────────────────────────────────────────────────────────────────────

Visit                      Visit                      Both have same
/{clipboard_id}            /{clipboard_id}            clipboard_id


GET /clipboard/abc-123                            →   Fetch content         →   SELECT *
                                                                                  WHERE id=...

Display: "Hello"           Display: "Hello"       ←   Return: "Hello"


Update to                                         →   Update content        →   UPDATE
"Hello World"                                                                     content=
                                                                                  "Hello World"

                                                  ←   Return: "Hello World"


(User B refreshes)                                →   Fetch latest          →   SELECT *
GET /clipboard/abc-123                                content

Display:                   Display:               ←   Return:
"Hello World"              "Hello World"              "Hello World"


Both users now see the same updated content!
```

---

## 📊 API Endpoint Details

### 1. POST /clipboard/new

**Purpose**: Create a new clipboard

**Request**:
```http
POST /clipboard/new
Content-Type: application/json
```

**Process**:
1. Generate unique UUID
2. Check uniqueness in database (collision prevention)
3. Create new clipboard record with empty content
4. Return clipboard ID

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Database Operation**:
```sql
INSERT INTO clipboards (id, content, created_at, updated_at)
VALUES ('550e8400...', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

---

### 2. GET /clipboard/{clipboard_id}

**Purpose**: Retrieve clipboard content

**Request**:
```http
GET /clipboard/550e8400-e29b-41d4-a716-446655440000
```

**Process**:
1. Extract clipboard_id from URL path
2. Query database for clipboard
3. If found, return clipboard data
4. If not found, return 404 error

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Shared text content here",
  "created_at": "2024-01-15T10:30:00.000000",
  "updated_at": "2024-01-15T10:35:00.000000"
}
```

**Response** (404 Not Found):
```json
{
  "detail": "Clipboard with id '550e8400...' not found"
}
```

**Database Operation**:
```sql
SELECT id, content, created_at, updated_at
FROM clipboards
WHERE id = '550e8400...';
```

---

### 3. PUT /clipboard/{clipboard_id}

**Purpose**: Update clipboard content

**Request**:
```http
PUT /clipboard/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "content": "Updated content goes here"
}
```

**Process**:
1. Extract clipboard_id from URL path
2. Extract new content from request body
3. Validate clipboard exists
4. Update content and timestamp
5. Return updated clipboard data

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Updated content goes here",
  "created_at": "2024-01-15T10:30:00.000000",
  "updated_at": "2024-01-15T10:40:00.000000"
}
```

**Response** (404 Not Found):
```json
{
  "detail": "Clipboard with id '550e8400...' not found"
}
```

**Database Operation**:
```sql
UPDATE clipboards
SET content = 'Updated content goes here',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '550e8400...';
```

---

## 🔍 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  URL Parser  │    │  Text Editor │    │ API Client   │  │
│  │              │    │              │    │              │  │
│  │ Extract ID   │───▶│ Display/Edit │───▶│ HTTP Requests│  │
│  │ from Route   │    │   Content    │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │         │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          │                    │                    │ HTTP/JSON
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   FastAPI    │    │    CRUD      │    │  Database    │  │
│  │   Routes     │───▶│  Operations  │───▶│   Models     │  │
│  │              │    │              │    │              │  │
│  │ • POST /new  │    │ • create()   │    │ • Clipboard  │  │
│  │ • GET /{id}  │    │ • read()     │    │   table      │  │
│  │ • PUT /{id}  │    │ • update()   │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │         │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          │                    │                    │ SQLAlchemy
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE (SQLite)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             clipboards table                          │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id (PK)      │ content      │ created_at │ updated_at │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ abc-123      │ "Hello!"     │ 2024-...   │ 2024-...   │  │
│  │ def-456      │ "World"      │ 2024-...   │ 2024-...   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Frontend Implementation Guide

When building the React frontend, follow this flow:

### Component Structure

```jsx
App.js
├── Router
    ├── HomePage (path: "/")
    │   └── Redirect to /clipboard/new or create new
    │
    └── ClipboardPage (path: "/:clipboardId")
        ├── useParams() to get clipboardId
        ├── useEffect() to fetch clipboard content
        ├── TextArea for editing
        └── Save button to update content
```

### Key Functions

```javascript
// 1. Create new clipboard
async function createNewClipboard() {
  const response = await fetch('http://localhost:8000/clipboard/new', {
    method: 'POST'
  });
  const data = await response.json();
  // Redirect to: `/${data.id}`
  return data.id;
}

// 2. Fetch clipboard content
async function fetchClipboard(clipboardId) {
  const response = await fetch(`http://localhost:8000/clipboard/${clipboardId}`);
  if (response.ok) {
    const data = await response.json();
    return data.content;
  } else {
    // Handle 404 - clipboard not found
    throw new Error('Clipboard not found');
  }
}

// 3. Update clipboard content
async function updateClipboard(clipboardId, content) {
  const response = await fetch(`http://localhost:8000/clipboard/${clipboardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  const data = await response.json();
  return data;
}
```

---

## 🔐 Security Notes

### Current Implementation (Development)
- ✅ UUID generation prevents ID guessing
- ✅ Input validation with Pydantic
- ⚠️ No rate limiting
- ⚠️ No content size limits
- ⚠️ No authentication
- ⚠️ CORS open to all origins

### Production Recommendations
1. Add rate limiting (e.g., 100 requests per minute)
2. Implement content size limits (e.g., 1MB max)
3. Add clipboard expiration (auto-delete after 24 hours)
4. Restrict CORS to frontend domain only
5. Add optional password protection
6. Implement content sanitization
7. Add HTTPS/SSL
8. Add request logging and monitoring

---

## 📝 Example Usage Flow

### Complete Example: Sharing Code Snippet

```
Step 1: Alice creates a clipboard
  → Visits: http://localhost:3000/
  → Frontend calls: POST /clipboard/new
  → Gets ID: "abc-123"
  → Redirected to: http://localhost:3000/abc-123

Step 2: Alice pastes code
  → Pastes Python code in text area
  → Clicks "Save" or auto-saves
  → Frontend calls: PUT /clipboard/abc-123
  → Backend saves content

Step 3: Alice shares URL
  → Copies URL: http://localhost:3000/abc-123
  → Sends to Bob via Slack/Email

Step 4: Bob opens URL
  → Visits: http://localhost:3000/abc-123
  → Frontend calls: GET /clipboard/abc-123
  → Bob sees Alice's code

Step 5: Bob makes changes
  → Edits the code
  → Saves changes
  → Frontend calls: PUT /clipboard/abc-123
  → Backend updates content

Step 6: Alice refreshes
  → Refreshes page
  → Frontend calls: GET /clipboard/abc-123
  → Alice sees Bob's changes

Both Alice and Bob are now collaborating on the same clipboard!
```

---

## 🚀 Performance Considerations

### Database Indexing
```sql
-- Primary key index (automatic)
CREATE UNIQUE INDEX idx_clipboard_id ON clipboards(id);

-- For future: Add index on created_at for cleanup queries
CREATE INDEX idx_created_at ON clipboards(created_at);
```

### Caching Strategy (Future)
- Cache frequently accessed clipboards in Redis
- Set TTL to match clipboard expiration
- Invalidate cache on updates

### Optimization Tips
1. Use connection pooling for database
2. Implement pagination for clipboard history
3. Compress large content before storage
4. Use CDN for static assets
5. Implement lazy loading in frontend

---

## 📚 Related Documentation

- [Backend README](README.md) - Complete backend documentation
- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [API Collection](api_collection.json) - Postman/Thunder Client collection

---

**Last Updated**: 2024
**Version**: 1.0.0