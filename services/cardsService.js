const fs = require('fs').promises;
const path = require('path');

const flashcardsFilePath = path.join(__dirname, '../data/flashcards.json');

// Helper function to read flashcards from the JSON file
const readFlashcards = async () => {
  try {
    const data = await fs.readFile(flashcardsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper function to write flashcards to the JSON file
const writeFlashcards = async (flashcards) => {
  await fs.writeFile(flashcardsFilePath, JSON.stringify(flashcards, null, 2));
};

// Fetch all cards for a specific user
const getUserCards = async (userId) => {
  const flashcards = await readFlashcards();
  return flashcards.filter(card => card.userId === userId);
};

// Fetch a specific card by ID for a user
const getCardById = async (id, userId) => {
  const flashcards = await readFlashcards();
  return flashcards.find(card => card.id === parseInt(id) && card.userId === userId);
};

// Create a new card
const createCard = async (userId, word, translation, topic, exampleSentence, difficulty, tags) => {
  const flashcards = await readFlashcards();

  const newCard = {
    id: flashcards.length ? flashcards[flashcards.length - 1].id + 1 : 1,
    userId,
    word,
    translation,
    topic: topic || '',
    exampleSentence: exampleSentence || '',
    difficulty: difficulty || 'medium', // Default to medium if not provided
    lastReviewed: null, // Initially null, will be set when reviewed
    reviewCount: 0, // Start at 0
    tags: tags || [], // Default to empty array if not provided
  };

  flashcards.push(newCard);
  await writeFlashcards(flashcards);
  return newCard;
};

// Update an existing card
const updateCard = async (id, userId, word, translation, topic, exampleSentence, difficulty, tags) => {
  const flashcards = await readFlashcards();
  const cardIndex = flashcards.findIndex(card => card.id === parseInt(id) && card.userId === userId);

  if (cardIndex === -1) {
    throw new Error('Flashcard not found or you do not have permission to update it.');
  }

  flashcards[cardIndex] = {
    ...flashcards[cardIndex],
    word,
    translation,
    topic: topic || '',
    exampleSentence: exampleSentence || '',
    difficulty: difficulty || 'medium',
    tags: tags || [],
    // Preserve lastReviewed and reviewCount unless explicitly updated
  };

  await writeFlashcards(flashcards);
  return flashcards[cardIndex];
};

// Delete a card
const deleteCard = async (id, userId) => {
  const flashcards = await readFlashcards();
  const cardIndex = flashcards.findIndex(card => card.id === parseInt(id) && card.userId === userId);

  if (cardIndex === -1) {
    throw new Error('Flashcard not found or you do not have permission to delete it.');
  }

  flashcards.splice(cardIndex, 1);
  await writeFlashcards(flashcards);
};

// Mark a card as reviewed (optional, for future quiz/review functionality)
const markReviewed = async (id, userId) => {
  const flashcards = await readFlashcards();
  const cardIndex = flashcards.findIndex(card => card.id === parseInt(id) && card.userId === userId);

  if (cardIndex === -1) {
    throw new Error('Flashcard not found or you do not have permission to update it.');
  }

  flashcards[cardIndex] = {
    ...flashcards[cardIndex],
    lastReviewed: new Date().toISOString(),
    reviewCount: (flashcards[cardIndex].reviewCount || 0) + 1,
  };

  await writeFlashcards(flashcards);
  return flashcards[cardIndex];
};

module.exports = {
  getUserCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  markReviewed,
};