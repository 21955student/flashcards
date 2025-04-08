const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardsController');

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/users/login');
  }
  next();
}; // this is a middleware to redirect users to login route if they are not authenticated
router.use(requireAuth);

router.get('/', cardController.getAllCards);

// Creating a new card
router.get('/create', cardController.getCreateCard);
router.post('/create', cardController.postCreateCard);

// Updating an existing card
router.get('/:id/update', cardController.getUpdateCard);
router.post('/:id/update', cardController.postUpdateCard);

// Deleting a card
router.post('/:id/delete', cardController.postDeleteCard);
router.post('/:id/review', cardController.postReviewCard);
module.exports = router;