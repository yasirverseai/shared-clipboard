# Shared Clipboard API Documentation

## Overview

The Shared Clipboard API is a RESTful service built with FastAPI that allows users to create and share textual data via unique URLs. Users can create clipboards, add cards (text snippets) to them, and share the clipboard URL with others for collaborative text sharing.

**Base URL:** `http://localhost:8000` (development)  
**API Version:** 1.0.0

## Features

- Create unique clipboards with shareable IDs
- Add, update, and delete text cards within clipboards
- Real-time collaboration through shared clipboard URLs
- Automatic cleanup of old and empty clipboards
- CORS enabled for frontend integration

## Data Models

### Clipboard
```json
{
  "id": "string",           // 6-character alphanumeric unique ID
  "created_at": "datetime", // ISO 8601 timestamp
  "updated_at": "datetime", // ISO 8601 timestamp
  "cards": []              // Array of Card objects
}
```

### Card
```json
{
  "id": "integer",          // Auto-incrementing ID
  "clipboard_id": "string", // Reference to parent clipboard
  "content": "string",      // Text content of the card
  "user_name": "string",    // Optional user identifier
  "created_at": "datetime", // ISO 8601 timestamp
  "updated_at": "datetime"  // ISO 8601 timestamp
}
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Endpoints

### Root Endpoint

#### GET /
Get API information and available endpoints.

**Response:**
```json
{
  "message": "Shared Clipboard API",
  "endpoints": {
    "POST /clipboard/new": "Create a new clipboard",
    "GET /clipboard/{clipboard_id}": "Get clipboard with all cards",
    "POST /clipboard/{clipboard_id}/cards": "Add a new card",
    "PUT /cards/{card_id}": "Update a card",
    "DELETE /cards/{card_id}": "Delete a card",
    "DELETE /clipboard/{clipboard_id}": "Delete entire clipboard",
    "POST /admin/cleanup/old": "Cleanup old clipboards (7+ days)",
    "POST /admin/cleanup/empty": "Cleanup empty clipboards"
  }
}
```

### Clipboard Operations

#### POST /clipboard/new
Create a new clipboard with a unique ID.

**Response:** `201 Created`
```json
{
  "id": "AbC123"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/clipboard/new
```

#### GET /clipboard/{clipboard_id}
Retrieve a clipboard by its ID with all associated cards.

**Parameters:**
- `clipboard_id` (path): The unique clipboard identifier

**Response:** `200 OK`
```json
{
  "id": "AbC123",
  "created_at": "2024-01-07T10:30:00Z",
  "updated_at": "2024-01-07T10:30:00Z",
  "cards": [
    {
      "id": 1,
      "clipboard_id": "AbC123",
      "content": "Hello, world!",
      "user_name": "John",
      "created_at": "2024-01-07T10:30:00Z",
      "updated_at": "2024-01-07T10:30:00Z"
    }
  ]
}
```

**Error Response:** `404 Not Found`
```json
{
  "detail": "Clipboard with id 'AbC123' not found"
}
```

**Example:**
```bash
curl http://localhost:8000/clipboard/AbC123
```

#### DELETE /clipboard/{clipboard_id}
Delete an entire clipboard and all its cards.

**Parameters:**
- `clipboard_id` (path): The unique clipboard identifier

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "detail": "Clipboard with id 'AbC123' not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/clipboard/AbC123
```

### Card Operations

#### POST /clipboard/{clipboard_id}/cards
Create a new card in the specified clipboard.

**Parameters:**
- `clipboard_id` (path): The unique clipboard identifier

**Request Body:**
```json
{
  "content": "string",      // Required: Text content
  "user_name": "string"     // Optional: User identifier
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "clipboard_id": "AbC123",
  "content": "Hello, world!",
  "user_name": "John",
  "created_at": "2024-01-07T10:30:00Z",
  "updated_at": "2024-01-07T10:30:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "detail": "Clipboard with id 'AbC123' not found"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/clipboard/AbC123/cards \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, world!", "user_name": "John"}'
```

#### PUT /cards/{card_id}
Update the content of an existing card.

**Parameters:**
- `card_id` (path): The unique card identifier

**Request Body:**
```json
{
  "content": "string"  // Required: New text content
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "clipboard_id": "AbC123",
  "content": "Updated content",
  "user_name": "John",
  "created_at": "2024-01-07T10:30:00Z",
  "updated_at": "2024-01-07T10:35:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "detail": "Card with id '1' not found"
}
```

**Example:**
```bash
curl -X PUT http://localhost:8000/cards/1 \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated content"}'
```

#### DELETE /cards/{card_id}
Delete a specific card.

**Parameters:**
- `card_id` (path): The unique card identifier

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "detail": "Card with id '1' not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/cards/1
```

### Admin Operations

#### POST /admin/cleanup/old
Delete clipboards that haven't been accessed in the specified number of days.

**Query Parameters:**
- `days` (optional): Number of days (default: 7)

**Response:** `200 OK`
```json
{
  "message": "Cleaned up 5 old clipboard(s)",
  "days": 7,
  "deleted": 5
}
```

**Example:**
```bash
curl -X POST "http://localhost:8000/admin/cleanup/old?days=14"
```

#### POST /admin/cleanup/empty
Delete clipboards that have no cards.

**Response:** `200 OK`
```json
{
  "message": "Cleaned up 3 empty clipboard(s)",
  "deleted": 3
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/admin/cleanup/empty
```

### Health Check

#### GET /health
Health check endpoint to verify API status.

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

**Example:**
```bash
curl http://localhost:8000/health
```

## Error Handling

The API uses standard HTTP status codes and returns error details in JSON format:

### Common Error Responses

**404 Not Found:**
```json
{
  "detail": "Resource not found message"
}
```

**422 Unprocessable Entity:**
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS Configuration

The API is configured to accept requests from any origin (`allow_origins=["*"]`). For production, configure specific allowed origins for security.

## Database

The API uses SQLite as the database backend with the following tables:

- **clipboards**: Stores clipboard metadata
- **cards**: Stores individual text cards linked to clipboards

## Development

### Running the API

```bash
cd backend
python run.py
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

### Environment Variables

Create a `.env` file in the backend directory:
```
DATABASE_URI=sqlite:///./database.db
```

## Interactive Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

These interfaces allow you to test API endpoints directly from the browser.