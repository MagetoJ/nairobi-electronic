import { Handler } from '@netlify/functions';
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { registerRoutes } from '../../server/routes';

const app = express();

// Security and performance middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes
registerRoutes(app);

// Create serverless handler
const serverlessApp = serverless(app);

export const handler: Handler = async (event, context) => {
  const result = await serverlessApp(event, context);
  return result as any;
};