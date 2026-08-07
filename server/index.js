import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const APP_VERSION = process.env.APP_VERSION || pkg.version || '1.0.0';

app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: APP_VERSION });
});

app.get('/api/version', (_req, res) => {
  res.json({ version: APP_VERSION });
});
app.use(express.static(path.join(__dirname, '..', 'dist')));

const sessions = new Map();
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

function createSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function expireSession(sessionCode) {
  const session = sessions.get(sessionCode);
  if (!session) return;
  io.to(sessionCode).emit('session-ended');
  sessions.delete(sessionCode);
}

function getSession(sessionCode) {
  const session = sessions.get(sessionCode);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    expireSession(sessionCode);
    return null;
  }
  return session;
}

function createSessionData(sessionCode, ownerName, title) {
  return {
    code: sessionCode,
    title: title || 'Nueva historia',
    ownerName,
    revealed: false,
    participants: [],
    votes: [],
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS
  };
}

function emitSessionState(socket, sessionCode) {
  const session = getSession(sessionCode);
  if (!session) return;

  io.to(sessionCode).emit('session-state', {
    code: session.code,
    title: session.title,
    ownerName: session.ownerName,
    revealed: session.revealed,
    participants: session.participants,
    votes: session.votes,
    appVersion: APP_VERSION
  });
}

app.post('/api/sessions', (req, res) => {
  const { ownerName, title } = req.body;
  const sessionCode = createSessionCode();
  const session = createSessionData(sessionCode, ownerName, title);
  sessions.set(sessionCode, session);
  res.json({ sessionCode, session });
});

app.get('/api/sessions/:code', (req, res) => {
  const session = getSession(req.params.code);
  if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
  res.json(session);
});

io.on('connection', (socket) => {
  socket.on('join-session', ({ sessionCode, participantName, isOwner }) => {
    const session = getSession(sessionCode);
    if (!session) {
      socket.emit('session-error', { message: 'Sesión no encontrada' });
      return;
    }

    socket.join(sessionCode);

    const participant = {
      id: socket.id,
      name: participantName,
      isOwner: Boolean(isOwner)
    };

    const existingIndex = session.participants.findIndex((p) => p.id === socket.id);
    if (existingIndex >= 0) {
      session.participants[existingIndex] = participant;
    } else {
      session.participants.push(participant);
    }

    if (isOwner) {
      session.ownerName = participantName;
    }

    emitSessionState(socket, sessionCode);
  });

  socket.on('update-title', ({ sessionCode, title }) => {
    const session = getSession(sessionCode);
    if (!session) return;
    session.title = title;
    emitSessionState(socket, sessionCode);
  });

  socket.on('leave-session', ({ sessionCode, participantName, isOwner }) => {
    const session = getSession(sessionCode);
    if (!session) {
      socket.emit('session-error', { message: 'Sesión no encontrada' });
      return;
    }

    const remaining = session.participants.filter((p) => p.id !== socket.id && p.name !== participantName);
    const ownerLeft = isOwner || session.ownerName === participantName;

    if (ownerLeft && remaining.length > 0) {
      const newOwner = remaining[0];
      newOwner.isOwner = true;
      session.ownerName = newOwner.name;
      session.participants = remaining;
      emitSessionState(socket, sessionCode);
      return;
    }

    if (ownerLeft && remaining.length === 0) {
      expireSession(sessionCode);
      return;
    }

    if (remaining.length !== session.participants.length) {
      session.participants = remaining;
      emitSessionState(socket, sessionCode);
    }
  });

  socket.on('cast-vote', ({ sessionCode, participantName, value }) => {
    const session = getSession(sessionCode);
    if (!session) return;

    const existing = session.votes.find((vote) => vote.participantName === participantName);
    if (existing) {
      existing.value = value;
    } else {
      session.votes.push({ participantName, value });
    }

    emitSessionState(socket, sessionCode);
  });

  socket.on('reveal-votes', ({ sessionCode }) => {
    const session = getSession(sessionCode);
    if (!session) return;
    session.revealed = true;
    emitSessionState(socket, sessionCode);
  });

  socket.on('reset-votes', ({ sessionCode }) => {
    const session = getSession(sessionCode);
    if (!session) return;
    session.votes = [];
    session.revealed = false;
    emitSessionState(socket, sessionCode);
  });

  socket.on('disconnect', () => {
    for (const [sessionCode, session] of sessions.entries()) {
      const remaining = session.participants.filter((p) => p.id !== socket.id);
      if (remaining.length !== session.participants.length) {
        session.participants = remaining;
        emitSessionState(socket, sessionCode);
      }
    }
  });
});

setInterval(() => {
  for (const sessionCode of Array.from(sessions.keys())) {
    getSession(sessionCode);
  }
}, 60 * 1000);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});
