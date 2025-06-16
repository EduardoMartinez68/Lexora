module.exports = {
  name: "App 1", 
  icon: "/apps/cases/assets/icon.webp", 
  path: "/app1", //this is the link that need use in the web for run the app
  router: require('./routes'), //the path of the routers
  depends: ["cases"], //this is for know that app will load before your app. This is for avoid mistakes in the database if exist relation
  dbInit: true, // if need run the SQL of db.sql (this is for update the database or create table)
  permissionsFile: 'permissions.json'
};