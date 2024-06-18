const Skill = require("../models/Skill");

// Controller function to create a new skill
const createSkill = async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    await newSkill.save();
    console.log("New Skill Added Successfully");
    res.status(201).json({ message: "Skill created successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create skill. Please try again." });
  }
};

// Controller function to get all skills with pagination
const getAllSkills = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query = {
        name: { $regex: regex },
      };
    }
    // Set default values for page and limit
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    // Calculate the skip value based on the page number and limit
    const skip = (pageNumber - 1) * pageSize;

    // Fetch skills from the database based on the search query and pagination
    const skills = search
      ? await Skill.find(query).skip(skip).limit(pageSize)
      : await Skill.find().skip(skip).limit(pageSize);

    // Calculate the total number of skills matching the search query
    const totalSkills = search
      ? await Skill.countDocuments(query)
      : await Skill.countDocuments();

    const totalPages = Math.ceil(totalSkills / pageSize);

    res.json({
      skills,
      pageNumber,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve skills. Please try again." });
  }
};

// Controller function to get a single skill by ID
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (skill) {
      res.json(skill);
    } else {
      res.status(404).json({ message: "Skill not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve skill" });
  }
};

module.exports = { createSkill, getAllSkills, getSkillById };
