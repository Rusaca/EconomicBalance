import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';

import configPipeline from './config_server_express/config_pipeline';
import rutasCliente from './config_server_express/config_enrutamiento/endPointsCliente';
import rutasPlantilla from './config_server_express/config_enrutamiento/endPointsPlantilla';
import endPointsTienda from './config_server_express/config_enrutamiento/endPointsTienda';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error SMTP:', error);
  } else {
    console.log('SMTP listo para enviar correos');
  }
});

configPipeline(app);

app.use('/api/cliente', rutasCliente);
app.use('/api/plantillas', rutasPlantilla);
app.use('/api/tienda', endPointsTienda);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
