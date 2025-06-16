module.exports = {
  name: "Casos", 
  icon: "/apps/cases/assets/icon.webp", 
  path: "/cases", //this is the link that need use in the web for run the app
  router: require('./routes'), //the path of the routers
  dbInit: true, // if need run the SQL of db.sql (this is for update the database or create table)
  permissionsFile: 'permissions.json'
};