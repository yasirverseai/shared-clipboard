# Shared Clipboard Backend

A FastAPI-based backend for a shared clipboard application. Users can share textual data via unique URLs.

## Features

- **Unique Clipboard IDs**: Each clipboard gets a unique UUID
- **Create New Clipboard**: Generate a new clipboard with a unique ID
- **Read Clipboard Content**: Retrieve content using the clipboard ID
- **Update Clipboard Content**: Multiple users can update the same clipboard
- **SQLite Database**: Persistent storage using SQLAlchemy ORM
- **CORS Enabled**: Ready for frontend integration

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database
- **Pydantic**: Data validation using Python type hints
- **Uvicorn**: ASGI server

## Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Interactive API Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative API Documentation (ReDoc)**: http://localhost:8000/redoc

## API Endpoints

### 1. Root Endpoint
```
GET /
```
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Shared Clipboard API",
  "endpoints": {
    "POST /clipboard/new": "Create a new clipboard",
    "GET /clipboard/{clipboard_id}": "Get clipboard content",
    "PUT /clipboard/{clipboard_id}": "Update clipboard content"
  }
}
```

### 2. Create New Clipboard
```
POST /clipboard/new
```
Creates a new clipboard with a unique ID.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3. Get Clipboard Content
```
GET /clipboard/{clipboard_id}
```
Retrieves the content of a specific clipboard.

**Parameters:**
- `clipboard_id` (path): The unique ID of the clipboard

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Your shared text here",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:35:00"
}
```

**Error Response (404):**
```json
{
  "detail": "Clipboard with id '...' not found"
}
```

### 4. Update Clipboard Content
```
PUT /clipboard/{clipboard_id}
```
Updates the content of an existing clipboard.

**Parameters:**
- `clipboard_id` (path): The unique ID of the clipboard

**Request Body:**
```json
{
  "content": "Updated text content"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Updated text content",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:40:00"
}
```

**Error Response (404):**
```json
{
  "detail": "Clipboard with id '...' not found"
}
```

### 5. Health Check
```
GET /health
```
Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy"
}
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Package initializer
│   ├── main.py              # FastAPI app and routes
│   ├── database.py          # Database configuration and models
│   ├── schemas.py           # Pydantic schemas
│   └── crud.py              # Database operations
├── requirements.txt         # Python dependencies
├── README.md               # This file
└── clipboard.db            # SQLite database (created automatically)
```

## Database Schema

### Clipboards Table

| Column     | Type     | Description                      |
|------------|----------|----------------------------------|
| id         | String   | Primary key, unique UUID         |
| content    | Text     | The clipboard text content       |
| created_at | DateTime | Timestamp when created           |
| updated_at | DateTime | Timestamp of last update         |

## How It Works

1. **User visits the site without an ID**: 
   - Frontend calls `POST /clipboard/new`
   - Backend generates a unique UUID and creates a new clipboard
   - User is redirected to URL with the clipboard ID

2. **User visits site with a clipboard ID**:
   - Frontend extracts the ID from the URL
   - Frontend calls `GET /clipboard/{clipboard_id}` to fetch content
   - User can view and copy the existing content

3. **User updates clipboard content**:
   - User types or pastes new content
   - Frontend calls `PUT /clipboard/{clipboard_id}` with new content
   - All users with the same clipboard ID can see the updated content

4. **Multiple users share the same clipboard**:
   - Users with the same clipboard ID URL can read and write to the same clipboard
   - Content is synchronized through the database

## Development

### Running Tests

(Tests to be added)

### Environment Variables

You can create a `.env` file for configuration:

```env
DATABASE_URL=sqlite:///./clipboard.db
```

## Production Considerations

Before deploying to production:

1. **CORS Configuration**: Update `allow_origins` in `main.py` to specify your frontend domain instead of `"*"`
2. **Database**: Consider using PostgreSQL or MySQL instead of SQLite
3. **Authentication**: Add authentication if needed to prevent abuse
4. **Rate Limiting**: Implement rate limiting to prevent spam
5. **Content Validation**: Add content size limits and validation
6. **Cleanup**: Implement a cleanup job to delete old clipboards
7. **HTTPS**: Use HTTPS in production
8. **Environment Variables**: Use proper environment variable management

## Future Enhancements

- [ ] Add expiration time for clipboards
- [ ] Implement clipboard history
- [ ] Add password protection for clipboards
- [ ] Add content size limits
- [ ] Implement real-time updates using WebSockets
- [ ] Add support for file uploads
- [ ] Add analytics/usage tracking

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.