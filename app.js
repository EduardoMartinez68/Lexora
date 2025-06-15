const express = require('express');
const exphbs = require('express-handlebars');
const i18n = require('i18n');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// i18n
i18n.configure({
  locales: ['es', 'pl'],
  defaultLocale: 'es',
  cookie: 'lang',
  directory: path.join(__dirname, 'pl'),
  autoReload: true,
  updateFiles: false,
  objectNotation: true
});

app.use(cookieParser());
app.use(i18n.init);

// Configuración de Handlebars con partials
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    t: function (key, options) {
      return i18n.__.call(this, key);
    }
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.get('/lang/:locale', (req, res) => {
  res.cookie('lang', req.params.locale);
  res.redirect('back');
});

app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main',
    title: res.__('home.title'),
    subtitle: res.__('home.subtitle'),
    currentLocale: req.getLocale()
  });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
