const cardService = require('../services/cardsService');

// GET: here we fetch all cards for the logged-in user
const getAllCards = async (req, res) => {
  try {
    const cards = await cardService.getUserCards(req.user.id);
    res.render('cards', {
      user: req.user,
      cards,
      error: null,
      success: null,
    });
  } catch (err) {
    res.render('cards', {
      user: req.user,
      cards: [],
      error: err.message || 'Error fetching cards.',
      success: null,
    });
  }
};

// GET: we just render the create card form
const getCreateCard = (req, res) => {
  res.render('createCard', {
    user: req.user,
    error: null,
    success: null,
  });
};

// POST: handling the create card form submission
const postCreateCard = async (req, res) => {
  const { word, translation, topic, exampleSentence, difficulty, tags } = req.body;

  if (!word || !translation) {
    return res.render('createCard', {
      user: req.user,
      error: 'Word and translation are required.',
      success: null,
    });
  }

  try {
    // Converting tags from a comma-separated string to an array
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    await cardService.createCard(
      req.user.id,
      word,
      translation,
      topic,
      exampleSentence,
      difficulty,
      tagsArray
    );
    res.render('cards', {
      user: req.user,
      cards: await cardService.getUserCards(req.user.id),
      error: null,
      success: 'Flashcard created successfully!',
    });
  } catch (err) {
    res.render('createCard', {
      user: req.user,
      error: err.message || 'Error creating flashcard.',
      success: null,
    });
  }
};

// GET: again just rendering the update card form
const getUpdateCard = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await cardService.getCardById(id, req.user.id);
    if (!card) {
      return res.render('cards', {
        user: req.user,
        cards: await cardService.getUserCards(req.user.id),
        error: 'Flashcard not found.',
        success: null,
      });
    }
    res.render('updateCard', {
      user: req.user,
      card,
      error: null,
      success: null,
    });
  } catch (err) {
    res.render('cards', {
      user: req.user,
      cards: await cardService.getUserCards(req.user.id),
      error: err.message || 'Error fetching flashcard.',
      success: null,
    });
  }
};

// POST: Handle the update card form submission
const postUpdateCard = async (req, res) => {
  const { id } = req.params;
  const { word, translation, topic, exampleSentence, difficulty, tags } = req.body;

  if (!word || !translation) {
    return res.render('updateCard', {
      user: req.user,
      card: { id, word, translation, topic, exampleSentence, difficulty, tags },
      error: 'Word and translation are required.',
      success: null,
    });
  }

  try {
    // we convert tags from a comma-separated string to an array
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    await cardService.updateCard(
      id,
      req.user.id,
      word,
      translation,
      topic,
      exampleSentence,
      difficulty,
      tagsArray
    );
    res.render('cards', {
      user: req.user,
      cards: await cardService.getUserCards(req.user.id),
      error: null,
      success: 'Flashcard updated successfully!',
    });
  } catch (err) {
    res.render('updateCard', {
      user: req.user,
      card: { id, word, translation, topic, exampleSentence, difficulty, tags },
      error: err.message || 'Error updating flashcard.',
      success: null,
    });
  }
};

// POST: Handling the delete card action
const postDeleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    await cardService.deleteCard(id, req.user.id);
    res.render('cards', {
      user: req.user,
      cards: await cardService.getUserCards(req.user.id),
      error: null,
      success: 'Flashcard deleted successfully!',
    });
  } catch (err) {
    res.render('cards', {
      user: req.user,
      cards: await cardService.getUserCards(req.user.id),
      error: err.message || 'Error deleting flashcard.',
      success: null,
    });
  }
};

const postReviewCard = async (req, res) => {
    const { id } = req.params;
  
    try {
      await cardService.markReviewed(id, req.user.id);
      res.render('cards', {
        user: req.user,
        cards: await cardService.getUserCards(req.user.id),
        error: null,
        success: 'Flashcard marked as reviewed!',
      });
    } catch (err) {
      res.render('cards', {
        user: req.user,
        cards: await cardService.getUserCards(req.user.id),
        error: err.message || 'Error marking flashcard as reviewed.',
        success: null,
      });
    }
  };

module.exports = {
  getAllCards,
  getCreateCard,
  postCreateCard,
  getUpdateCard,
  postUpdateCard,
  postDeleteCard,
  postReviewCard,
};