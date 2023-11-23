const loginForm = document.getElementById('login-form')
const baseEndpoint = "http://localhost:9000/api"
if (loginForm){
    // handle this login form
    loginForm.addEventListener('submit', handleLogin)


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
        console.log(response)
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
}