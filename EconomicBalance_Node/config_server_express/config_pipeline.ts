//middleware globales 
import { Application } from 'express';
import express from 'express';
import cors from 'cors';

export default function configPipeline(app: Application): void {
  app.use(cors());
  app.use(express.json());
}