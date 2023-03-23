const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (res, h) => {
  const id = nanoid(16);
  if (!res.payload.hasOwnProperty('name')) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  const { name, author, summary, publisher, year, pageCount, readPage, reading } = res.payload;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }
  const newPost = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newPost);
  const success = books.find((x) => x.id === id);

  if (success) {
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }
};

const getAllBooks = (res, h) => {
  const { reading, finished, name } = res.query;
  let bookFilter;
  if (reading) {
    if (parseInt(reading) > 0) {
      bookFilter = books.map((book) => {
        if (book.reading) {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        }
      });
      bookFilter = bookFilter.filter((x) => x !== undefined);
    } else {
      bookFilter = books.map((book) => {
        if (!book.reading) {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        }
      });
      bookFilter = bookFilter.filter((x) => x !== undefined);
    }
  } else if (finished) {
    if (parseInt(finished) > 0) {
      bookFilter = books.map((book) => {
        if (book.finished) {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        }
      });
      bookFilter = bookFilter.filter((x) => x !== undefined);
    } else {
      bookFilter = books.map((book) => {
        if (!book.finished) {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        }
      });
      bookFilter = bookFilter.filter((x) => x !== undefined);
    }
  } else if (name) {
    bookFilter = books.map((book) => {
      if (book.name.toLowerCase().includes(name.toLowerCase())) {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      }
    });
    bookFilter = bookFilter.filter((x) => x !== undefined);
  } else {
    bookFilter = books.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
    });
  }
  return h
    .response({
      status: 'success',
      data: {
        books: books.length > 0 ? bookFilter : [],
      },
    })
    .code(200);
};

const getBookById = (res, h) => {
  const { bookId } = res.params;
  const book = books.find((x) => x.id === bookId);
  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }
  return h.response({
    status: 'success',
    data: {
      book,
    },
  });
};

const updateBookById = (res, h) => {
  const { bookId } = res.params;
  if (!res.payload.hasOwnProperty('name')) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }
  const { name, author, summary, publisher, year, pageCount, readPage, reading, insertedAt } = res.payload;
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }
  const bookIndex = books.findIndex((x) => x.id === bookId);
  if (bookIndex === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }
  const newPost = {
    ...books[bookIndex],
    id: bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: readPage === pageCount,
    reading,
    updatedAt: new Date().toISOString(),
  };
  books[bookIndex] = newPost;
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200);
};

const deleteBookById = (res, h) => {
  const { bookId } = res.params;

  const bookIndex = books.findIndex((x) => x.id === bookId);
  if (bookIndex > -1) {
    books.splice(bookIndex, 1);
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  }
  return h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
};

module.exports = { deleteBookById, updateBookById, addBook, getAllBooks, getBookById };
