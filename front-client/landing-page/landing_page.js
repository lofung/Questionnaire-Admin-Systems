let select = document.querySelectorAll('.token-dropdown')
let previewBox = document.getElementById('previewQ')

//redirect when searching questionnaires
previewBox.addEventListener('change', (e) => {
    //console.log(window.location.hostname)
    //window.location.hostname returns the domain of the href, i.e. www.google.com
    //window.location.href = "http://www.google.com";
    window.location.href = "http://" + window.location.host + "/front/" + e.target.value //value is the token selected
    //host includes the port; hostname does not include the port
})

//get all token and questionnires
const getCurrentAddress = async () => {
    try {
        const response = await fetch('/api/v1/get-all-token/')
        //console.log(response)
        //must need this line to get the result of JSON, not some silly stuff
        const JSONData = await response.json();
        //console.log(JSONData)
        attachTokensToSelect(JSONData.data);
    } catch (err) {
        console.error(err)
    }

  }

  //attach selections to the list
  const attachTokensToSelect = (tokenArray) => {
    //console.log("hello world")
    select.forEach((tag, idx) => {
        tokenArray.forEach((tokenRow, index) => {
            let option = document.createElement('option')
            option.value = tokenRow.token
            option.innerHTML = tokenRow.token + " - " + tokenRow.questionnaire_name
            tag.add(option)
        })
    })
  }

  getCurrentAddress();
