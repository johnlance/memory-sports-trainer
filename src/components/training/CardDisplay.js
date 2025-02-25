import React, { useState, useEffect, useRef } from 'react';

const CardDisplay = ({ 
  isSessionActive, 
  onCardViewed, 
  cardDelay = 1000,
  focusedCards = []
}) => {
  // State for the current card
  const [currentCard, setCurrentCard] = useState(null);
  // State to track if a card is visible
  const [isCardVisible, setIsCardVisible] = useState(false);
  // Reference to track card viewing time
  const cardStartTimeRef = useRef(null);
  
  // All possible cards in a standard deck
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  // Create the full deck
  const generateDeck = () => {
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    return deck;
  };
  
  // Shuffle the deck
  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Generate focused training deck
  const generateFocusedDeck = (focusedCards, deckSize = 12) => {
    // Get the base deck
    const fullDeck = generateDeck();
    
    // Filter out the focused cards from the main deck
    const regularCards = fullDeck.filter(card => 
      !focusedCards.some(focusedCard => 
        focusedCard.value === card.value && focusedCard.suit === card.suit
      )
    );
    
    // Shuffle the regular cards
    const shuffledRegularCards = shuffleDeck(regularCards);
    
    // Take enough regular cards to fill the deck (minus focused cards)
    const selectedRegularCards = shuffledRegularCards.slice(0, deckSize - focusedCards.length);
    
    // Combine and shuffle the final deck
    return shuffleDeck([...selectedRegularCards, ...focusedCards]);
  };
  
  // Display the next card
  const showNextCard = () => {
    // Reset visibility
    setIsCardVisible(false);
    
    // Generate or update deck as needed
    let deck;
    if (focusedCards.length > 0) {
      deck = generateFocusedDeck(focusedCards);
    } else {
      deck = shuffleDeck(generateDeck());
    }
    
    // Choose a card (for now just the first one in the shuffled deck)
    // In a real implementation, you'd maintain deck state and draw the next card
    const nextCard = deck[0];
    
    // After a brief delay, show the card
    setTimeout(() => {
      setCurrentCard(nextCard);
      setIsCardVisible(true);
      cardStartTimeRef.current = performance.now();
    }, 500);
  };
  
  // Handle when the user is done viewing the card
  const handleCardViewed = () => {
    if (!isCardVisible || !currentCard) return;
    
    const viewingTime = performance.now() - cardStartTimeRef.current;
    
    // Pass the card and timing data up to the parent component
    onCardViewed({
      card: currentCard,
      viewingTime,
      timestamp: new Date().toISOString()
    });
    
    // If the session is still active, show another card
    if (isSessionActive) {
      setTimeout(showNextCard, cardDelay);
    } else {
      setIsCardVisible(false);
    }
  };
  
  // Start showing cards when the session is activated
  useEffect(() => {
    if (isSessionActive) {
      showNextCard();
    } else {
      setIsCardVisible(false);
      setCurrentCard(null);
    }
  }, [isSessionActive]);
  
  // Determine card color based on suit
  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-64 h-96 border-2 rounded-xl flex items-center justify-center bg-white shadow-lg cursor-pointer"
        onClick={handleCardViewed}
      >
        {isCardVisible && currentCard ? (
          <div 
            className={`text-6xl font-bold ${getCardColor(currentCard.suit)}`}
          >
            {currentCard.value}{currentCard.suit}
          </div>
        ) : (
          <div className="text-gray-400 text-xl">
            {isSessionActive ? "Preparing next card..." : "Start session to begin"}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-500 text-sm">
        Click on the card when you've memorized it
      </div>
    </div>
  );
};

export default CardDisplay;