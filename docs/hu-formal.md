# Historias de usuario formales del MVP

## HU-01 - Crear sesión de Planning Poker
**Como** creador de una sesión  
**Quiero** crear una nueva sesión de Planning Poker  
**Para** iniciar una ronda de votación con mi equipo sin necesidad de registro

### Criterios de aceptación
- El sistema debe permitir crear una sesión desde la pantalla inicial.
- La sesión debe generar un código único y compartible.
- El creador debe poder ingresar un nombre y un título de historia.
- La sesión debe quedar disponible para que otros usuarios puedan unirse.

## HU-02 - Unirse a una sesión existente
**Como** participante  
**Quiero** unirme a una sesión usando un código  
**Para** participar en la votación sin crear una cuenta

### Criterios de aceptación
- El sistema debe permitir ingresar un código de sesión existente.
- El usuario debe poder escribir su nombre para identificarse dentro de la sesión.
- El participante debe aparecer en la lista de participantes conectados.

## HU-03 - Votar una historia
**Como** participante  
**Quiero** seleccionar un valor de votación  
**Para** contribuir a la estimación de la historia

### Criterios de aceptación
- El sistema debe mostrar opciones de votación: 1, 3, 5, 8 y 13.
- El participante debe poder seleccionar un valor y registrarlo como su voto.
- El sistema debe permitir cambiar el voto antes de revelar la ronda.

## HU-04 - Revelar votos solo por el administrador
**Como** administrador de la sesión  
**Quiero** revelar los votos de todos los participantes  
**Para** mostrar el resultado de la ronda de manera controlada

### Criterios de aceptación
- Solo el administrador de la sesión debe poder revelar los votos.
- Los votos deben permanecer ocultos hasta que el administrador active la revelación.
- Al revelar, el sistema debe mostrar los valores asignados por todos los participantes.

## HU-05 - Reiniciar la ronda
**Como** administrador de la sesión  
**Quiero** reiniciar la ronda de votación  
**Para** preparar una nueva historia o una nueva vuelta de votación

### Criterios de aceptación
- Solo el administrador debe poder reiniciar la ronda.
- Al reiniciar, los votos anteriores deben limpiarse.
- La sesión debe volver al estado inicial para una nueva votación.

## HU-06 - Editar el título de la historia
**Como** administrador de la sesión  
**Quiero** modificar el título de la historia que se está votando  
**Para** indicar claramente qué elemento se está estimando

### Criterios de aceptación
- El administrador debe poder editar el título desde la interfaz.
- El cambio debe reflejarse para todos los participantes conectados.
- El título debe mostrarse visible en la sala de votación.
