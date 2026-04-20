import { Application } from 'express';
import express from 'express';
import cors from 'cors';

export default function configPipeline(app: Application): void {
  app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(express.json());
}
