//this is for config the app
const express = require('express');
const exphbs = require('express-handlebars');
const i18n = require('i18n');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const cookieParser = require('cookie-parser');
const loadApps = require('./core/loadApps');

const app = express();

//----------------database--------------------//
/*
  her we will load the first version of the database for load all the 
  table, schema, information that need the ERP for can run and that the apps
  can create his table and permits
*/
const db = require('./core/db');
async function initDatabase() {
  const sqlPath = path.join(__dirname, 'database.sql');

  try {
    //we will see if exist the file
    await fsp.access(sqlPath); // show a error if not exit
    const sql = await fsp.readFile(sqlPath, 'utf8');

    await db.query(sql);
    console.log('[DB] The database was created');
  } catch (err) {
    console.error('[DB] The database was not created:', err.message);
  }
}

//run the function
initDatabase();


// i18n (this is for translate the app when the user have a language)
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

// Handlebars
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

//her we will get the path of the file public like image, css, js 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/apps', express.static(path.join(__dirname, 'apps')));

//all the file with extension hbs run in our server
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//language
app.get('/lang/:locale', (req, res) => {
  res.cookie('lang', req.params.locale);
  res.redirect('back');
});

//we will load all the apps that have in the ERP when help of the function loadApps
let appsList = []; //her save all the apps 
loadApps(app).then(apps => {
  appsList = apps;
  console.log(`[INIT] ${apps.length} apps loads`);
}).catch(err => {
  console.error('[INIT] Error loads apps:', err);
});



app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main',
    title: res.__('home.title'),
    subtitle: res.__('home.subtitle'),
    apps: appsList,
    currentLocale: req.getLocale()
  });
});








app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
