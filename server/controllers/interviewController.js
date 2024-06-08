const User = require('../models/User');
const Interview = require('../models/Interview'); // Import the Interview model
const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || 5; // Default to 5 if not specified in .env
const OpenAI = require('openai');
const mongoose = require('mongoose');
const Question = require('../models/Question');

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Only for local mongo DB connection for testing
// const Questions = [
//     "What are you looking for in your next job?",
//      "What are your career goals for the next five years?",
//      "Describe a problem that you have solved using data. What did you enjoy about the process?"
// ]

const getQuestions = async (req, res) => {
    // res.json({ Questions }); // Use only for local mongo db connection
    try {
      // Fetch random questions, e.g., 3 questions
      const numberOfQuestions = parseInt(process.env.NUMBER_OF_QUESTIONS_IN_INTERVIEW) || 3;
      const randomQuestions = await Question.aggregate([
        { $sample: { size: numberOfQuestions } }
      ]);
  
      res.json({ Questions: randomQuestions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching questions' });
    }

}


// Function to store interview data
const postInterview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { interview } = req.body;

        // Find existing interview data for the user
        let userInterview = await Interview.findOne({ user_id: userId });

        // Check if the user has reached the maximum number of attempts
        if (userInterview && userInterview.interviews.length >= MAX_ATTEMPTS) {
            return res.status(403).json({ message: 'Maximum number of attempts reached.' });
        }

        // Create a new interview attempt
        const newAttempt = {
            interview,
            attempt_number: userInterview ? userInterview.interviews.length + 1 : 1
        };

        // If no existing interview data, create new record
        if (!userInterview) {
            userInterview = new Interview({ user_id: userId, interviews: [newAttempt] });
        } else {
            // Add new attempt to existing interview data
            userInterview.interviews.push(newAttempt);
        }

        // Save the interview data
        await userInterview.save();
        console.log("Interview data stored successfully for Interview number: ",newAttempt.attempt_number);
        res.status(201).json({ message: 'Interview data stored successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to store interview data. Please try again.' });
    }
};

const getCurrentCountOfInterviews = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find existing interview data for the user
        let userInterview = await Interview.findOne({ user_id: userId });

        if (userInterview){
            return res.status(200).json({count: userInterview.interviews.length});
        }
        return res.status(200).json({count: 0});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get the count data. Please try again' });
    }
}

const evaluateInterview = async (req, res) => {
  try {
    console.log("req: ", req.user.id)
    const userId = req.user.id;

    console.log("userId: ", userId)

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    console.log("User ID: ", userId)

    const interviewData = await Interview.findOne({ user_id: userId });

    if (!interviewData) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    console.log("Interview Data: ", interviewData)

    // Select the latest interview attempt
    const latestInterview = interviewData.interviews.reduce((latest, current) => {
      return (latest.attempt_number > current.attempt_number) ? latest : current;
    });

    console.log("Latest Interview Data: ", latestInterview)

    const messages = [
      {
        role: "system",
        content: "Evaluate the interview on communication skills, relevancy, and expertise with scores from 0 to 5 (0.5 increments). Provide concise feedback for each question-answer pair. Output in JSON format.\n"
      },
      {
        role: "user",
        content: "Question: \"What are you looking for in your next job?\"\nAnswer: \"I'm looking for a stress-free job with a good pay and the tasks should be interesting and challenging to me from time-to-time. I heard that you're company is offering a good work-life balance and I look forward to that.\""
      },
      {
        role: "assistant",
        content: "{\n  \"Score\": {\n    \"Communication Skills\": 4.0,\n    \"Relevancy\": 4.5,\n    \"Subject Expertise\": 3.5\n  },\n  \"Feedback\": \"The response is clear and relevant, but could demonstrate more expertise in the subject matter.\"\n}"
      }
    ];

    latestInterview.interview.forEach(({ question, answer }) => {
      console.log("question: ", question)
      console.log("answer: ", answer)
      messages.push({
        role: "user",
        content: `Question: \"${question}\"\nAnswer: \"${answer}\"`
      });
    });

   const response = await openai.chat.completions.create({
     model: "gpt-3.5-turbo-1106",
     messages: messages,
     response_format: { type: "json_object" },
     temperature: 0,
     max_tokens: 256,
     top_p: 1,
     frequency_penalty: 0,
     presence_penalty: 0,
   });

    console.log("Response Choice[0].message.content: ", response.choices[0].message.content)
    console.log("Response Choice[0].message.content: ", response.choices[0].message.content)
    res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error evaluating interview' });
  }
};

const InterviewController = {
    getQuestions,
    postInterview,
    getCurrentCountOfInterviews,
    evaluateInterview
}

module.exports = InterviewController;