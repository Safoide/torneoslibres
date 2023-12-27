import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

const API_BASEURL = 'http://localhost:4000/partidos';

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