const contentContainer = document.getElementById('content-container')
const loginForm = document.getElementById('login-form')
const searchForm = document.getElementById('search-form')

const baseEndpoint = "http://localhost:9000/api"
if (loginForm){
    // handle this login form
    loginForm.addEventListener('submit', handleLogin)
} 

if (searchForm){
    searchForm.addEventListener('submit', handleSearch)
} 

function handleLogin(event){
    console.log(event);
    event.preventDefault()
    const loginEndpoint = `${baseEndpoint}/token/`
    let loginFormData = new FormData(loginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let bodyStr = JSON.stringify(loginObjectData);
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": bodyStr
    }
    fetch(loginEndpoint, options)
    .then(response => {
        return response.json()
    })
    .then(authData => {
        handleAuthData(authData, getProductList)

    })
    .catch(err => {
        console.log(err)
    })
}

function handleSearch(event){
    console.log(event);
    event.preventDefault()

    let formData = new FormData(searchForm)
    let data = Object.fromEntries(formData)
    let searchParams = new URLSearchParams(data)
    const endpoint = `${baseEndpoint}/search/?${searchParams}`
    const headers = {
        "Content-Type": "application/json",
    }
    const authToken = localStorage.getItem('access')
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }
    const options = {
        "method": "GET",
        "headers": headers,
    }
    fetch(endpoint, options)
    .then(response => {
        return response.json()
    })
    .then(data => {
        const validData = isTokenNotValid(data)
        if (validData && contentContainer){
            contentContainer.innerHTML = ""
            if (data && data.hits){
                let htmlStr = ""
                for (let result of data.hits){
                    htmlStr += "<li>" + result.title + "</li>"
                }
                contentContainer.innerHTML = htmlStr
                if (data.hits.length === 0) {
                    contentContainer.innerHTML = "<p>No results found</p>"
                }
            } else {
                contentContainer = "<p>No results found</p>"
            }
        }

        // writeToContainer(data)

    })
    .catch(err => {
        console.log(err)
    })
}

function handleAuthData(authData, callback){
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)

    if (callback){
        callback()
    }
}

function writeToContainer(data){
    if (contentContainer){
        contentContainer.innerHTML = "<pre>" + JSON.stringify(data, null, 4) + "</pre>"
    }
}

function getFetchOptions(method, body){
    return {
        method : "GET" === null ? "GET" : method,
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        body: body ? body : null
    }
}

function validateJWTToken() {
    const endpoint = `${baseEndpoint}/token/verify/`
    const options = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({token : localStorage.getItem('access')})
    }

    fetch(endpoint, options)
    .then(response => {
        console.log(response)
        response.json()
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
}

function refresh_token(){
    const endpoint = `${baseEndpoint}/token/refresh/`
    const options = {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({refresh : localStorage.getItem('refresh')})
    }
    fetch(endpoint, options)
    .then(response => {
        console.log(response);
        return response.json()
    })
    .then(data => {
        console.log("refresh:", data);
        handleRefreshData(data, getProductList)
    })
    .catch(error => {
        console.log(error);
    })
}

function handleRefreshData(jsonData, callback){
    localStorage.setItem('access', jsonData.access)

    if (callback){
        callback()
    }
}


function isTokenNotValid(jsonData){
    if (jsonData?.code && jsonData?.code === "token_not_valid"){
        // run a refresh token fetch
        // refresh_token();
        alert("Please login again")
        return false
    } 
    return true
}

function getProductList(){
    const endpoint = `${baseEndpoint}/products/`
    const options = getFetchOptions()

    fetch(endpoint, options)
    .then(response => {
        console.log(response)
        return response.json()
    })
    .then(data => {
        const validData = isTokenNotValid(data)
        if (validData){
            writeToContainer(data)
        }
    })
    .catch(err => {
        console.log(err)
    })
}

validateJWTToken()
// getProductList()

const searchClient = algoliasearch('3LMA4HS51R', 'f1c09350e3015218ddeb518a41808263');

const search = instantsearch({
  indexName: 'jc_Product',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.clearRefinements({
    container: "#clear-refinements",
  }),

  instantsearch.widgets.refinementList({
    container: "#user-list",
    attribute: 'user',
  }),

  instantsearch.widgets.refinementList({
    container: "#public-list",
    attribute: 'public',
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
        item: `
        <div>
            <div>{{#helpers.highlight}}{ "attribute" : "title" }{{/helpers.highlight}}</div>
            <div>{{#helpers.highlight}}{ "attribute" : "body" }{{/helpers.highlight}}</div>
            <p>{{ user }}</p> <p>\${{ price }}</p>
        </div>`
    }
  })
]);

search.start();


