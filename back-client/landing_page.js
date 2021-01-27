let select = document.querySelectorAll('.token-dropdown')
let resultBox = document.getElementById('viewResults')
let previewBox = document.getElementById('previewQ')
let QRBox = document.getElementById('genQR')

//redirect when selected in preview
previewBox.addEventListener('change', (e) => {
    //console.log(window.location.hostname)
    //window.location.hostname returns the domain of the href, i.e. www.google.com
    //window.location.href = "http://www.google.com";
    window.location.href = "http://" + window.location.host + "/front/" + e.target.value //value is the token selected
    //host includes the port; hostname does not include the port
})

//redirect when selected in results
resultBox.addEventListener('change', (e) => {
    window.location.href = "http://" + window.location.host + "/bd/admin-config/view-result/" + e.target.value //value is the token selected
    //host includes the port; hostname does not include the port
})

//redirect when selected in QR code
QRBox.addEventListener('change', (e) => {
    window.location.href = "http://" + window.location.host + "/front/qr/" + e.target.value //value is the token selected
    //host includes the port; hostname does not include the port
})

//get all the tokens and names from database
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

  //attach options into all drop downs
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

  //if you do not have the trigger the whole script does not run
  getCurrentAddress();
