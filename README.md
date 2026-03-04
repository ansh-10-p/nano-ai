# ✨ nano-ai

A sleek, modern AI chat application powered by **Google Gemini**, built with React + Vite.

LINK
https://nano-ai-chi.vercel.app

## Features

- 🤖 **AI Chat** — Real-time conversations powered by `gemini-2.5-flash`
- 🖼️ **Image Attachments** — Attach and send images alongside your messages
- 🎤 **Voice Input** — Speak your message using the Web Speech API (Chrome/Edge)
- 🌗 **Light / Dark Mode** — Persisted theme preference via `localStorage`
- ✍️ **Typewriter Effect** — Smooth animated rendering of AI responses
- 📋 **Copy Responses** — One-click copy button on every AI message
- 👍 **Message Reactions** — Thumbs up / thumbs down on AI replies
- ⚙️ **Settings Panel** — Font size, language, theme, and privacy controls
- 🔐 **Auth Flow** — Login / signup modal with instant Demo mode (no account needed)
- 📱 **Responsive Design** — Sidebar, topbar, and chat area adapt to any screen

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite (rolldown) |
| Routing | React Router DOM v7 |
| Animations | Framer Motion |
| Icons | React Icons (Remix Icon) |
| AI Model | Google Gemini (`@google/generative-ai`) |
| Styling | Vanilla CSS with CSS custom properties |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Google AI Studio](https://aistudio.google.com/) API key

### Installation

```bash
git clone https://github.com/your-username/nano-ai.git
cd nano-ai
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
nano-ai/
├── src/
│   ├── pages/
│   │   ├── LandingPage/   # Hero + auth modal
│   │   ├── ChatPage/      # Main chat interface
│   │   └── auth/          # Login & signup forms
│   ├── components/
│   │   └── Sidebar/       # Conversation sidebar
│   ├── context/
│   │   └── Context.jsx    # Global state (messages, AI calls)
│   ├── config/            # Gemini API setup
│   ├── App.jsx            # Root router & auth state
│   └── index.css          # Global design tokens & styles
├── public/
├── .env                   # API keys (not committed)
└── vite.config.js
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Privacy

Chat history is stored **locally in your browser only** and is never sent to any server other than the Google Gemini API.

## License

MIT
