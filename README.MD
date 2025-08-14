# 📚 Text-to-Learn: AI-Powered Course Generator

**Text-to-Learn** is a full-stack, AI-powered course generator web app that transforms any user-submitted topic into a structured, multi-module online course. Designed for self-learners and content creators, it uses LLMs to generate course outlines, lessons, videos, MCQs, and even Hinglish audio explanations — all rendered in a responsive UI and downloadable as PDFs.

---
<p align="center">
  <img src="client/public/assets/ss-1.png" alt="App Screenshot" width="700">
</p>


## 🧩 Tech Stack

### 🖥️ Frontend

- ⚛️ **React + Vite** - Modern React development with fast build times
- 🎨 **Tailwind CSS** - Utility-first CSS framework for responsive design
- 🧭 **React Router DOM** - Client-side routing for SPA navigation
- 🔐 **Google OAuth** - Secure authentication and user management with Gmail
- 📄 **jsPDF + html2canvas** - PDF generation and export functionality
- 🌍 **Axios** - HTTP client for API communication

### 🗄️ Backend

- 🌐 **Node.js + Express.js** - Server-side JavaScript runtime and web framework
- 🗃️ **MongoDB + Mongoose** - NoSQL database with ODM for data modeling
- 🔐 **Google OAuth Middleware** - Authentication and authorization middleware
- 🤖 **OpenAI / Gemini APIs** - AI-powered course and lesson generation
- 📹 **YouTube Data API v3** - Video integration and content enrichment

### ☁️ Deployment

- 🎯 **Frontend**: Vercel - Global CDN and serverless functions
- 🛠️ **Backend**: Render - Cloud platform for web services
- 🔁 **CI/CD**: GitHub Actions (planned) - Automated deployment pipeline

---

## 🧠 Key Features

| Feature                  | Description |
|--------------------------|-------------|
| 🎯 **Prompt to Course**       | Enter any topic to generate a full online course with modules & lessons. |
| 📄 **Lesson Generation**     | Each lesson includes headings, paragraphs, MCQs, code, and videos. |
| 📦 **PDF Download**          | Export lessons as well-formatted PDFs using `html2canvas` + `jsPDF`. |
| 🌍 **Multilingual Support**  | AI-generated Hinglish audio explanations via Gemini API. |
| 🔐 **Secure Auth**           | Google OAuth authentication for saving and personalizing courses. |
| 📊 **Persistent Storage**    | All content stored in MongoDB with relational course structure. |

---

## 🖼️ UI Flow

- `/`: Home page with form to generate a course.
- `/login` Google OAuth-based authentication pages (Gmail sign-in).
- `/course/:id`: Full course overview with module list.
- `/lesson/:id`: Interactive lesson page (MCQs, videos, PDF download).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Google Cloud Platform project with OAuth credentials
- OpenAI API key
- Google Cloud Platform account (for Gemini API)
- YouTube Data API v3 key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aritra-dev/text-to-learn.git
   cd text-to-learn
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

3. **Environment setup**
   ```bash
   # Frontend (.env)
   # Google OAuth does not require these
   # VITE_AUTH0_CLIENT_ID is not needed
   VITE_API_BASE_URL=http://localhost:3000
   
   # Backend (.env)
   # AUTH0_AUDIENCE and AUTH0_ISSUER_BASE_URL are not needed
   MONGODB_URI=your-mongodb-connection-string
   OPENAI_API_KEY=your-openai-api-key
   GEMINI_API_KEY=your-gemini-api-key
   YOUTUBE_API_KEY=your-youtube-api-key
   ```

4. **Run the application**
   ```bash
   # Backend (Terminal 1)
   cd server
   npm run dev
   
   # Frontend (Terminal 2)
   cd client
   npm run dev
   ```

---

## 🔧 API Endpoints

### Course Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/courses` | Create a new course |
| `GET` | `/api/courses` | Get all courses for user |
| `GET` | `/api/courses/:id` | Get specific course |
| `PUT` | `/api/courses/:id` | Update course |
| `DELETE` | `/api/courses/:id` | Delete course |

### Lesson Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/lessons` | Create a new lesson |
| `GET` | `/api/lessons/:id` | Get specific lesson |
| `PUT` | `/api/lessons/:id` | Update lesson |
| `DELETE` | `/api/lessons/:id` | Delete lesson |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/profile` | Get user profile |
| `POST` | `/api/auth/logout` | Logout user |

---

## 🎨 UI Components

### Core Components

- **CourseCard** - Displays course overview with progress
- **LessonViewer** - Interactive lesson content with MCQs
- **PDFExporter** - Generates and downloads lesson PDFs
- **VideoPlayer** - Embedded YouTube video player
- **AuthGuard** - Route protection for authenticated users

### Styling

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Theme switching capability
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages

---

## 🤖 AI Integration

### Course Generation

1. **Topic Analysis** - OpenAI analyzes user input for course structure
2. **Module Creation** - Generates logical module breakdown
3. **Lesson Content** - Creates detailed lesson content with examples
4. **MCQ Generation** - AI-generated multiple choice questions
5. **Video Integration** - YouTube API finds relevant educational videos


#### Example: Course Generation Flow

**Input:** `"Intro to React Hooks"`

**Output:**
```javascript
{
  title: "Introduction to React Hooks",
  description: "Master the fundamentals of React Hooks for modern functional components",
  tags: ["React", "JavaScript", "Frontend", "Hooks", "Web Development"],
  modules: [
    {
      title: "Basics of Hooks",
      lessons: [
        "Understanding useState Hook",
        "Working with useEffect Hook",
        "useContext for State Management"
      ]
    },
    {
      title: "Advanced Hooks",
      lessons: [
        "Custom Hooks Development",
        "useReducer for Complex State",
        "useMemo and useCallback Optimization"
      ]
    },
    {
      title: "Real-world Applications",
      lessons: [
        "Building Forms with Hooks",
        "API Integration with useEffect",
        "Performance Optimization Techniques"
      ]
    }
  ]
}
```

#### Example: Lesson Generation Flow

**Input:** Course: "Introduction to React Hooks" + Module: "Basics of Hooks" + Lesson: "Understanding useState Hook"

**Output:**
```javascript
{
  title: "Understanding useState Hook",
  objectives: [
    "Learn the fundamental concept of useState hook",
    "Understand how to manage component state with useState",
    "Practice creating interactive components using state"
  ],
  content: [
    {
      type: "heading",
      text: "What is useState Hook?"
    },
    {
      type: "paragraph",
      text: "The useState hook is one of the most fundamental hooks in React. It allows functional components to manage state, which was previously only possible with class components. When you call useState, it returns an array with two elements: the current state value and a function to update it."
    },
    {
      type: "code",
      language: "jsx",
      text: "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}"
    },
    {
      type: "video",
      query: "React useState hook tutorial",
      videoId: "dQw4w9WgXcQ",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      type: "mcq",
      question: "What does useState hook return?",
      options: [
        "A single value",
        "An array with current state and setter function",
        "A function only",
        "An object with state properties"
      ],
      answer: 1
    },
    {
      type: "paragraph",
      text: "The useState hook is essential for building interactive React components. It provides a simple way to add state management to functional components, making them more powerful and dynamic."
    }
  ]
}
```
---

## 🔒 Security Features

- **Google OAuth Integration** - Secure authentication and authorization
- **JWT Tokens** - Stateless authentication
- **CORS Configuration** - Cross-origin resource sharing
- **Input Validation** - Server-side validation and sanitization
- **Rate Limiting** - API request throttling
- **Environment Variables** - Secure configuration management

---

## 🚀 Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Backend (Render)

1. Connect GitHub repository to Render
2. Set environment variables
3. Configure build commands and start script
4. Deploy with automatic scaling

-----

## 📈 Performance Optimization

### Frontend
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format and lazy loading
- **Bundle Analysis** - Webpack bundle analyzer
- **Caching** - Service worker for offline support

### Backend
- **Database Indexing** - Optimized MongoDB queries
- **Caching** - Redis for session storage
- **Compression** - Gzip compression middleware
- **Rate Limiting** - API request throttling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aritra Dev**
- GitHub: [@aritra-dev](https://github.com/aritra-2000)
- LinkedIn: [Aritra Dev](https://linkedin.com/in/aritra-paul-ok)

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- Google for Gemini API
- YouTube Data API
- Auth0 for authentication
- Vercel and Render for hosting
- Tailwind CSS for styling
- React and Node.js communities

---

*Last updated: December 2024*
