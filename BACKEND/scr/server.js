require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const router = require('../scr/routes/routes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});