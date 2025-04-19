const { cloudinary } = require('../config/cloudinary.connect')
const fs = require('fs')
const db = require('../models/index')
const { CreateBookAndChapter, GetBookAllService, GetBookOnlyService, DeleteBookService, UpdateBookService } = require("../service/bookService/bookService")

const createBook = async (req, res) => {
  try {
    const { bookdata, chapters } = req.body;
    
    if (!bookdata || !chapters) {
      return res.status(400).json({ message: "Missing required data: bookdata or chapters" });
    }

    if (!Array.isArray(chapters)) {
      return res.status(400).json({ message: "Chapters must be an array" });
    }

    if (typeof bookdata !== 'object' || !bookdata.title) {
      return res.status(400).json({ message: "Invalid bookdata format. Must include title" });
    }

    // Create book and chapters in the database
    const result = await CreateBookAndChapter(bookdata, chapters);
    
    return res.status(200).json({ 
      message: "Book created successfully",
      data: result.DT
    });
  } catch (error) {
    console.error("Error in createBook:", error);
    return res.status(500).json({ message: "Failed to create book", error: error.message });
  }
}

const getBookAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await GetBookAllService(page, limit)
    return res.json({EM: result.EM, DT: result.DT, totalPages: result.totalPages})
  } catch (error) {
    return res.status(500).json({EM: error})
  }
}

const getBookOnly = async (req, res) => {

const id = req.params.id


  try {
    const result = await GetBookOnlyService(id)
    return res.json({
      EM: "oke",
      DT: result
    })
  } catch (error) {
    return res.status(500).json({
      EM: "error",
      DT: error
    })
  }
}

const deleteBook = async (req, res) => {
  console.log(req.params.id); // Debug xem ID nhận đúng chưa
  const bookId = req.params.id; // Lấy đúng param từ URL

  try {
    const result = await DeleteBookService(bookId);
    return res.json({
      EM: result.EM,
      DT: result.DT
    });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  const bookId = req.body.bookId
  const newTitle = req.body.title
  try {
    const processUpdate = await UpdateBookService(bookId, newTitle)
    return res.json({ ME: processUpdate.ME, DT: processUpdate.DT })
  } catch (updateBookError) {
    return res.status(500).json({ ME: "Error", DT: updateBookError })
  }
}

module.exports = { createBook, getBookAll, getBookOnly, deleteBook, updateBook }