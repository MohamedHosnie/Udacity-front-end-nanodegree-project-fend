/* Global Variables */
const weatherAPIkey = '4fa658992774fce1e521c7905113eeb6';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const getInputValue = (id) => {
    return document.getElementById(id).value;
};
const setElementValue = (id, value) => {
    document.getElementById(id).innerHTML = value;
    return;
};

// Event listener to add function to existing HTML DOM element
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('generate').addEventListener('click', handleGenerateButtonClick);
});

/* Function called by event listener */
const handleGenerateButtonClick = (e) => {
    let zip = getInputValue('zip');
    let feelings = getInputValue('feelings');

    getData('https://api.openweathermap.org/data/2.5/weather', {
        zip: zip,
        appid: weatherAPIkey
    }).then((result) => {
        const temp = result.main.temp;
        postData('/add', {
            date: newDate,
            temp: temp,
            content: feelings
        });
    }).then(getProjectData);
};

/* Function to GET Web API Data*/
const getData = async (url = '', query = {}) => {
    let url_query = url;
    if(JSON.stringify(query) != JSON.stringify({})) {
        url_query += '?';
        for(const property in query) {
            url_query += `${property}=${query[property]}&`;
        }
    }
    const response = await fetch(url_query, {
        method: 'GET',
        credentials: 'same-origin'
    });

    try {
        const allData = await response.json();
        if(allData.cod && allData.cod == 404) throw allData.message;
        return allData;
    } catch (error) {
        console.error(error);
        alert(`An error happened while sending data to: ${url}\n\nerror: ${error}`);
    }
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        if(newData.cod && newData.cod == 404) throw newData.message;
        return newData;
    } catch (error) {
        console.error(error);
        alert(`An error happened while sending data to: ${url}\n\nerror: ${error}`);
    }
}

/* Function to GET Project Data */
const getProjectData = () => {
    getData('/recent').then((result) => {
        setElementValue('date', result.date);
        setElementValue('temp', result.temp);
        setElementValue('content', result.content);
    });
};

