const Question = require("../models/Question");

// Controller function to create a new question
const createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    console.log("New Question Added Successfully");
    res.status(201).json({ message: "Question created successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create question. Please try again." });
  }
};

// Controller function to get all questions with pagination
const getAllQuestions = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        $or: [{ question: { $regex: regex } }, { category: { $regex: regex } }],
      };
    }
    // Set default values for page and limit
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    // Calculate the skip value based on the page number and limit
    const skip = (pageNumber - 1) * pageSize;

    // Fetch jobs from the database based on the search query and pagination
    const questions = search
      ? await Question.find(query).skip(skip).limit(pageSize)
      : await Question.find().skip(skip).limit(pageSize);

    // Calculate the total number of jobs matching the search query
    const totalQuestions = search
      ? await Question.countDocuments(query)
      : await Question.countDocuments();

    const totalPages = Math.ceil(totalQuestions / pageSize);

    res.json({
      questions,
      pageNumber,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve questions. Please try again." });
  }
};

// Controller function to get a single question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json(question);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve question. Please try again." });
  }
};

// Controller function to update a question by ID
const updateQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json({ message: "Question updated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update question. Please try again." });
  }
};

// Controller function to delete a question by ID
const deleteQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }
    console.log("Deleted Question successfully");
    res.json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete question. Please try again." });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
