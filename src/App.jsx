import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, API_URL } from './config';

const socket = io(SOCKET_URL);
const VOTE_OPTIONS = [1, 3, 5, 8, 13];

function App() {
  const [sessionCode, setSessionCode] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [title, setTitle] = useState('Nueva historia');
  const [joined, setJoined] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [sessionState, setSessionState] = useState(null);
  const [currentVote, setCurrentVote] = useState(null);

  useEffect(() => {
    socket.on('session-state', (state) => {
      setSessionState(state);
      const currentParticipant = state.participants.find((p) => p.name === participantName);
      const myVote = state.votes.find((vote) => vote.participantName === participantName);
      if (currentParticipant) {
        setIsOwner(Boolean(currentParticipant.isOwner));
      }
      if (myVote) {
        setCurrentVote(myVote.value);
      }
    });

    socket.on('session-error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('session-state');
      socket.off('session-error');
    };
  }, [participantName]);

  const createSession = () => {
    fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerName, title })
    })
      .then((res) => res.json())
      .then((data) => {
        setSessionCode(data.sessionCode);
        setJoined(true);
        setIsOwner(true);
        socket.emit('join-session', { sessionCode: data.sessionCode, participantName: ownerName, isOwner: true });
      });
  };

  const joinSession = () => {
    setJoined(true);
    setIsOwner(false);
    socket.emit('join-session', { sessionCode, participantName, isOwner: false });
  };

  const handleVote = (value) => {
    setCurrentVote(value);
    socket.emit('cast-vote', { sessionCode, participantName, value });
  };

  const revealVotes = () => {
    socket.emit('reveal-votes', { sessionCode });
  };

  const resetVotes = () => {
    socket.emit('reset-votes', { sessionCode });
    setCurrentVote(null);
  };

  const updateTitle = () => {
    socket.emit('update-title', { sessionCode, title });
  };

  const voteSummary = useMemo(() => {
    if (!sessionState?.votes?.length) return [];
    return VOTE_OPTIONS.map((value) => ({
      value,
      count: sessionState.votes.filter((vote) => vote.value === value).length
    }));
  }, [sessionState]);

  return (
    <div className="app-shell">
      <h1>Planning Poker</h1>

      {!joined ? (
        <div className="panel">
          <h2>Crear o unirse a una sesión</h2>

          <label>
            Nombre del creador
            <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </label>

          <label>
            Título de la historia
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <button onClick={createSession}>Crear sesión</button>

          <hr />

          <label>
            Código de la sesión
            <input value={sessionCode} onChange={(e) => setSessionCode(e.target.value.toUpperCase())} />
          </label>

          <label>
            Tu nombre
            <input value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
          </label>

          <button onClick={joinSession}>Unirse</button>
        </div>
      ) : (
        <div className="panel">
          <div className="session-header">
            <h2>{sessionState?.title || title}</h2>
            <p>Código: {sessionState?.code || sessionCode}</p>
          </div>

          <label>
            Título de la historia
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <button onClick={updateTitle}>Guardar título</button>

          <div className="actions">
            {isOwner && (
              <>
                <button onClick={revealVotes}>Revelar votación</button>
                <button onClick={resetVotes}>Resetear</button>
              </>
            )}
          </div>

          <div className="vote-grid">
            {VOTE_OPTIONS.map((value) => (
              <button
                key={value}
                className={`vote-card ${currentVote === value ? 'selected' : ''}`}
                onClick={() => handleVote(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="participants-list">
            <h3>Participantes</h3>
            {sessionState?.participants?.map((participant) => (
              <div key={participant.id} className="participant-item">
                <span>{participant.name}</span>
                <span>{participant.isOwner ? 'Admin' : 'Participante'}</span>
              </div>
            ))}
          </div>

          <div className="results">
            <h3>Resultados</h3>
            {sessionState?.revealed ? (
              <div className="vote-summary">
                {sessionState?.votes?.map((vote) => (
                  <div key={vote.participantName} className="vote-item">
                    <strong>{vote.participantName}</strong>: {vote.value}
                  </div>
                ))}
              </div>
            ) : (
              <p>La votación está oculta hasta que el administrador la revele.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
