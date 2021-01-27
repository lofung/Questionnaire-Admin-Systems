
//get all the addresses and names of the questionnaires from the database
const getCurrentAddress = async () => {
    try {
        const response = await fetch('/api/v1/get-all-token/')
        //console.log(response)
        //must need this line to get the result of JSON, not some silly stuff
        const JSONData = await response.json();
        attachInfoToTags(JSONData.data)
    } catch (err) {
        console.error(err)
    }
}

//attached name and URL to the div
const attachInfoToTags = (tokenArray) => {
    //console.log("hello world")
    let token = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    let finalArray = tokenArray.filter(item => item.token === token)
    let questionnaireName = ""
    if (finalArray.length === 0 ) {
        //if no result then make a error message
        questionnaireName = "No TOKEN found!! Error!!"
    } else if (finalArray.length ===1 ) {
        //result is unique, define title
        questionnaireName = finalArray[0]['questionnaire_name']
    } else {
        questionnaireName = "ERROR!! Seems like more than one result!! what??"
    }

    //attached the title of the questionnaire
    document.getElementById('title').innerHTML = questionnaireName

    //build hyperlink and attach to href div
    let hyperlink = document.createElement('a')
    hyperlink.href = "http://" + window.location.host + "/front/" + window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    hyperlink.innerHTML = "http://" + window.location.host + "/front/" + window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    document.getElementById('href').appendChild(hyperlink)
}


//need this to trigger script
getCurrentAddress();