<div align="center">

# 📋 Shared Clipboard

### A simple, collaborative clipboard for sharing text via unique URLs

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [API Docs](#api-documentation) • [Contributing](#contributing)

</div>

---

## 📖 About

Shared Clipboard is a full-stack web application that enables users to share textual content through unique, shareable URLs. Perfect for quickly transferring text between devices, collaborating on notes, or sharing code snippets without the need for authentication.

### ✨ Features

- 🔗 **Unique Shareable URLs** - Each clipboard gets a unique UUID-based URL
- 📝 **Real-time Collaboration** - Multiple users can read and write simultaneously
- 💾 **Auto-save** - Content automatically saves as you type
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🚀 **No Auth Required** - Start sharing instantly, no sign-up needed
- 📦 **Persistent Storage** - Data stored reliably in SQLite database
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS
- 📋 **One-Click Copy** - Easily copy content and share links

## 🎬 Demo

> 👉 **Coming Soon**: Live demo link will be added after deployment

**How it works:**

1. Visit the homepage and click "Create New Clipboard"
2. You'll be redirected to a unique URL like `yoursite.com/abc-123-def`
3. Type or paste your content - it saves automatically
4. Share the URL with anyone who needs access
5. All users with the link can view and edit the same content

## 🛠️ Built With

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - SQL toolkit and ORM
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation
- [Uvicorn](https://www.uvicorn.org/) - ASGI server
- [SQLite](https://www.sqlite.org/) - Lightweight database

### Frontend
- [React 18](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [React Router](https://reactrouter.com/) - Client-side routing
- [Axios](https://axios-http.com/) - HTTP client
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Material Symbols](https://fonts.google.com/icons) - Icon system

## 📦 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yasirverseai/shared-clipboard.git
cd shared-clipboard
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python run.py
```

The API will be available at `http://localhost:8000`

📚 **API Documentation**: `http://localhost:8000/docs`

#### 3️⃣ Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

> **Note**: Ensure the backend is running before starting the frontend.

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information and health status |
| `GET` | `/health` | Health check endpoint |
| `POST` | `/clipboard/new` | Create a new clipboard with unique ID |
| `GET` | `/clipboard/{id}` | Retrieve clipboard content by ID |
| `PUT` | `/clipboard/{id}` | Update clipboard content |

### Example Requests

<details>
<summary><b>Create New Clipboard</b></summary>

```bash
curl -X POST http://localhost:8000/clipboard/new
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```
</details>

<details>
<summary><b>Get Clipboard Content</b></summary>

```bash
curl http://localhost:8000/clipboard/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Your shared text here",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```
</details>

<details>
<summary><b>Update Clipboard</b></summary>

```bash
curl -X PUT http://localhost:8000/clipboard/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, World!"}'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Hello, World!",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:35:00"
}
```
</details>

For interactive API documentation, visit `http://localhost:8000/docs` when the server is running.

See [backend/API_WORKFLOW.md](backend/API_WORKFLOW.md) for detailed workflow documentation.

## 📁 Project Structure

```
shared-clipboard/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py        # Package initializer
│   │   ├── main.py            # FastAPI app & routes
│   │   ├── database.py        # Database models & config
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── crud.py            # Database operations
│   ├── requirements.txt       # Python dependencies
│   ├── run.py                 # Server startup script
│   ├── test_api.py            # API test script
│   └── README.md              # Backend documentation
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── HomePage.jsx  # Landing page
│   │   │   └── ClipboardPage.jsx  # Clipboard editor
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Dependencies
│   ├── vite.config.js        # Vite configuration
│   └── README.md             # Frontend documentation
│
└── README.md                  # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
python test_api.py
```

### Manual Testing

1. Visit `http://localhost:8000/docs` for interactive API testing
2. Import `backend/api_collection.json` into Postman or Thunder Client
3. Test the full workflow through the frontend interface

## 🚀 Deployment

### Backend Deployment

Deploy to platforms like:
- **Railway** - Easy deployment with auto-scaling
- **Render** - Free tier available
- **Heroku** - Classic PaaS option
- **AWS/Google Cloud** - For production workloads

### Frontend Deployment

Deploy to platforms like:
- **Vercel** - Optimized for React/Vite apps
- **Netlify** - Simple CI/CD integration
- **Cloudflare Pages** - Fast global CDN

### Environment Variables

**Backend** (`.env`):
```env
DATABASE_URL=sqlite:///./clipboard.db
CORS_ORIGINS=https://yourfrontend.com
```

**Frontend** (`.env`):
```env
VITE_API_URL=https://your-api-url.com
```

## 🔒 Security

> ⚠️ **Note**: Current implementation is suitable for development and trusted environments.

**Current Status:**
- ✅ CORS enabled (configurable)
- ✅ Input validation with Pydantic
- ✅ UUID-based IDs (hard to guess)
- ❌ No authentication
- ❌ No rate limiting
- ❌ No content size limits

**Production Recommendations:**
- Implement rate limiting (e.g., with `slowapi`)
- Add content size validation
- Enable HTTPS/TLS
- Restrict CORS to specific domains
- Add optional password protection
- Implement clipboard expiration
- Add input sanitization
- Consider adding user authentication

## 🗺️ Roadmap

- [ ] Real-time updates using WebSockets
- [ ] Clipboard history and versioning
- [ ] Markdown and rich text support
- [ ] Syntax highlighting for code
- [ ] File upload support
- [ ] Dark mode toggle
- [ ] QR code generation for URLs
- [ ] Clipboard expiration options
- [ ] Password protection
- [ ] Analytics dashboard

See [Issues](https://github.com/yasirverseai/shared-clipboard/issues) for a full list of proposed features and known issues.

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yasirverseai](https://github.com/yasirverseai)
- Email: yasirverse.ai@gmail.com

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - For the excellent web framework
- [React](https://reactjs.org/) - For the powerful UI library
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Vite](https://vitejs.dev/) - For the blazing fast build tool
- All contributors who participate in this project

## 💬 Support

If you have any questions or need help, please:

- 📝 Open an [issue](https://github.com/yasirverseai/shared-clipboard/issues)
- 💬 Start a [discussion](https://github.com/yasirverseai/shared-clipboard/discussions)
- ⭐ Star this repository if you find it helpful!

---

<div align="center">

**[⬆ Back to Top](#-shared-clipboard)**

Made with ❤️ by developers, for developers

</div>