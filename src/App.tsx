import React, { useState, useCallback, useEffect } from "react";
import {
	FaPlay,
	FaInfoCircle,
	FaRedo,
	FaClock,
	FaGamepad,
	FaHeart,
	FaStar,
	FaTrophy,
	FaUnlock,
	FaChevronLeft,
	FaChevronRight,
	FaTimes,
	FaCheck,
	FaArrowUp,
	FaArrowDown,
	FaAppleAlt,
	FaPaw,
	FaArrowLeft,
	FaArrowRight,
} from "react-icons/fa";

// Define the possible colors and numbers for the game cards
const COLORS = ["Red", "Blue", "Green", "Yellow", "Purple"];
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SWIPE_THRESHOLD = 50; // Minimum pixels to register a swipe
const GAME_DURATION = 60; // Game duration in seconds
const MAX_MISTAKES = 3; // Maximum allowed incorrect answers
const UNLOCK_THRESHOLD = 10; // Correct guesses needed to unlock next level

// Emoji categories for emoji level type
const ANIMAL_EMOJIS = [
	"🦁",
	"🐼",
	"🐯",
	"🐸",
	"🐧",
	"🦋",
	"🐝",
	"🐠",
	"🐙",
	"🦊",
];
const FOOD_EMOJIS = [
	"🍎",
	"🍕",
	"🍔",
	"🍰",
	"🍓",
	"🥕",
	"🍌",
	"🍇",
	"🥪",
	"🍪",
];

// Direction words for direction level type
const DIRECTION_WORDS = ["LEFT", "RIGHT", "UP", "DOWN"];

// Simple words for vowel/consonant level type
const SIMPLE_WORDS = [
	"APPLE",
	"BOOK",
	"CAR",
	"DOG",
	"ELEPHANT",
	"FISH",
	"GUITAR",
	"HOUSE",
	"ICE",
	"JUMP",
	"KITE",
	"LION",
	"MOON",
	"NEST",
	"OCEAN",
	"PIANO",
	"QUEEN",
	"ROBOT",
	"SUN",
	"TREE",
	"UMBRELLA",
	"VIOLIN",
	"WATER",
	"XRAY",
	"YELLOW",
	"ZEBRA",
];

// Math expressions for the new math level type
const MATH_EXPRESSIONS = [
	{ expression: "2 + 3", result: 5 },
	{ expression: "7 - 4", result: 3 },
	{ expression: "3 × 2", result: 6 },
	{ expression: "8 ÷ 2", result: 4 },
	{ expression: "5 + 1", result: 6 },
	{ expression: "9 - 3", result: 6 },
	{ expression: "4 × 3", result: 12 },
	{ expression: "10 ÷ 5", result: 2 },
];

// Tailwind CSS classes for each color
const COLOR_CLASSES = {
	Red: "bg-red-500",
	Blue: "bg-blue-500",
	Green: "bg-green-500",
	Yellow: "bg-yellow-500",
	Purple: "bg-purple-500",
};

// TypeScript types for better type safety
type GameState = "landing" | "playing" | "gameOver";
type SwipeDirection = "left" | "right";
type LevelType = "color" | "number" | "emoji" | "direction" | "vowel" | "math";

type CardData =
	| {
			type: "color";
			value: string;
	  }
	| {
			type: "number";
			value: number;
	  }
	| {
			type: "emoji";
			value: string;
			category: "animal" | "food";
	  }
	| {
			type: "direction";
			value: string;
	  }
	| {
			type: "vowel";
			value: string;
			startsWithVowel: boolean;
	  }
	| {
			type: "math";
			expression: string;
			result: number;
	  };

function App() {
	// Core game state management using React hooks
	const [gameState, setGameState] = useState<GameState>("landing");
	const [levelType, setLevelType] = useState<LevelType>("color");
	const [currentRound, setCurrentRound] = useState(0);
	const [score, setScore] = useState(0);
	const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [cards, setCards] = useState<CardData[]>([]);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [showFeedback, setShowFeedback] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
	const [unlockedLevelTypes, setUnlockedLevelTypes] = useState<LevelType[]>([
		"color",
	]);
	const [shouldResetTimer, setShouldResetTimer] = useState(false); // New state for timer reset trigger

	// State for drag/swipe detection and animations
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationDirection, setAnimationDirection] = useState<
		"left" | "right" | null
	>(null);

	// Generate a random color from the available colors array
	const generateRandomColor = useCallback((): string => {
		return COLORS[Math.floor(Math.random() * COLORS.length)];
	}, []);

	// Generate a random number from the available numbers array
	const generateRandomNumber = useCallback((): number => {
		return NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
	}, []);

	// Generate a random emoji card with category information
	const generateRandomEmoji = useCallback((): {
		type: "emoji";
		value: string;
		category: "animal" | "food";
	} => {
		const isAnimal = Math.random() < 0.5;
		if (isAnimal) {
			const emoji =
				ANIMAL_EMOJIS[Math.floor(Math.random() * ANIMAL_EMOJIS.length)];
			return { type: "emoji", value: emoji, category: "animal" };
		} else {
			const emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
			return { type: "emoji", value: emoji, category: "food" };
		}
	}, []);

	// Generate a random direction word
	const generateRandomDirection = useCallback((): {
		type: "direction";
		value: string;
	} => {
		const direction =
			DIRECTION_WORDS[Math.floor(Math.random() * DIRECTION_WORDS.length)];
		return { type: "direction", value: direction };
	}, []);

	// Generate a random word with vowel/consonant information
	const generateRandomWord = useCallback((): {
		type: "vowel";
		value: string;
		startsWithVowel: boolean;
	} => {
		const word = SIMPLE_WORDS[Math.floor(Math.random() * SIMPLE_WORDS.length)];
		const firstLetter = word.charAt(0).toLowerCase();
		const startsWithVowel = ["a", "e", "i", "o", "u"].includes(firstLetter);
		return { type: "vowel", value: word, startsWithVowel };
	}, []);

	// Generate a random math expression card
	const generateRandomMath = useCallback((): {
		type: "math";
		expression: string;
		result: number;
	} => {
		const mathProblem =
			MATH_EXPRESSIONS[Math.floor(Math.random() * MATH_EXPRESSIONS.length)];
		return {
			type: "math",
			expression: mathProblem.expression,
			result: mathProblem.result,
		};
	}, []);

	// Generate a single card based on the specified level type
	const generateCard = useCallback(
		(type: LevelType): CardData => {
			switch (type) {
				case "color":
					return { type: "color", value: generateRandomColor() };
				case "number":
					return { type: "number", value: generateRandomNumber() };
				case "emoji":
					return generateRandomEmoji();
				case "direction":
					return generateRandomDirection();
				case "vowel":
					return generateRandomWord();
				case "math":
					return generateRandomMath();
				default:
					return { type: "color", value: generateRandomColor() };
			}
		},
		[
			generateRandomColor,
			generateRandomNumber,
			generateRandomEmoji,
			generateRandomDirection,
			generateRandomWord,
			generateRandomMath,
		]
	);

	// Generate the next card with a randomly selected level type from unlocked types
	const generateNextCard = useCallback((): CardData => {
		const randomType =
			unlockedLevelTypes[Math.floor(Math.random() * unlockedLevelTypes.length)];
		setLevelType(randomType);
		return generateCard(randomType);
	}, [generateCard, unlockedLevelTypes]);

	// Check if a new level should be unlocked based on consecutive correct guesses
	const checkLevelUnlock = useCallback(
		(newConsecutiveCorrect: number) => {
			const allLevelTypes: LevelType[] = [
				"color",
				"number",
				"emoji",
				"direction",
				"vowel",
				"math",
			];
			const currentUnlockedCount = unlockedLevelTypes.length;
			const requiredCorrect = currentUnlockedCount * UNLOCK_THRESHOLD;

			if (
				newConsecutiveCorrect >= requiredCorrect &&
				currentUnlockedCount < allLevelTypes.length
			) {
				const nextLevelType = allLevelTypes[currentUnlockedCount];
				setUnlockedLevelTypes((prev) => [...prev, nextLevelType]);

				// Trigger timer reset when a new level is unlocked
				setShouldResetTimer(true);

				// Show unlock feedback
				const levelNames = {
					number: "Number Comparison",
					emoji: "Emoji Category",
					direction: "Direction Word",
					vowel: "Vowel/Consonant",
					math: "Math Challenge",
				};

				setFeedback(
					`🎉 New Challenge Unlocked: ${
						levelNames[nextLevelType as keyof typeof levelNames]
					}! +60s Bonus!`
				);
				setShowFeedback(true);

				setTimeout(() => {
					setShowFeedback(false);
				}, 2500);
			}
		},
		[unlockedLevelTypes]
	);

	// Enhanced timer effect with reset capability when new levels are unlocked
	useEffect(() => {
		let interval: NodeJS.Timeout;

		// Handle timer reset when a new level is unlocked
		if (shouldResetTimer && gameState === "playing") {
			setTimeRemaining(GAME_DURATION);
			setShouldResetTimer(false);
			return; // Exit early to avoid starting the interval immediately
		}

		// Normal timer countdown logic
		if (gameState === "playing" && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining((prev) => {
					if (prev <= 1) {
						setGameState("gameOver");
						setFeedback("Time's Up! Game Over!");
						setShowFeedback(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [gameState, timeRemaining, shouldResetTimer]);

	// Keyboard event handler for arrow key controls
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (gameState !== "playing" || isAnimating) return;

			if (event.key === "ArrowLeft") {
				event.preventDefault();
				handleSwipe("left");
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				handleSwipe("right");
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [gameState, isAnimating]);

	// Initialize or restart the game with fresh state
	const startGame = useCallback(() => {
		// Reset unlocked levels to just color for new game
		setUnlockedLevelTypes(["color"]);

		// Generate first card (always color for new game)
		const firstCard = generateCard("color");
		setLevelType("color");

		setCards([firstCard]);
		setCurrentCardIndex(0);
		setCurrentRound(1);
		setScore(0);
		setConsecutiveCorrect(0);
		setMistakes(0);
		setGameState("playing");
		setFeedback("");
		setShowFeedback(false);
		setTimeRemaining(GAME_DURATION);
		setShouldResetTimer(false); // Reset timer reset flag
		setDragOffset({ x: 0, y: 0 });
		setIsAnimating(false);
		setAnimationDirection(null);
	}, [generateCard]);

	// Determine if a swipe is correct based on the current level type and card data
	const isSwipeCorrect = useCallback(
		(
			direction: SwipeDirection,
			currentCard: CardData,
			previousCard: CardData | null
		): boolean => {
			if (!previousCard) return true; // First card has no comparison

			switch (currentCard.type) {
				case "color":
					// Color matching: Right = same color, Left = different color
					const colorsMatch = currentCard.value === (previousCard as any).value;
					return (
						(direction === "right" && colorsMatch) ||
						(direction === "left" && !colorsMatch)
					);

				case "number":
					// Number comparison: Right = current > previous, Left = current <= previous
					const currentNumber = currentCard.value;
					const previousNumber = (previousCard as any).value;
					const currentIsGreater = currentNumber > previousNumber;
					return (
						(direction === "right" && currentIsGreater) ||
						(direction === "left" && !currentIsGreater)
					);

				case "emoji":
					// Emoji category: Right = animal, Left = food
					const isAnimal = currentCard.category === "animal";
					return (
						(direction === "right" && isAnimal) ||
						(direction === "left" && !isAnimal)
					);

				case "direction":
					// Direction word: Right if word is "RIGHT", Left otherwise
					const isRightWord = currentCard.value === "RIGHT";
					return (
						(direction === "right" && isRightWord) ||
						(direction === "left" && !isRightWord)
					);

				case "vowel":
					// Vowel/Consonant: Right if starts with vowel, Left if starts with consonant
					const startsWithVowel = currentCard.startsWithVowel;
					return (
						(direction === "right" && startsWithVowel) ||
						(direction === "left" && !startsWithVowel)
					);

				case "math":
					// Math challenge: Right if result is even, Left if result is odd
					const isEven = currentCard.result % 2 === 0;
					return (
						(direction === "right" && isEven) ||
						(direction === "left" && !isEven)
					);

				default:
					return false;
			}
		},
		[]
	);

	// Core game logic for processing swipe actions with smooth animations
	const handleSwipe = useCallback(
		(direction: SwipeDirection) => {
			if (gameState !== "playing" || isAnimating) return;

			// Start swipe animation
			setIsAnimating(true);
			setAnimationDirection(direction);

			const currentCard = cards[currentCardIndex];
			const previousCard =
				currentCardIndex > 0 ? cards[currentCardIndex - 1] : null;

			// Check if swipe is correct
			const isCorrect = isSwipeCorrect(direction, currentCard, previousCard);

			// Update score, consecutive correct, and mistakes
			if (isCorrect) {
				const newScore = score + 1;
				const newConsecutiveCorrect = consecutiveCorrect + 1;

				setScore(newScore);
				setConsecutiveCorrect(newConsecutiveCorrect);
				setFeedback("Correct!");

				// Check for level unlock
				checkLevelUnlock(newConsecutiveCorrect);
			} else {
				const newMistakes = mistakes + 1;
				setMistakes(newMistakes);
				setConsecutiveCorrect(0); // Reset consecutive correct on mistake
				setFeedback("Incorrect!");

				// Check if game should end due to too many mistakes
				if (newMistakes >= MAX_MISTAKES) {
					setTimeout(() => {
						setGameState("gameOver");
						setFeedback("Game Over! Too many mistakes!");
						setShowFeedback(true);
						setIsAnimating(false);
						setAnimationDirection(null);
					}, 300);
					return;
				}
			}

			setShowFeedback(true);

			// Generate next card and continue game after animation completes
			setTimeout(() => {
				const nextCard = generateNextCard();
				setCards((prev) => [...prev, nextCard]);
				setCurrentCardIndex((prev) => prev + 1);
				setCurrentRound((prev) => prev + 1);
				setShowFeedback(false);
				setDragOffset({ x: 0, y: 0 });
				setIsAnimating(false);
				setAnimationDirection(null);
			}, 1000);
		},
		[
			gameState,
			isAnimating,
			cards,
			currentCardIndex,
			mistakes,
			score,
			consecutiveCorrect,
			isSwipeCorrect,
			generateNextCard,
			checkLevelUnlock,
		]
	);

	// Mouse event handlers for swipe gesture detection
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (gameState !== "playing" || isAnimating) return;

			setIsDragging(true);
			setDragStart({ x: e.clientX, y: e.clientY });
			setDragOffset({ x: 0, y: 0 });
		},
		[gameState, isAnimating]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging || isAnimating) return;

			const deltaX = e.clientX - dragStart.x;
			const deltaY = e.clientY - dragStart.y;
			setDragOffset({ x: deltaX, y: deltaY });
		},
		[isDragging, dragStart, isAnimating]
	);

	const handleMouseUp = useCallback(() => {
		if (!isDragging || isAnimating) return;

		setIsDragging(false);

		// Check if drag distance exceeds threshold to register as swipe
		if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
			const direction: SwipeDirection = dragOffset.x > 0 ? "right" : "left";
			handleSwipe(direction);
		} else {
			// Reset card position if threshold not met
			setDragOffset({ x: 0, y: 0 });
		}
	}, [isDragging, dragOffset.x, handleSwipe, isAnimating]);

	// Get current card data for display
	const currentCard = cards[currentCardIndex];

	// Calculate progress to next unlock
	const getProgressToNextUnlock = (): {
		current: number;
		needed: number;
		nextLevel: string;
	} => {
		const allLevelTypes: LevelType[] = [
			"color",
			"number",
			"emoji",
			"direction",
			"vowel",
			"math",
		];
		const currentUnlockedCount = unlockedLevelTypes.length;

		if (currentUnlockedCount >= allLevelTypes.length) {
			return { current: 0, needed: 0, nextLevel: "All Unlocked!" };
		}

		const requiredCorrect = currentUnlockedCount * UNLOCK_THRESHOLD;
		const remaining = Math.max(0, requiredCorrect - consecutiveCorrect);

		const levelNames = {
			number: "Number Comparison",
			emoji: "Emoji Category",
			direction: "Direction Word",
			vowel: "Vowel/Consonant",
			math: "Math Challenge",
		};

		const nextLevelType = allLevelTypes[currentUnlockedCount];
		const nextLevelName =
			levelNames[nextLevelType as keyof typeof levelNames] || "Unknown";

		return {
			current: consecutiveCorrect,
			needed: remaining,
			nextLevel: nextLevelName,
		};
	};

	// Dynamic instruction text based on game state and level type
	const getInstructionText = (): string => {
		if (currentCardIndex === 0 && gameState === "playing") {
			return "Swipe to start!";
		}
		if (gameState === "playing") {
			switch (levelType) {
				case "color":
					return "Swipe right if colors match, left if different";
				case "number":
					return "Swipe right if current > previous, left if current ≤ previous";
				case "emoji":
					return "Swipe right for animals 🦁, left for food 🍎";
				case "direction":
					return 'Swipe right if word is "RIGHT", left otherwise';
				case "vowel":
					return "Swipe right if starts with vowel, left for consonant";
				case "math":
					return "Swipe right if result is even, left if odd";
				default:
					return "";
			}
		}
		return "";
	};

	// Get dynamic action button content based on current level type
	const getActionButtonContent = (): {
		left: { text: string; icon: React.ReactNode };
		right: { text: string; icon: React.ReactNode };
	} => {
		switch (levelType) {
			case "color":
				return {
					left: { text: "DIFFERENT", icon: <FaTimes size={16} /> },
					right: { text: "SAME", icon: <FaCheck size={16} /> },
				};
			case "number":
				return {
					left: { text: "LESS/EQUAL", icon: <FaArrowDown size={16} /> },
					right: { text: "GREATER", icon: <FaArrowUp size={16} /> },
				};
			case "emoji":
				return {
					left: { text: "FOOD", icon: <FaAppleAlt size={16} /> },
					right: { text: "ANIMAL", icon: <FaPaw size={16} /> },
				};
			case "direction":
				return {
					left: { text: "LEFT WORD", icon: <FaArrowLeft size={16} /> },
					right: { text: "RIGHT WORD", icon: <FaArrowRight size={16} /> },
				};
			case "vowel":
				return {
					left: {
						text: "CONSONANT",
						icon: <span className="text-xs font-bold">C</span>,
					},
					right: {
						text: "VOWEL",
						icon: <span className="text-xs font-bold">V</span>,
					},
				};
			case "math":
				return {
					left: {
						text: "ODD",
						icon: <span className="text-xs font-bold">1</span>,
					},
					right: {
						text: "EVEN",
						icon: <span className="text-xs font-bold">2</span>,
					},
				};
			default:
				return {
					left: { text: "LEFT", icon: <FaChevronLeft size={16} /> },
					right: { text: "RIGHT", icon: <FaChevronRight size={16} /> },
				};
		}
	};

	// Get level type display name
	const getLevelDisplayName = (): string => {
		switch (levelType) {
			case "color":
				return "Color Match";
			case "number":
				return "Number Compare";
			case "emoji":
				return "Emoji Category";
			case "direction":
				return "Direction Word";
			case "vowel":
				return "Vowel/Consonant";
			case "math":
				return "Math Challenge";
			default:
				return "Unknown";
		}
	};

	const progressInfo = getProgressToNextUnlock();
	const actionButtons = getActionButtonContent();

	// Format time display as MM:SS
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Calculate animation transform based on current state
	const getCardTransform = (): string => {
		if (isAnimating && animationDirection) {
			const translateX = animationDirection === "right" ? "100%" : "-100%";
			return `translateX(${translateX})`;
		}
		if (isDragging) {
			return `translate(${dragOffset.x * 0.5}px, ${
				dragOffset.y * 0.1
			}px) scale(1.05)`;
		}
		return "translateX(0)";
	};

	// Render card content based on card type
	const renderCardContent = (card: CardData) => {
		switch (card.type) {
			case "color":
				return null; // Color is shown as background
			case "number":
				return (
					<span className="text-6xl font-bold text-white">{card.value}</span>
				);
			case "emoji":
				return <span className="text-6xl">{card.value}</span>;
			case "direction":
				return (
					<span className="text-3xl font-bold text-white">{card.value}</span>
				);
			case "vowel":
				return (
					<span className="text-2xl font-bold text-white">{card.value}</span>
				);
			case "math":
				return (
					<div className="text-center text-white">
						<div className="text-3xl font-bold mb-2">{card.expression}</div>
						<div className="text-xl">= {card.result}</div>
					</div>
				);
			default:
				return null;
		}
	};

	// Get card background class based on card type - special handling for emoji cards
	const getCardBackground = (card: CardData): string => {
		switch (card.type) {
			case "color":
				return COLOR_CLASSES[card.value as keyof typeof COLOR_CLASSES];
			case "number":
				return "bg-gradient-to-br from-gray-700 to-gray-900";
			case "emoji":
				// Light and muted background for better emoji visibility
				return "bg-gradient-to-br from-gray-100 to-gray-200";
			case "direction":
				return "bg-gradient-to-br from-blue-600 to-indigo-700";
			case "vowel":
				return "bg-gradient-to-br from-green-600 to-emerald-700";
			case "math":
				return "bg-gradient-to-br from-orange-600 to-red-700";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
			{/* Main game container with optimized dimensions and proper overflow handling */}
			<div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg h-full flex flex-col relative overflow-hidden">
				{/* Subtle background animation */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 animate-pulse"></div>

				{/* Content wrapper with proper positioning for feedback messages */}
				<div className="relative z-10 flex flex-col h-full">
					{/* Landing Page - Enhanced with animations and better design */}
					{gameState === "landing" && (
						<div className="flex-1 flex flex-col justify-center space-y-8">
							{/* Animated title with icons */}
							<div className="text-center space-y-4">
								<div className="flex items-center justify-center gap-3 mb-4">
									<FaStar className="text-yellow-500 animate-pulse" size={32} />
									<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
										Swipe Challenge
									</h1>
									<FaStar className="text-yellow-500 animate-pulse" size={32} />
								</div>
								<p className="text-lg text-gray-600 font-medium">
									Test your reflexes with progressive challenges!
								</p>
							</div>

							{/* Game features with animated icons */}
							<div className="flex flex-col space-y-4 items-center justify-center">
								<div className="flex items-center gap-3 text-gray-600">
									<FaTrophy
										className="text-amber-500 animate-bounce"
										size={20}
									/>
									<span className="text-sm">
										Unlock 6 different challenge types
									</span>
								</div>
								<div className="flex items-center gap-3 text-gray-600">
									<FaHeart className="text-red-500 animate-pulse" size={20} />
									<span className="text-sm">3 lives - make them count!</span>
								</div>
								<div className="flex items-center gap-3 text-gray-600">
									<FaClock className="text-blue-500" size={20} />
									<span className="text-sm">
										60 seconds + time bonus for unlocks
									</span>
								</div>
								<div className="flex items-center gap-3 text-gray-600">
									<FaUnlock className="text-green-500" size={20} />
									<span className="text-sm">
										Earn 10 correct answers to unlock new challenges
									</span>
								</div>
							</div>

							{/* Controls instruction */}
							<div className="bg-gray-50 rounded-2xl p-4 space-y-3">
								<div className="flex items-center gap-2 justify-center">
									<FaInfoCircle className="text-indigo-500" size={18} />
									<span className="font-semibold text-gray-700">
										How to Play
									</span>
								</div>
								<div className="flex flex-col items-center text-sm text-gray-600 space-y-2">
									<p>
										🖱️ <strong>Mouse:</strong> Drag cards left or right
									</p>
									<p>
										⌨️ <strong>Keyboard:</strong> Use ← → arrow keys
									</p>
									<p>
										📱 <strong>Touch:</strong> Use the swipe buttons
									</p>
									<p>
										🎯 <strong>Goal:</strong> Follow the challenge rules for
										each card type
									</p>
								</div>
							</div>

							{/* Animated start button */}
							<button
								onClick={startGame}
								className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 mx-auto animate-pulse"
								aria-label="Start new game"
							>
								<FaPlay size={24} />
								Start Your Challenge
							</button>
						</div>
					)}

					{/* Playing Screen - Optimized layout with larger card area */}
					{gameState === "playing" && (
						<div className="flex-1 flex flex-col space-y-4">
							{/* Game title header */}
							<div className="text-center">
								<h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
									<FaGamepad className="text-indigo-600" size={28} />
									Swipe Challenge
								</h1>
							</div>

							{/* Game info display: mode, score, round */}
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3">
									<p className="text-gray-500 text-xs">Current Challenge</p>
									<p className="font-bold text-indigo-600">
										{getLevelDisplayName()}
									</p>
								</div>
								<div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
									<p className="text-gray-500 text-xs">Round</p>
									<p className="font-bold text-gray-800">{currentRound}</p>
								</div>
							</div>

							{/* Timer, Score, and Lives display */}
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<FaClock
										size={16}
										className={
											timeRemaining <= 10 ? "text-red-500" : "text-gray-500"
										}
									/>
									<span
										className={`font-mono text-sm ${
											timeRemaining <= 10
												? "text-red-500 font-bold"
												: "text-gray-600"
										}`}
									>
										{formatTime(timeRemaining)}
									</span>
								</div>
								<div className="text-sm text-gray-600">
									Score:{" "}
									<span className="font-bold text-indigo-600 text-lg">
										{score}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<FaHeart
										size={16}
										className={mistakes >= 2 ? "text-red-500" : "text-gray-500"}
									/>
									<span
										className={`text-sm ${
											mistakes >= 2 ? "text-red-500 font-bold" : "text-gray-600"
										}`}
									>
										{mistakes}/{MAX_MISTAKES}
									</span>
								</div>
							</div>

							{/* Progress to next unlock */}
							{progressInfo.needed > 0 && (
								<div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
									<div className="flex items-center gap-2 mb-1">
										<FaUnlock className="text-amber-600" size={14} />
										<span className="text-xs font-semibold text-amber-700">
											Next Unlock
										</span>
									</div>
									<p className="text-xs text-amber-600">
										{progressInfo.needed} more correct for{" "}
										<strong>{progressInfo.nextLevel}</strong>
									</p>
									<div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
										<div
											className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
											style={{
												width: `${Math.max(
													0,
													((progressInfo.current % UNLOCK_THRESHOLD) /
														UNLOCK_THRESHOLD) *
														100
												)}%`,
											}}
										></div>
									</div>
								</div>
							)}

							{/* Current card - larger and more prominent */}
							<div className="flex-1 flex flex-col justify-center">
								<p className="text-sm text-gray-500 mb-4 text-center">
									Current{" "}
									{levelType === "color"
										? "Color"
										: levelType === "number"
										? "Number"
										: levelType === "emoji"
										? "Emoji"
										: levelType === "direction"
										? "Direction"
										: levelType === "math"
										? "Math"
										: "Word"}
									:
								</p>
								<div className="relative overflow-hidden">
									<div
										className={`w-56 h-56 rounded-3xl mx-auto cursor-grab active:cursor-grabbing shadow-2xl transition-transform duration-300 ease-out flex items-center justify-center ${
											currentCard
												? getCardBackground(currentCard)
												: "bg-gray-500"
										} ${
											isDragging && !isAnimating
												? "scale-110"
												: "hover:scale-105"
										}`}
										style={{
											transform: getCardTransform(),
										}}
										onMouseDown={handleMouseDown}
										onMouseMove={handleMouseMove}
										onMouseUp={handleMouseUp}
										onMouseLeave={handleMouseUp}
										role="button"
										tabIndex={0}
										aria-label={`Current ${levelType} is ${currentCard?.value}. Use arrow keys or drag to make your choice.`}
									>
										{currentCard && renderCardContent(currentCard)}

										{/* Visual feedback overlay during drag */}
										{isDragging &&
											Math.abs(dragOffset.x) > 20 &&
											!isAnimating && (
												<div
													className={`absolute inset-0 rounded-3xl flex items-center justify-center text-white font-bold text-xl ${
														dragOffset.x > 0
															? "bg-green-500 bg-opacity-40"
															: "bg-red-500 bg-opacity-40"
													}`}
												>
													{dragOffset.x > 0
														? actionButtons.right.text
														: actionButtons.left.text}
												</div>
											)}
									</div>
								</div>
							</div>

							{/* Dynamic instruction text */}
							<p className="text-gray-600 text-sm text-center font-medium">
								{getInstructionText()}
							</p>

							{/* Dedicated feedback message area - positioned between instructions and action buttons */}
							<div className="h-16 flex items-center justify-center px-4">
								{showFeedback && (
									<div className="text-center">
										<div
											className={`text-lg font-bold transition-all duration-300 ${
												feedback === "Correct!"
													? "text-green-500"
													: feedback.includes("Unlocked")
													? "text-purple-500"
													: "text-red-500"
											}`}
										>
											{feedback}
										</div>
									</div>
								)}
							</div>

							{/* Dynamic action buttons - positioned at bottom left and right */}
							<div className="flex justify-between items-center px-4">
								<button
									onClick={() => handleSwipe("left")}
									disabled={isAnimating}
									className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[120px] justify-center"
									aria-label={`Swipe left for ${actionButtons.left.text}`}
								>
									{actionButtons.left.icon}
									<span className="text-xs font-bold">
										{actionButtons.left.text}
									</span>
								</button>
								<button
									onClick={() => handleSwipe("right")}
									disabled={isAnimating}
									className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[120px] justify-center"
									aria-label={`Swipe right for ${actionButtons.right.text}`}
								>
									{actionButtons.right.icon}
									<span className="text-xs font-bold">
										{actionButtons.right.text}
									</span>
								</button>
							</div>

							{/* Keyboard controls hint */}
							<p className="text-xs text-gray-400 text-center">
								Use ← → arrow keys or drag to swipe
							</p>
						</div>
					)}

					{/* Game Over Screen - Simplified and clean layout */}
					{gameState === "gameOver" && (
						<div className="flex-1 flex flex-col justify-center space-y-8">
							{/* Game Over Message */}
							<div className="text-center">
								<h2 className="text-3xl font-bold text-gray-800 mb-6">
									{mistakes >= MAX_MISTAKES
										? "Game Over!"
										: timeRemaining === 0
										? "Time's Up!"
										: "Game Over!"}
								</h2>

								{/* Final Results Display */}
								<div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 space-y-4">
									<p className="text-sm text-gray-500 font-semibold">
										Final Results
									</p>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<p className="text-gray-500">Score</p>
											<p className="text-2xl font-bold text-indigo-600">
												{score}
											</p>
										</div>
										<div>
											<p className="text-gray-500">Rounds</p>
											<p className="text-xl font-bold text-gray-800">
												{currentRound}
											</p>
										</div>
										<div>
											<p className="text-gray-500">Mistakes</p>
											<p
												className={`text-xl font-bold ${
													mistakes >= MAX_MISTAKES
														? "text-red-600"
														: "text-gray-800"
												}`}
											>
												{mistakes}/{MAX_MISTAKES}
											</p>
										</div>
										<div>
											<p className="text-gray-500">Challenges Unlocked</p>
											<p className="text-xl font-bold text-purple-600">
												{unlockedLevelTypes.length}/6
											</p>
										</div>
									</div>
									<p className="text-xs text-gray-500">
										Time: {formatTime(GAME_DURATION - timeRemaining)} /{" "}
										{formatTime(GAME_DURATION)}
									</p>
								</div>

								{/* Encouraging feedback based on performance */}
								<p className="text-gray-600 font-medium mb-8">
									{mistakes >= MAX_MISTAKES
										? "Better luck next time!"
										: timeRemaining === 0
										? "Time ran out!"
										: score >= 30
										? "Incredible performance! 🏆"
										: score >= 20
										? "Excellent work! 🌟"
										: score >= 15
										? "Great job! 👏"
										: score >= 10
										? "Good effort! 👍"
										: "Keep practicing! 💪"}
								</p>
							</div>

							{/* Single, prominent restart button */}
							<div className="flex justify-center">
								<button
									onClick={startGame}
									className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
									aria-label="Start new game"
								>
									<FaRedo size={20} />
									Play Again
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
