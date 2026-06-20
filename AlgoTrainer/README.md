# 🚀 AlgoTrainer

> **⚠️ Development Status**: This app is currently in active development. Features and UI may change frequently.

## 🌟 What is AlgoTrainer?

AlgoTrainer is a mobile-first learning app that helps beginners master **Data Structures and Algorithms** through:
- 📝 Simple, beginner-friendly explanations
- 🎨 Interactive visual learning
- 💪 Hands-on practice problems

Our mission: Make DSA feel **intuitive, visual, and achievable**—not intimidating or memorization-heavy.

---

## ❓ Why AlgoTrainer?

Most learners struggle with DSA because:
- Concepts feel too abstract and disconnected from reality
- They don't see *how* algorithms actually work step-by-step
- Practice problems feel disconnected from the theory

**AlgoTrainer solves this** by combining all three:
- ✅ Clear concept explanations
- ✅ Visual breakdowns of algorithms
- ✅ Immediate, guided practice

---

## 📚 What You'll Learn

### 🧱 Core Data Structures
- Arrays
- Linked Lists
- Stacks & Queues
- Hash Maps
- Trees & Graphs
- Heaps

### 🔍 Algorithms
- **Searching**: Linear Search, Binary Search
- **Sorting**: Bubble Sort → Quick Sort progression
- **Graph Traversal**: BFS & DFS fundamentals

### 🧠 Advanced Topics
- Dynamic Programming (intro to patterns)
- Greedy Algorithms
- Backtracking & Recursion

---

## 📲 Installation & Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd AlgoTrainer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Open the app**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (iOS/Android)

---

## 🎯 How to Use AlgoTrainer

### 1. **Home Screen**
   - Quick access to Learn, Practice, and Progress tracking
   - Visual welcome and orientation

### 2. **Learn Mode** 📖
   - Browse data structures and algorithms by category
   - Read step-by-step explanations
   - View visual demonstrations of how concepts work

### 3. **Practice Mode** 🧪
   - Solve problems organized by difficulty (Beginner → Medium → Advanced)
   - Get instant feedback on solutions
   - Track your progress and unlock new topics

### 4. **Visualizations** 🎨
   - Watch algorithms execute in real-time
   - Pause and step through each operation
   - See data structure changes visually

### 5. **Settings** ⚙️
   - Toggle dark/light theme
   - View learning progress
   - Customize learning preferences

---

## 🏗️ Project Structure

```
AlgoTrainer/
├── app/
│   ├── (tabs)/              # Main tab navigation
│   ├── Algorithms/          # Sorting, searching algorithms
│   ├── Advanced/            # DP, greedy, recursion
│   ├── AlgoVisual/          # Interactive visualizations
│   ├── DataStructures/      # Core DS explanations
│   ├── DataVisual/          # DS visual demos
│   ├── Registration/        # Auth flows (login, signup)
│   ├── Screens/             # General screens
│   ├── components/          # Reusable components
│   ├── auth/                # Authentication context
│   └── theme/               # Theme and styling
├── backend/                 # Backend (Node.js, planned)
├── lib/                     # Utilities (Supabase integration)
└── package.json
```

---

## 🔧 Tech Stack

- **Frontend**: Expo, React Native, TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet with dynamic theming
- **Backend** (in progress): Node.js + Supabase
- **State Management**: React Context API

---

## 🔮 Planned Features

- 🎬 Step-by-step algorithm animations
- 🎯 Daily coding challenges
- 🔥 Streak system & gamification
- 🤖 AI-powered hints for problems
- 🏆 Leaderboards & progress comparison
- 📊 Detailed analytics & learning insights

---

## 👨‍💻 For Developers

### File-Based Routing
This project uses Expo Router with file-based routing. Routes are automatically generated from the `app/` directory structure.

### Adding New Topics
1. Create a new folder in `app/DataStructures/` or `app/Algorithms/`
2. Add explanations and code
3. Create corresponding visualization in `app/DataVisual/`
4. Update navigation in related `_layout.tsx` files

### Authentication
User authentication context is in `app/auth/AuthContext.tsx`.

### Theming
Dynamic theming is managed in `app/theme/ThemeContext.tsx`. Customize colors and styles there.

### Component Library
Reusable components are in `app/components/`. Common patterns:
- Card components for topic cards
- Expandable sections for collapsible content

---

## 🤝 Contributing

> More details coming soon!

---

## 📝 License

[To be determined]

---

## 🚨 Known Limitations (Current Development Phase)

- Backend is not fully integrated yet
- Some visualizations are in progress
- Performance optimization pending
- Mobile responsiveness improvements planned

---

## ⚡ Philosophy
> "If you can visualize it, you can understand it."

AlgoTrainer is not about memorizing algorithms — it's about *seeing how they behave*.

---

**Last Updated**: April 2026  
**Status**: Active Development 🔨
