import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import configPipeline from './config_server_express/config_pipeline';
import rutasCliente from './config_server_express/config_enrutamiento/endPointsCliente';
import rutasPlantilla from './config_server_express/config_enrutamiento/endPointsPlantilla';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

configPipeline(app);

app.use('/api/cliente', rutasCliente);
app.use('/api/plantillas', rutasPlantilla);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando con MongoDB:', error);
  });