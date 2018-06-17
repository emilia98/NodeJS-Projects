const bodyParser = require('body-parser');

const db = require('./config/dbConfig');
const Book = require('./models/Book');
const Author = require('./models/Author');

db.then(() => {
  console.log('Connected to DB...');

  let router = require('./controllers/books-controller');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing 

  app.use('/', router);

  app.get('/', (req, res) => {
    Book
      .find({})
      .then(books => {
        res.render('home', {
          booksCount: books.length
        });
      })
      .catch(err => {
        res.render('error', {
          error: err
        });
      });
  });

  app.get('/add/book', (req, res) => {
    res.render('create-book');
  });

  app.get('/edit/book/:id', (req, res) => {
    let id = req.params.id;

    updateBook();
    async function updateBook () {
      let book = await Book.findById(id);

      let authors = await Author.where('_id').in(book.authors);
      authors = authors.map(el => el.name);

      let loadedBook = {
        authors: authors.join(', '),
        title: book.title,
        year: book.releaseYear,
        id: book._id
      };

      res.render('update-book', {
        book: loadedBook
      });
    }
  });

  app.get('/viewAll', (req, res) => {
    console.log(req.body);
  });
});