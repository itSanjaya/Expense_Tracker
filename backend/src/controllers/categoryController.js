import categoryModel from "../models/categoryModel.js";

const fetchCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  const userId = 1;

  try {
    const newCategory = await categoryModel.createCategory(name, userId);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export default {
  fetchCategories,
  addCategory,
};