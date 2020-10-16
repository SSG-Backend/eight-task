function getRequest(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = () => {
        console.log(request);
        if (request.status === 200) {
            console.log(JSON.parse(request.response));
        }
        else {
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
}

function postRequest(url, data) {
    let request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(data, null, 2));
    request.onload = () => {
        console.log(request);
        if (request.status === 200) {
            console.log(JSON.parse(request.response));
        }
        else {
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
}

function putRequest(url, data) {
    let request = new XMLHttpRequest();
    request.open("PUT", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(data, null, 2));
    request.onload = () => {
        console.log(request);
        if (request.status === 200) {
            console.log(JSON.parse(request.response));
        }
        else {
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
}

function deleteRequest(url) {
    let request = new XMLHttpRequest();
    request.open("DELETE", url, true);
    request.send();
    request.onload = () => {
        console.log(request);
        if (request.status === 200) {
            console.log(JSON.parse(request.response));
        }
        else {
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
}


