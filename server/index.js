import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

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

app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.use(express.static(path.join(__dirname, '..', 'dist')));

const sessions = new Map();

function createSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getSession(sessionCode) {
  return sessions.get(sessionCode);
}

function createSessionData(sessionCode, ownerName, title) {
  return {
    code: sessionCode,
    title: title || 'Nueva historia',
    ownerName,
    revealed: false,
    participants: [],
    votes: []
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
    votes: session.votes
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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});
