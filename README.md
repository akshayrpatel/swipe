# 🎮 Swipe Challenge

**Test your reflexes and unlock progressive challenges in this fast-paced swipe game!**

Built with React, TypeScript, and Tailwind CSS, this game challenges players to make quick decisions by swiping cards in the correct direction based on dynamic rules that evolve as you progress.

![Game Preview](https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

## 🚀 How It Works

### 🎯 Core Gameplay

- **Quick Decision Making**: Each card presents a challenge that requires you to swipe left or right
- **Progressive Difficulty**: Start with simple color matching and unlock increasingly complex challenges
- **Time Pressure**: 60-second timer with bonus time when you unlock new challenge types
- **Lives System**: 3 mistakes maximum - make each swipe count!

### 🎲 Challenge Types

#### 🎨 **Color Matching** _(Starting Level)_

- **Right Swipe**: Colors match the previous card
- **Left Swipe**: Colors are different
- _Simple pattern recognition to get you started_

#### 🔢 **Number Comparison** _(Unlocked at 10 correct)_

- **Right Swipe**: Current number is greater than previous
- **Left Swipe**: Current number is less than or equal to previous
- _Mathematical comparison skills_

#### 🦁 **Emoji Categories** _(Unlocked at 20 correct)_

- **Right Swipe**: Animal emojis (🦁🐼🐯🐸🐧)
- **Left Swipe**: Food emojis (🍎🍕🍔🍰🍓)
- _Category recognition and quick classification_

#### 🧭 **Direction Words** _(Unlocked at 30 correct)_

- **Right Swipe**: Word says "RIGHT"
- **Left Swipe**: Any other direction word (LEFT, UP, DOWN)
- _Reading comprehension under pressure_

#### 📝 **Vowel/Consonant** _(Unlocked at 40 correct)_

- **Right Swipe**: Word starts with a vowel (A, E, I, O, U)
- **Left Swipe**: Word starts with a consonant
- _Language pattern recognition_

#### 🧮 **Math Challenge** _(Unlocked at 50 correct)_

- **Right Swipe**: Math result is even
- **Left Swipe**: Math result is odd
- _Quick mental arithmetic_

## 🎮 Controls

### 🖱️ **Mouse/Trackpad**

- **Drag & Drop**: Click and drag cards left or right
- **Visual Feedback**: Cards scale and show direction hints while dragging

### ⌨️ **Keyboard**

- **Left Arrow (←)**: Swipe left
- **Right Arrow (→)**: Swipe right
- _Perfect for rapid-fire gameplay_

### 📱 **Touch/Click Buttons**

- **Dynamic Action Buttons**: Bottom-left and bottom-right buttons change based on current challenge
- **Smart Labels**: Buttons show exactly what each swipe direction means
- _Ideal for touch devices and clear visual guidance_

## 🏆 Game Features

### ⏱️ **Smart Timer System**

- **Base Time**: 60 seconds per game
- **Bonus Time**: +60 seconds every time you unlock a new challenge type
- **Visual Warnings**: Timer turns red in final 10 seconds

### 🔓 **Progressive Unlocking**

- **Unlock Requirement**: 10 consecutive correct answers per new challenge type
- **Progress Tracking**: Visual progress bar shows advancement toward next unlock
- **Instant Feedback**: Celebration message when new challenges unlock

### 💖 **Lives & Scoring**

- **3 Lives Maximum**: Game ends after 3 incorrect swipes
- **Consecutive Tracking**: Mistakes reset your unlock progress
- **Score Tracking**: Points for every correct swipe

### 🎨 **Polished UI/UX**

- **Smooth Animations**: Card transitions and hover effects
- **Color-Coded Feedback**: Green for correct, red for incorrect, purple for unlocks
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: React Icons (Font Awesome) for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React hooks for clean, functional state management

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd swipe

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎯 Game Strategy Tips

1. **Start Slow**: Focus on accuracy over speed initially
2. **Learn Patterns**: Each challenge type has consistent rules
3. **Use All Controls**: Switch between mouse, keyboard, and buttons based on comfort
4. **Watch the Timer**: Plan your unlocking strategy around time bonuses
5. **Stay Calm**: Mistakes reset progress, so accuracy is key

## 🏅 Scoring & Achievements

### 🌟 **Performance Levels**

- **🏆 Incredible (30+ points)**: Master level performance
- **⭐ Excellent (20-29 points)**: Outstanding reflexes
- **👏 Great (15-19 points)**: Solid gameplay
- **👍 Good (10-14 points)**: Getting the hang of it
- **💪 Keep Practicing (0-9 points)**: Room for improvement

### 🎖️ **Unlock Milestones**

- **Level 1**: Color Matching (Default)
- **Level 2**: Number Comparison (10 correct)
- **Level 3**: Emoji Categories (20 correct)
- **Level 4**: Direction Words (30 correct)
- **Level 5**: Vowel/Consonant (40 correct)
- **Level 6**: Math Challenge (50 correct)

## 🔧 Customization

The game is built with modularity in mind. Key areas for customization:

- **Challenge Types**: Add new level types in the `LevelType` union
- **Timing**: Adjust `GAME_DURATION` and `UNLOCK_THRESHOLD` constants
- **Difficulty**: Modify unlock requirements and mistake limits
- **Styling**: Customize colors and animations via Tailwind classes

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: Touch events, keyboard navigation, responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **React Icons** for comprehensive icon library
- **Vite** for lightning-fast development experience

---

**Ready to test your reflexes? Start swiping and see how many challenges you can unlock! 🚀**
