// core/loadApps.js
const fs = require('fs');
const path = require('path');
const db = require('./db');
const i18n = require('i18n');


function ordenarAppsPorDependencias(appConfigs) {
    const orden = [];
    const visitados = new Set();
    const temporal = new Set();

    function visitar(appId) {
        if (temporal.has(appId)) {
            throw new Error(`Dependencia circular detectada: ${appId}`);
        }

        if (!visitados.has(appId)) {
            temporal.add(appId);

            const app = appConfigs.find(a => a.id === appId);
            if (!app) {
                throw new Error(`La app "${appId}" no fue encontrada entre las carpetas disponibles.`);
            }

            for (const dep of app.depends || []) {
                visitar(dep.toLowerCase()); // por si escribieron 'Productos' en lugar de 'productos'
            }

            temporal.delete(appId);
            visitados.add(appId);
            orden.push(app);
        }
    }

    for (const app of appConfigs) {
        visitar(app.id);
    }

    return orden;
}


async function loadApps(app, appsDir = path.join(__dirname, '../apps')) {
    const appList = []; //her we will save all the data of the apps
    //--this is for load the files global of languages
    const combinedTranslations = {};
    const mainLocalesDir = path.join(__dirname, '../locales'); // locales raíz del proyecto

    //we going to if exist the folder of the languages 
    if (fs.existsSync(mainLocalesDir)) {
        //read all the file that exist in the locales folder that is the folder where save the languages
        for (const localeFile of fs.readdirSync(mainLocalesDir)) {
            const localeName = path.basename(localeFile, '.json'); // 'es', 'pl', etc.
            const fullPath = path.join(mainLocalesDir, localeFile);
            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

            //save the struct of the languages
            if (!combinedTranslations[localeName]) combinedTranslations[localeName] = {};
            Object.assign(combinedTranslations[localeName], data);
        }
    }

    //get all the apps in my folder apps of my ERP 
    const folders = fs.readdirSync(appsDir);

    // frist 1: load all the config todas of my apps
    const allAppConfigs = []; //her will save all the information of the config

    //read all the folders in my apps folder 
    for (const folder of folders) {
        const appPath = path.join(appsDir, folder);
        const configPath = path.join(appPath, 'app.config.js');

        //we will see if exist the file config for after read and save his information
        if (fs.existsSync(configPath)) {
            const config = require(configPath);
            config.folder = folder; // this is for have reference to other apps
            config.fullPath = appPath;
            config.id = folder.toLowerCase();
            allAppConfigs.push(config);
        }
    }

    // Step 2: Sort by dependencies
    const orderedApps = ordenarAppsPorDependencias(allAppConfigs);

    // Step 3: run all the apps in his order success for avoid errors when creating the database
    for (const config of orderedApps) {
        const folder = config.folder;
        const appPath = config.fullPath;

        //----------------paths----------------------
        if (config.router && config.path) {
            app.use(config.path, config.router);
        }

        //----------------SQL--------------------------------
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

        //----------------Permisos----------------
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

        //----------------Traducciones----------------
        const localesPath = path.join(appPath, 'locales');
        if (fs.existsSync(localesPath)) {
            for (const localeFile of fs.readdirSync(localesPath)) {
                const localeName = path.basename(localeFile, '.json');
                const fullPath = path.join(localesPath, localeFile);
                const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

                if (!combinedTranslations[localeName]) combinedTranslations[localeName] = {};
                Object.assign(combinedTranslations[localeName], data);
            }
        }

        //----------------save the information apps----------------
        appList.push({
            name: config.name,
            icon: config.icon,
            path: config.path
        });
    }


    app.locals.translations = combinedTranslations; //save the information in the memory of the server
    return appList;
}


async function loadApps2(app, appsDir = path.join(__dirname, '../apps')) {
    const appList = []; //her we will save all the data of the apps
    const allAppConfigs = []; //her save all the config 

    //--this is for load the files global of languace
    const combinedTranslations = {};
    const mainLocalesDir = path.join(__dirname, '../locales'); // locales raíz del proyecto

    if (fs.existsSync(mainLocalesDir)) {
        for (const localeFile of fs.readdirSync(mainLocalesDir)) {
            const localeName = path.basename(localeFile, '.json'); // 'es', 'pl', etc.
            const fullPath = path.join(mainLocalesDir, localeFile);
            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

            if (!combinedTranslations[localeName]) combinedTranslations[localeName] = {};
            Object.assign(combinedTranslations[localeName], data);
        }
    }

    //get all the apps in my folder apps of my ERP 
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
                    const localeName = path.basename(localeFile, '.json'); // 'es', 'en', etc.
                    const fullPath = path.join(localesPath, localeFile);
                    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

                    if (!combinedTranslations[localeName]) combinedTranslations[localeName] = {};
                    Object.assign(combinedTranslations[localeName], data); // fusiona traducciones
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

    // step 2: Ordenar según dependencias
    const orderedApps = ordenarAppsPorDependencias(allAppConfigs);

    //hwe we will update i18n with the translate
    app.locals.translations = combinedTranslations;
    return appList;
}

module.exports = loadApps;
