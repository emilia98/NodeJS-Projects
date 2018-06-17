### Set up **static files**
```
const publicFilesPath = path.normalize(
  path.join(__dirname, '/public')
);
app.use('/public', express.static(publicFilesPath));
```

### Set up **view engine**
```
app.engine('.hbs', hbs({
  extname: '.hbs',
  partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');
```