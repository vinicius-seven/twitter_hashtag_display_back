import express from 'express';
import cors from 'cors';

// @ts-ignore
import { router } from './routers/routers.ts';
/**
 * Cria o app
 */

export const app = express();
/**
 * Configuração dos middlewares
 */
app.use(express.json());
app.use(cors());

/**
 * Integra o endpoint na aplicação
 */
app.use('/', router);
