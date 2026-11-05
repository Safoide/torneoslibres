const authHeaders = () => {
    let token = null;
    try { token = localStorage.getItem('token'); } catch {}

    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const request = async (method, url, body) => {
    try {
        const response = await fetch(url, {
            method,
            headers: authHeaders(),
            ...(body !== undefined && { body: JSON.stringify(body) }),
        });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

// Sube un archivo (multipart). No se pone Content-Type: el navegador lo arma solo
const apiUpload = async (url, campo, archivo) => {
    try {
        let token = null;
        try { token = localStorage.getItem('token'); } catch {}

        const body = new FormData();
        body.append(campo, archivo);

        const response = await fetch(url, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

const apiGET = (url) => request('GET', url);
const apiPOST = (url, body) => request('POST', url, body);
const apiPUT = (url, body) => request('PUT', url, body);
const apiDELETE = (url, body) => request('DELETE', url, body);

export { apiGET, apiPOST, apiPUT, apiDELETE, apiUpload };
