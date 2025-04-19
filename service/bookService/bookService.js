const db = require('../../models/index')

const CreateBookAndChapter = async (bookdata, chapters, imageUrl = null) => {
    try {
        // Create the book
        const book = await db.Book.create({
            title: bookdata.title,
            imageUrl: imageUrl
        });

        // Create chapters with the book's ID
        const chapterPromises = chapters.map(chapter => {
            return db.Chapter.create({
                bookId: book.id,
                title: chapter.title,
                content: chapter.content
            });
        });

        await Promise.all(chapterPromises);

        return {
            EM: "Create book successfully",
            DT: {
                book,
                chaptersCount: chapters.length
            }
        };
    } catch (error) {
        console.error("Error in CreateBookAndChapter:", error);
        throw error;
    }
}

const GetBookAllService = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Book.findAndCountAll({
      include: { model: db.Chapter, as: 'chapters' },
      limit: limit,
      offset: offset,
      distinct: true
    });
    console.log(count);
    
    return {
      EM: "Get all books successfully", 
      DT: rows,
      totalCount: count,  // Tổng số sách để kiểm tra có còn trang tiếp theo hay không
      totalPages: Math.ceil(count / limit) // Tổng số trang
    }
  } catch (getBookAllError) {
    throw new Error(getBookAllError)
  }
}

const GetBookOnlyService = async(id) => {
  try {
    const getBookOnly = await db.Book.findOne({ where: { id } ,
      include: { model: db.Chapter, as: 'chapters' }  
    });
    return {
        EM: "get book only successfully",
      DT: getBookOnly
    }
  } catch (getBookOnlyError) {
    throw new Error(getBookOnlyError)
  }
}

const DeleteBookService = async (bookId) => {
  try {
    const deleteBook = await db.Book.destroy({
      where: { id: bookId },
    });
    return {
      EM: "oke",
      DT: deleteBook
    }    
  } catch (deleteBookError) {
    throw new Error(deleteBookError)
  }
}

const UpdateBookService = async (bookId, newTitle) => {
  try {
    const newbook = await db.Book.findOne({
      where: {id: bookId}
    })
    if (!newbook) throw new Error("Not Found Book")

    newbook.title = newTitle
    await newbook.save()

    return {
      ME: "Oke",
      DT: newbook
    }
  } catch (updateBookError) {
    return {
      ME: "Err",
      DT: updateBookError
    }
  }
}

module.exports = { CreateBookAndChapter, GetBookAllService, GetBookOnlyService, DeleteBookService, UpdateBookService }