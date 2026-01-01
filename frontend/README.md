# Shared Clipboard - Frontend

A modern React frontend for the Shared Clipboard application. Built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend server running on http://localhost:8000

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── HomePage.jsx   # Landing page
│   │   └── ClipboardPage.jsx  # Clipboard editor
│   ├── services/
│   │   └── api.js         # API service layer
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies
```

## 🎨 Features

- **Create New Clipboard** - Generate unique shareable links
- **Join Existing Clipboard** - Access via clipboard ID or URL
- **Auto-save** - Content saved automatically as you type
- **Copy to Clipboard** - One-click copy for content and share links
- **Download Content** - Export clipboard as text file
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - UI supports dark mode
- **Material Icons** - Modern icon system

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

See `.env.example` for all available options.

### API Integration

The frontend communicates with the backend via REST API:

- `POST /clipboard/new` - Create new clipboard
- `GET /clipboard/{id}` - Fetch clipboard content
- `PUT /clipboard/{id}` - Update clipboard content

API calls are handled in `src/services/api.js`

## 🧩 Components

### HomePage
- Landing page with hero section
- Create new clipboard button
- Join existing clipboard form
- Feature showcase

### ClipboardPage
- Text editor with auto-save
- Share link with copy button
- Download and clear actions
- Loading and error states
- Character count display

## 🎯 How It Works

1. **User visits homepage** (/)
   - Can create new clipboard → redirects to `/{id}`
   - Can join existing clipboard by entering ID

2. **User visits clipboard page** (/{id})
   - Fetches content from backend
   - Displays in editable textarea
   - Auto-saves changes after 1 second of inactivity
   - Shows save status

3. **User shares URL**
   - Copy share link button
   - Anyone with link can access and edit

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| Material Symbols | Icons |

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Styling

The app uses Tailwind CSS with custom configuration:

- **Primary Color**: `#2b8cee` (blue)
- **Fonts**: Manrope (display), Noto Sans (body)
- **Dark Mode**: Class-based dark mode support

## 🔄 State Management

State is managed using React hooks:
- `useState` - Local component state
- `useEffect` - Side effects (API calls)
- `useCallback` - Memoized callbacks
- `useRef` - DOM references and timers

## 🚨 Error Handling

The app handles various error scenarios:
- Network errors
- 404 clipboard not found
- Invalid clipboard IDs
- Failed save operations

## ⚡ Performance

- Auto-save debouncing (1 second)
- Optimized re-renders
- Code splitting with Vite
- Lazy loading ready

## 🔐 Security Considerations

- CORS handled by backend
- No sensitive data in frontend
- Clipboard IDs are UUIDs (hard to guess)
- Read-only share links

## 📝 Development Notes

### Adding New Features

1. Create component in `src/components/`
2. Add route in `src/App.jsx`
3. Add API method in `src/services/api.js`
4. Style with Tailwind classes

### Styling Guidelines

- Use Tailwind utility classes
- Follow mobile-first approach
- Support dark mode with `dark:` prefix
- Use custom colors from config

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### API Connection Failed
- Ensure backend is running on port 8000
- Check VITE_API_URL in .env
- Verify CORS is enabled in backend

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Vercel / Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL=<your-backend-url>`

### Build Optimization

The production build is optimized with:
- Minification
- Tree shaking
- Code splitting
- Asset optimization

## 📚 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🤝 Integration with Backend

Make sure the backend is running before starting the frontend:

```bash
# Terminal 1 - Backend
cd backend
python run.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📄 License

MIT License

---

**Built with ❤️ using React + Vite + Tailwind CSS**