const path = require('node:path');

// Importar Variables de Entorno
require('dotenv').config({
    path: path.resolve(__dirname, 'auth.env')
});


module.exports = {
    PUBLIC_KEY: process.env.PUBLIC_KEY.replace(/\\n/g, '\n') || "",
    PRIVATE_KEY: process.env.PRIVATE_KEY.replace(/\\n/g, '\n') || "",
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,
    PSQL_DATABASE: process.env.PSQL_DATABASE || "",
    PSQL_USERNAME: process.env.PSQL_USERNAME || "",
    PSQL_PASSWORD: process.env.PSQL_PASSWORD || "",
    PSQL_HOST: process.env.PSQL_HOST || "localhost",
    PSQL_PORT: process.env.PSQL_PORT || "5432",
}