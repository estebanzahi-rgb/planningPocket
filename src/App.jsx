import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, API_URL, APP_VERSION } from './config';

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
  const [errorMessage, setErrorMessage] = useState('');

  const resetSession = (message = 'La sesión no está disponible. Regresa al menú principal.') => {
    setErrorMessage(message);
    setJoined(false);
    setSessionState(null);
    setCurrentVote(null);
    setIsOwner(false);
    setSessionCode('');
    setParticipantName('');
  };

  useEffect(() => {
    socket.on('session-state', (state) => {
      if (state.appVersion && state.appVersion !== APP_VERSION) {
        resetSession('Nueva versión disponible. Refresca la página para usar la última versión.');
        return;
      }

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
      setErrorMessage(message);
      if (message.toLowerCase().includes('sesión no encontrada') && joined) {
        resetSession();
      }
    });

    socket.on('session-ended', () => {
      resetSession();
    });

    socket.on('disconnect', () => {
      if (joined) {
        setErrorMessage('Conexión perdida. Intentando reconectar...');
      }
    });

    socket.on('connect', () => {
      if (joined && sessionCode && participantName) {
        joinSocketSession({ sessionCode, participantName, isOwner });
      }
    });

    return () => {
      socket.off('session-state');
      socket.off('session-error');
      socket.off('session-ended');
      socket.off('disconnect');
      socket.off('connect');
    };
  }, [joined, participantName, sessionCode, isOwner]);

  useEffect(() => {
    if (sessionState?.title && sessionState.title !== title) {
      setTitle(sessionState.title);
    }
  }, [sessionState?.title]);

  const joinSocketSession = ({ sessionCode, participantName, isOwner }) => {
    const doJoin = () => {
      socket.emit('join-session', { sessionCode, participantName, isOwner });
    };

    if (!socket.connected) {
      socket.connect();
      socket.once('connect', doJoin);
    } else {
      doJoin();
    }
  };

  const createSession = () => {
    setErrorMessage('');

    if (!ownerName) {
      setErrorMessage('Debes ingresar el nombre del creador.');
      return;
    }

    fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerName, title })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo crear la sesión');
        }
        return res.json();
      })
      .then((data) => {
        setSessionCode(data.sessionCode);
        setParticipantName(ownerName);
        setJoined(true);
        setIsOwner(true);
        joinSocketSession({ sessionCode: data.sessionCode, participantName: ownerName, isOwner: true });
      })
      .catch(() => {
        setErrorMessage('No se pudo crear la sesión. Intenta de nuevo.');
      });
  };

  const joinSession = () => {
    setErrorMessage('');

    if (!sessionCode || !participantName) {
      setErrorMessage('Debes ingresar el código de sesión y tu nombre.');
      return;
    }

    fetch(`${API_URL}/api/sessions/${sessionCode}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Sesión no encontrada');
        }
        return res.json();
      })
      .then(() => {
        setJoined(true);
        setIsOwner(false);
        socket.emit('join-session', { sessionCode, participantName, isOwner: false });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleVote = (value) => {
    setCurrentVote(value);
  };

  const submitVote = () => {
    setErrorMessage('');
    if (!currentVote) {
      setErrorMessage('Selecciona una opción antes de enviar.');
      return;
    }
    socket.emit('cast-vote', { sessionCode, participantName, value: currentVote });
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

  const leaveSession = () => {
    if (sessionCode) {
      socket.emit('leave-session', { sessionCode, participantName, isOwner });
    }
    setJoined(false);
    setSessionState(null);
    setCurrentVote(null);
    setIsOwner(false);
    setErrorMessage('');
  };

  const hasVoted = useMemo(() => {
    if (!participantName || !sessionState?.votes?.length) return false;
    return sessionState.votes.some((vote) => vote.participantName === participantName);
  }, [participantName, sessionState]);

  const voteSummary = useMemo(() => {
    if (!sessionState?.votes?.length) return [];
    return VOTE_OPTIONS.map((value) => ({
      value,
      count: sessionState.votes.filter((vote) => vote.value === value).length
    }));
  }, [sessionState]);

  const topVoteValues = useMemo(() => {
    if (!voteSummary.length) return [];
    const maxCount = Math.max(...voteSummary.map((item) => item.count));
    if (maxCount === 0) return [];
    return voteSummary
      .filter((item) => item.count === maxCount)
      .map((item) => ({ value: item.value, count: item.count }));
  }, [voteSummary]);

  const connectedCount = sessionState?.participants?.length || 0;
  const votesCount = sessionState?.votes?.length || 0;

  const getInitials = (name) => {
    return name?.substring(0, 2).toUpperCase() || '';
  };

  const voteStatusByParticipant = useMemo(() => {
    if (!sessionState?.participants?.length) return [];
    return sessionState.participants.map((participant) => {
      const vote = sessionState.votes.find((item) => item.participantName === participant.name);
      return {
        ...participant,
        voted: Boolean(vote),
        voteValue: vote?.value ?? null
      };
    });
  }, [sessionState]);

  const voterStatus = useMemo(() => {
    if (!sessionState?.participants?.length) return [];
    return sessionState.participants
      .filter((participant) => !participant.isOwner)
      .map((participant) => {
        const vote = sessionState.votes.find((item) => item.participantName === participant.name);
        return {
          ...participant,
          voted: Boolean(vote),
          voteValue: vote?.value ?? null
        };
      });
  }, [sessionState]);

  return (
    <div className="app-shell">
      <h1>Planning Poker</h1>

      {!joined ? (
        <div className="panel">
          <h2>Crear o unirse a una sesión</h2>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

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

          {isOwner ? (
            <>
              <label>
                Título de la historia
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <button onClick={updateTitle}>Guardar título</button>
            </>
          ) : null}

          <div className="participant-summary">
            <div className="summary-pill">Participants: {connectedCount}</div>
            <div className="summary-pill">Voted: {votesCount}</div>
          </div>

          <div className="participant-bar">
            {voteStatusByParticipant.map((participant) => (
              <div
                key={participant.id}
                className={`participant-chip ${participant.isOwner ? 'admin' : ''} ${participant.voted ? 'voted' : 'pending'}`}
              >
                <span className="participant-avatar">{participant.name.slice(0, 2).toUpperCase()}</span>
                <span className="participant-name">{participant.name}</span>
                {participant.isOwner && <span className="participant-badge">ADM</span>}
                {!participant.isOwner && participant.voted && <span className="participant-check">✓</span>}
              </div>
            ))}
          </div>

          <div className="actions">
            {isOwner && (
              <>
                <button onClick={revealVotes}>Revelar votación</button>
                <button onClick={resetVotes}>Resetear</button>
              </>
            )}
            <button className="secondary" onClick={leaveSession}>Salir</button>
          </div>

          {!isOwner && (
            <>
              <div className="vote-grid">
                {VOTE_OPTIONS.map((value) => (
                  <button
                    key={value}
                    className={`vote-card ${currentVote === value ? 'selected' : ''}`}
                    onClick={() => handleVote(value)}
                    disabled={hasVoted}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <button onClick={submitVote} disabled={!currentVote || hasVoted}>
                {hasVoted ? 'Voto enviado' : 'Enviar votación'}
              </button>
            </>
          )}

          <div className="participants-list">
            <h3>Participantes</h3>
            {sessionState?.participants?.map((participant) => (
              <div key={participant.id} className="participant-item">
                <span>{participant.name}</span>
                <span>{participant.isOwner ? 'Admin' : 'Participante'}</span>
              </div>
            ))}
          </div>

          {isOwner && (
            <div className="vote-status">
              <h3>Estado de votación</h3>
              <div className="vote-status-grid">
                {voterStatus.map((participant) => (
                  <div key={participant.id} className="vote-status-row">
                    <span className={`vote-avatar ${participant.voted ? 'voted' : 'pending'}`}>
                      {getInitials(participant.name)}
                    </span>
                    <div className="vote-status-meta">
                      <span className="vote-status-name">{participant.name}</span>
                      <span className={`vote-status-label ${participant.voted ? 'voted' : 'pending'}`}>
                        {participant.voted ? 'Votó' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results">
            <h3>Resultados</h3>
            {sessionState?.revealed ? (
              <div className="vote-result-groups">
                {voteSummary.filter((group) => group.count > 0).map((group) => (
                  <div key={group.value} className="vote-result-group">
                    <div className="vote-result-label">{group.value}</div>
                    <div className="vote-result-bubbles">
                      {voterStatus
                        .filter((participant) => participant.voteValue === group.value)
                        .map((participant) => (
                          <span
                            key={participant.id}
                            className="vote-result-bubble voted"
                          >
                            {getInitials(participant.name)}
                          </span>
                        ))}
                    </div>
                    <div className="vote-result-count">{group.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>La votación está oculta hasta que el administrador la revele.</p>
            )}
            {sessionState?.revealed && topVoteValues.length > 0 && (
              <div className="top-vote-values">
                <strong>Valor{topVoteValues.length > 1 ? 'es' : ''} más votado{topVoteValues.length > 1 ? 's' : ''}:</strong>
                {topVoteValues.map((item, index) => (
                  <span key={item.value} className="top-vote-value">
                    {item.value} ({item.count}){index < topVoteValues.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
