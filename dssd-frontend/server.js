import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3001; // Puerto donde correrá este servidor proxy

// Configuración de CORS para permitir que tu frontend (en localhost:5173) se comunique
// y envíe/reciba cookies.
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

// Middlewares para parsear el cuerpo de las peticiones
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const BONITA_BASE_URL = 'http://localhost:8080/bonita';

// Ruta "catch-all" que interceptará todas las peticiones a /bonita/*
app.use('/bonita/', async (req, res) => {
  // Construye la URL de destino en el servidor de Bonita
  // req.originalUrl incluye la ruta completa, ej: /bonita/loginservice
  const bonitaUrl = `${BONITA_BASE_URL}${req.originalUrl.replace('/bonita', '')}`;

  console.log(`[Proxy] -> Redirigiendo ${req.method} a ${bonitaUrl}`);

  try {
    const options = {
      method: req.method,
      headers: { ...req.headers },
      redirect: 'manual'
    };

    // Es importante eliminar el 'host' del header original, ya que el destino es otro
    delete options.headers.host;

    // Si la petición no es GET, adjunta el cuerpo
    if (req.method !== 'GET' && Object.keys(req.body).length > 0) {
      // Determina el tipo de contenido para reenviarlo correctamente
      if (req.headers['content-type']?.includes('application/json')) {
        options.body = JSON.stringify(req.body);
      } else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        options.body = new URLSearchParams(req.body).toString();
      } else {
        options.body = req.body; // Para otros tipos
      }
    }

    // Realiza la petición al servidor de Bonita
    const bonitaResponse = await fetch(bonitaUrl, options);

    console.log(bonitaResponse.headers)

    const token = bonitaResponse.headers.get('X-Bonita-API-Token');
    const setCookie = bonitaResponse.headers.get('set-cookie'); // Aquí viene JSESSIONID

    if (token) res.setHeader('X-Bonita-API-Token', token);
    if (setCookie) res.setHeader('Set-Cookie', setCookie);

    // Permitir que el frontend lea esos headers
    res.setHeader('Access-Control-Expose-Headers', 'X-Bonita-API-Token, Set-Cookie');

    // Envía el mismo código de estado que Bonita
    res.status(bonitaResponse.status);

    // Envía el cuerpo de la respuesta de Bonita de vuelta al cliente
    bonitaResponse.body.pipe(res);

  } catch (error) {
    console.error('[Proxy] Error:', error);
    res.status(500).json({ error: 'Error en el servidor proxy', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor proxy de Express escuchando en http://localhost:${PORT}`);
  console.log('Todas las peticiones a /bonita serán redirigidas a Bonita BPM.');
});