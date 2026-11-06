import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/partidos'; // usa REACT_APP_API_URL (necesario al subirlo a un hosting)

// GET

const getPartidos = () => apiGET(API_BASEURL + '/');

const getPartidoById = (matchId) => apiGET(API_BASEURL + '/partido/' + matchId);

const getPartidosByTeam = (teamId) => apiGET(API_BASEURL + '/equipo/' + teamId);

const getPartidosByTournament = (torId) => apiGET(API_BASEURL + '/torneo/' + torId);



// POST

const addMatch = (newMatch) => apiPOST(API_BASEURL + '/', newMatch);


// PUT

const editMatch = (matchId, modifiedMatch) => apiPUT(API_BASEURL + '/' + matchId, modifiedMatch);


// DELETE

const deleteMatch = (matchId) => apiDELETE(API_BASEURL + '/' + matchId);


export { getPartidos, getPartidoById, getPartidosByTeam, getPartidosByTournament, addMatch, editMatch, deleteMatch };