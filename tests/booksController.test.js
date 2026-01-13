const BooksController = require('../src/controllers/booksController');
const Book = require('../src/models/book');

// Mock the Book model
jest.mock('../src/models/book');

// Ensure all functions are Jest mocks
Book.create = jest.fn();
Book.findByPk = jest.fn();
Book.findAll = jest.fn();

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.attachment = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('BooksController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    BooksController.invalidateCache();
  });

  test('addBook - success', async () => {
    const req = { body: { title: 'Test Book', author: 'Author', isbn: '123', available_quantity: 5, shelf_location: 'A1' } };
    const res = mockRes();

    Book.create.mockResolvedValue({ id: 1, ...req.body });

    await BooksController.addBook(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      book: { id: 1, ...req.body }
    });
  });

  test('addBook - failure', async () => {
    const req = { body: { title: '', author: '', isbn: '' } };
    const res = mockRes();

    const error = new Error('Create failed');
    Book.create.mockRejectedValue(error);

    await BooksController.addBook(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Book addition failed: Create failed'
    }));
  });

  test('updateBook - success', async () => {
    const req = { params: { id: 1 }, body: { title: 'Updated Book' } };
    const res = mockRes();

    const bookInstance = { update: jest.fn().mockResolvedValue(true) };
    Book.findByPk.mockResolvedValue(bookInstance);

    await BooksController.updateBook(req, res, mockNext);

    expect(bookInstance.update).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({ success: true, book: bookInstance });
  });

  test('updateBook - not found', async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = mockRes();

    Book.findByPk.mockResolvedValue(null);

    await BooksController.updateBook(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Book not found' });
  });

  test('deleteBook - success', async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    const bookInstance = { destroy: jest.fn().mockResolvedValue(true) };
    Book.findByPk.mockResolvedValue(bookInstance);

    await BooksController.deleteBook(req, res, mockNext);

    expect(bookInstance.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('deleteBook - not found', async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    Book.findByPk.mockResolvedValue(null);

    await BooksController.deleteBook(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Book not found' });
  });

  test('listBooks - success', async () => {
    const req = {};
    const res = mockRes();

    const booksArray = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
    Book.findAll.mockResolvedValue(booksArray);

    await BooksController.listBooks(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({ success: true, books: booksArray });
  });

  test('listBooks - failure', async () => {
    const req = {};
    const res = mockRes();
    const localNext = jest.fn();

    Book.findAll.mockRejectedValue(new Error('FindAll failed'));

    await BooksController.listBooks(req, res, localNext);
    expect(localNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Listing books failed: FindAll failed'
      })
    );
  });

  // Fixed searchBooks test: no direct cache access
  test('searchBooks - success with results', async () => {
    const req = { query: { query: 'Book' } };
    const res1 = mockRes();
    const res2 = mockRes();

    const searchResults = [
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' },
    ];

    Book.findAll.mockResolvedValue(searchResults);

    await BooksController.searchBooks(req, res1, mockNext);
    await BooksController.searchBooks(req, res2, mockNext);
  
    expect(res2.json).toHaveBeenCalledWith({ success: true, books: searchResults });
    expect(Book.findAll).toHaveBeenCalledTimes(1);
  });

  test('searchBooks - failure', async () => {
    const req = { query: { query: 'Book' } };
    const res = mockRes();

    Book.findAll.mockRejectedValue(new Error('FindAll failed'));

    await BooksController.searchBooks(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Book search failed: FindAll failed'
      })
    );
  });

});
