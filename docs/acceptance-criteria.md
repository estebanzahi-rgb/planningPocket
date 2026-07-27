# Criterios de aceptación del MVP

## HU1 - Crear sesión
### Criterios de aceptación
- El usuario puede crear una sesión desde la pantalla inicial.
- El sistema genera un código de sesión único.
- La sesión queda disponible para que otros usuarios se unan.

## HU2 - Unirse a sesión
### Criterios de aceptación
- El usuario puede ingresar un código de sesión existente.
- El sistema permite entrar con un nombre de participante.
- El participante aparece en la lista de participantes.

## HU3 - Votar
### Criterios de aceptación
- El participante puede seleccionar un valor de votación entre 1, 3, 5, 8 y 13.
- El voto queda registrado en la sesión.
- El participante puede modificar su voto antes de revelar la ronda.

## HU4 - Revelar votos
### Criterios de aceptación
- Solo el administrador de la sesión puede revelar los votos.
- Al revelar, los participantes ven los valores asignados.
- El estado de la sesión cambia a "revelado".

## HU5 - Reiniciar ronda
### Criterios de aceptación
- Solo el administrador puede resetear la ronda.
- Al reiniciar, los votos se limpian y la ronda vuelve a estado inicial.

## HU6 - Editar título de la historia
### Criterios de aceptación
- El administrador puede modificar el título visible de la historia.
- El cambio se refleja para todos los participantes conectados.
