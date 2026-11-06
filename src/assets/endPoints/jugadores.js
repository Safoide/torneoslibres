import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/jugadores'; // usa REACT_APP_API_URL (necesario al subirlo a un hosting)

// GET

const getJugadores = () => apiGET(API_BASEURL + '/');

const getJugadorById = (playerId) => apiGET(API_BASEURL + '/jugador/' + playerId);

const getJugadoresByTeam = (teamId) => apiGET(API_BASEURL + '/equipo/' + teamId);

const getJugadoresByTournament = (torId) => apiGET(API_BASEURL + '/torneo/' + torId);



// POST

const addPlayer = (newPlayer) => apiPOST(API_BASEURL + '/', newPlayer);


// PUT

const editPlayer = (playerId, modifiedPlayer) => apiPUT(API_BASEURL + '/' + playerId, modifiedPlayer);


// DELETE

const deletePlayer = (playerId) => apiDELETE(API_BASEURL + '/' + playerId);


export { getJugadores, getJugadorById, getJugadoresByTeam, getJugadoresByTournament, addPlayer, editPlayer, deletePlayer };