// core/loadApps.js
const fs = require('fs');
const path = require('path');
const db = require('./db');
const i18n = require('i18n');

async function loadApps(app, appsDir = path.join(__dirname, '../apps')) {
    const appList = [];
    const combinedTranslations = {};
    const folders = fs.readdirSync(appsDir);

    //her we will read all the folder of the app
    for (const folder of folders) {
        const appPath = path.join(appsDir, folder);
        const configPath = path.join(appPath, 'app.config.js');


        //we will see if exist the config file. If not exist, so the folder not is an app
        if (fs.existsSync(configPath)) {
            const config = require(configPath);

            // save the path of the apps
            if (config.router && config.path) {
                app.use(config.path, config.router);
            }

            // run the SQL
            if (config.dbInit) {
                const sqlPath = path.join(appPath, 'db.sql');
                if (fs.existsSync(sqlPath)) {
                    const sql = fs.readFileSync(sqlPath, 'utf8');
                    try {
                        await db.query(sql);
                        console.log(`[DB] ${folder}/db.sql ejecutado`);
                    } catch (err) {
                        console.error(`[DB] Error en ${folder}/db.sql`, err.message);
                    }
                }
            }

            //save all the permits of the apps
            if (config.permissionsFile) {
                const permPath = path.join(appPath, config.permissionsFile);
                if (fs.existsSync(permPath)) {
                    const permissions = JSON.parse(fs.readFileSync(permPath, 'utf8'));
                    for (const p of permissions) {
                        await db.query(`
              INSERT INTO permisos (clave, descripcion)
              VALUES ($1, $2)
              ON CONFLICT (clave) DO NOTHING
            `, [p.name, p.description]);
                    }
                    console.log(`[PERMISOS] ${folder} cargados`);
                }
            }


            // load all the translations for tha app
            const localesPath = path.join(appPath, 'locales');
            if (fs.existsSync(localesPath)) {
                for (const localeFile of fs.readdirSync(localesPath)) {
                    const localeName = path.basename(localeFile, '.json'); // 'es', 'pl', etc.
                    const fullPath = path.join(localesPath, localeFile);
                    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

                    if (!combinedTranslations[localeName]) combinedTranslations[localeName] = {};
                    Object.assign(combinedTranslations[localeName], data);
                }
            }


            //save the apps in the local memory in a array
            appList.push({
                name: config.name,
                icon: config.icon,
                path: config.path
            });
        }
    }

    return appList;
}

module.exports = loadApps;
