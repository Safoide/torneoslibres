const apiGET = async (url) => {
    try {
        let response = await fetch(url, { 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            method: 'GET'
        })

        let data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

const apiPOST = async (url, body) => {

    try {
        let response = await fetch(url, { 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            method: 'POST',
            body: JSON.stringify(body),
        })
    
        let data = await response.json();
    
        return data;
    } catch (error) {
        console.error(error);
    }
}

const apiPUT = async (url, body) => {

    try {
        let response = await fetch(url, { 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            method: 'PUT',
            body: JSON.stringify(body),
        })
    
        let data = await response.json();
    
        return data;
    } catch (error) {
        console.error(error);
    }
}

const apiDELETE = async (url) => {
    try {
        let response = await fetch(url, {
            eaders: { 
                'Content-Type': 'application/json' 
            }, 
            method: 'DELETE',
        })

        let data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}


export { apiGET, apiPOST, apiPUT, apiDELETE };