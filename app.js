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



app.use(cookieParser());
app.use(i18n.init);

// Handlebars
//this function is for create the success form of the translate in the apps
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

//config the engine of handelbars 

const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: getAllPartialsDirs(),
  helpers: {
    t: function (key, options) {
      const lang = this.lang || 'es'; // o de cookie, sesión, etc.
      const translations = options?.data?.root?.translations?.[lang];
      const value = getNestedValue(translations, key);
      return value || `¿${key}?`;
    }
  }
});
app.engine('hbs', hbs.engine);

function getAllPartialsDirs() {
  const dirs = [path.join(__dirname, 'views/partials')]; // globales

  const appsPath = path.join(__dirname, 'apps');
  fs.readdirSync(appsPath).forEach(appFolder => {
    const partialsPath = path.join(appsPath, appFolder, 'views', 'partials');
    if (fs.existsSync(partialsPath)) {
      dirs.push(partialsPath);
    }
  });

  return dirs;
}

/*
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
*/
//her we will get the path of the file public like image, css, js 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/apps', express.static(path.join(__dirname, 'apps')));

//all the file with extension hbs run in our server
const viewsDirs = [path.join(__dirname, 'views')]; //views global
const appsDir = path.join(__dirname, 'apps');

// Recorre todas las apps y añade sus carpetas de vistas
fs.readdirSync(appsDir).forEach(folder => {
  const appViews = path.join(appsDir, folder, 'views');
  if (fs.existsSync(appViews)) {
    viewsDirs.push(appViews);
  }
});
app.set('views', viewsDirs);
app.set('view engine', 'hbs');

//language
app.get('/lang/:locale', (req, res) => {
  res.cookie('lang', req.params.locale);
  res.redirect('back');
});

//we will load all the apps that have in the ERP when help of the function loadApps
let appsList = []; //her save all the apps 
loadApps(app).then(apps => {
  appsList = apps;
  app.locals.apps = appsList; //this is for save the apps in local for not load forever all the apps when load a web
  console.log(`[INIT] ${apps.length} apps loads`);
}).catch(err => {
  console.error('[INIT] Error loads apps:', err);
});


//first web
app.get('/', (req, res) => {
  res.render('home')
});

app.get('/links/home', (req, res) => {
  res.redirect('/')
});







app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
