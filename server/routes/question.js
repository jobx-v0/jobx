const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// Create a new question
router.post('/questions', authMiddleware, isAdmin, QuestionController.createQuestion);

// Get all questions
router.get('/questions', authMiddleware, QuestionController.getAllQuestions);

// Get a single question by ID
router.get('/questions/:id', authMiddleware, QuestionController.getQuestionById);

// Update a question by ID
router.put('/questions/:id', authMiddleware, isAdmin, QuestionController.updateQuestionById);

// Delete a question by ID
router.delete('/questions/:id', authMiddleware, isAdmin, QuestionController.deleteQuestionById);

module.exports = router;
