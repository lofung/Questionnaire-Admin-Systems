import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [questionList, setQuestionList] = useState([{"question": "", "type": "textbox", "options": ""}]);
  const [existingTokenList, setExistingTokenList] = useState([]);

  //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  function makeid(length) {
    //generate ID of 8 length
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
  }

  function getTodayDate(){
    //get the date of today.
    //should include time also next time.
    //https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return yyyy + '/' + mm + '/' + dd;
  }

  async function submit(){
    //handle the submit button push
    let newArray = [...questionList] //copy from state such that it does not have the pointer pointing to same memory

    newArray.forEach(data => {
      //if it is anything outside mc or likert, the options should be empty
      if(data.type !=="mc" && data.type !=="likert") { data.options = ""}
    })
    setQuestionList(newArray) 

    //asign values to appropiate boxes
    let token = document.getElementById('token').value
    let questionnaire_name = document.getElementById('name').value

    //these variables was build such that it can dynamically create database for answers,
    //and have every answer in a column such that the SQL wont lose its ability to analyse
    //HOWEVER, there is not enough time in this project to dig deep in this feature
    let qList = "" //variable clash , questionList and qlist
    let moneySignList = ""
    questionList.forEach((item, idx) => {
      if (item.type === "textbox"){
        qList = qList.concat(item.question, " varchar(100) ")
      } else {
        qList = qList.concat(item.question, " varchar(10) ")
      }
      moneySignList = moneySignList.concat(`$${idx+1} `)
    })

    //feature to delete excessive empty columns are not done because no time

    if (document.getElementById('selectMode').value === "create") {
      try {
        //if it is not editing an existing questionnaire, then create
        //'token', 'questionnaire_name', 'active', 'create_date', 'modi_date', 'content_JSON', questionList, moneySignList
        const response = await fetch('/api/v1/buildnewscheme/', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ "token":token, "questionnaire_name": questionnaire_name, "active": true, "create_date": getTodayDate(), "modi_date": getTodayDate(), "content_json": newArray, "questionList": qList, "moneySignList": moneySignList }),
            
        });
        alert('Creation successful! Redirect to review')
        window.location.href = response.url //redirect to preview
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        //update if selected existing questionnaire
        //'token', 'questionnaire_name', 'active', 'create_date', 'modi_date', 'content_JSON', questionList, moneySignList
        const response = await fetch('/api/v1/editscheme/' + token, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ "token":token, "questionnaire_name": questionnaire_name, "active": true, "create_date": getTodayDate(), "modi_date": getTodayDate(), "content_json": newArray, "questionList": qList, "moneySignList": moneySignList }),
            
        });
        alert('Update successful! Redirect to review')
        window.location.href = response.url 
      } catch (err) {
        console.error(err);
      }
    }
  }

  function addLastRow() {
    //add law row to the questionnaire
    setQuestionList([...questionList, {"question": "", "type": "textbox", "options": ""}])
  }

  function addRow(e, index){
    //add row in the middle of the questionnaire
    //console.log(index)
    //console.log(questionList)
    let newArray = [...questionList]
    newArray.splice(index, 0, {"question": "", "type": "textbox", "options": ""})
    //if you assign a array.slice to a variable you only get what is cut out.
    //doing splice itself affect on the current array variable
    //console.log(newArray)
    setQuestionList(newArray)
    //console.log(questionList)
  }

  function changeItem(e, idx, item){
    //turn off and on the option box if the type of q is not textbox
    let newArray = [...questionList]
    newArray[idx][item] = e.target.value
    setQuestionList(newArray)

    //if select is type and mc then next text box allow typing
    if (item==="type" && e.target.value === "mc"){
      //nextsibling is the next tag that is not a child
      //this is mc
      e.target.nextSibling.disabled = false
      e.target.nextSibling.placeholder="Seperate MC options with ;"
    } else if (item==="type" && e.target.value === "likert"){
      //this is likert
      e.target.nextSibling.disabled = false
      e.target.nextSibling.placeholder="Select from dropdown"
    } else if (item==="type") {
      //this is NOT likert or mc
      e.target.nextSibling.disabled = true
      e.target.nextSibling.placeholder=""
      setQuestionList(newArray)
    }

    //then show or delete the preview bubbles
    //purely frontend
    if (item==="options" && (e.target.previousSibling.value==="mc"||e.target.previousSibling.value==="likert") ){
      //if someone type in options; and the selected type is mc or likert, then
      drawBubbles(idx, e.target.value, e.target.previousSibling.value)
    } else if (item==="type" && (e.target.value==="textbox")) {
      //if someone chooses textbox in  type, then delete all bubbles
      drawBubbles(idx, "", "textbox")
    } else if (item==="type" && (e.target.value==="mc"||e.target.value==="likert")){
      //if someone chooses mc or likert in type, then check if there exists options in the next box
      drawBubbles(idx, e.target.nextSibling.value, e.target.value)
      //index, take the value at the next box, the type is the current value
    }
      // (idx, input value, TYPE  in the last box)
  }

  //show preview bubbles for likert and mc
  function drawBubbles(idx, value, type){
    let previewBox = document.getElementById("sample"+idx)
    previewBox.innerHTML = ``

    if (value==="1-10"){
      //when changing to any number, 
      //1. use regex
      //2. apply a loop to generate the array

      const tags = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      
      //then attach tags to the designated preview div
      //https://lofung.github.io/40_13_random_choice_UI/
      tags.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.classList.add('tag')
        tagEl.classList.add('light-blue')
        tagEl.innerText = tag
        previewBox.appendChild(tagEl)
      })

    } else if (value==="agree-disagree-5") {

      const tags = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      
      //then attach tags to the designated preview div
      tags.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.classList.add('tag')
        tagEl.classList.add('light-blue')
        tagEl.innerText = tag
        previewBox.appendChild(tagEl)
      })

    } else {

      //anything else, ordinary mc options
      const tags = value.split(';')
        .filter(tag => tag.trim()!=='')//does not add any consecutive semi-colons
        .map(tag=>tag.trim())//delete empty spaces at the start and the end

      //then attach tags to the designated preview div
      tags.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.classList.add('tag')
        tagEl.innerText = tag
        previewBox.appendChild(tagEl)
      })

    }
  }

  function reloadId(){
    //reload token
    document.getElementById("reloadToken").disabled = false
    let result = makeid(8)
    document.getElementById('token').value = result;
    existingTokenList.forEach(tokenObj => {
      if (tokenObj.token === result){
        reloadId()
        //if in very rare chance generate same token then reload again
      } else {
        document.getElementById('token').value = result;
      }
    })
  }

  const getCurrentTokens = async () => {
    //get the list of current tokens and names
    try {
        const response = await fetch('/api/v1/get-all-token/')
        //console.log(response)
        //must need this line to get the result of JSON, not some silly stuff
        const JSONData = await response.json();
        //console.log(JSONData)
        //add those tokens to dropdown menu
        setExistingTokenList(JSONData.data)
        JSONData.data.forEach((tokenRow, index) => {
          let option = document.createElement('option')
          option.value = tokenRow.token
          option.innerHTML = tokenRow.token + " - " + tokenRow.questionnaire_name
          document.getElementById('selectMode').add(option)
      })
    } catch (err) {
        console.error(err)
    }

  }

  const getCurrentQuestions = async (e) => {
    //get the current questions for that given token
    
    reloadId();//bandage fix when switching back from edit to "CREATE", that the reload token button does not come back to active.
    try {
      const response = await fetch('/api/v1/questionnaire-live/' + e.target.value) //get token questions
      //console.log(response)
      //must need this line to get the result of JSON, not some silly stuff
      const JSONData = await response.json();
      //console.log(JSONData)
      let questionData = JSONData.data.content_json
      //console.log(questionData)
      document.getElementById('name').value = JSONData.data.questionnaire_name
      document.getElementById('token').value = JSONData.data.token
      let finalQuestionData = questionData
      //directly read from prestgreSQL for JSON
      console.log(finalQuestionData)
      console.log(typeof finalQuestionData)
      setQuestionList(finalQuestionData)

      //turn on the textbox if value is mc or likert
      //this part of the code does not work yet
      let allTypeChoice = document.querySelectorAll('#typeBox')
      allTypeChoice.forEach(choice => {
        if (choice.value === "likert" || choice.value === "mc"){
          choice.nextSibling.disabled = false
        }
      })
      enableDisableReloadTokenButton();
    } catch (err) {
      console.error(err)
    }

  }

  const enableDisableReloadTokenButton = () => {
    //STILL WORKING ON IT, does not work now
    if (document.getElementById('selectMode').value === "create") {
      //disable the token reload button to avoid 
      //alert("is create")
      reloadId();
      document.getElementById("reloadToken").disabled = false
    } else {
      //alert("not create")
      document.getElementById("reloadToken").disabled = true
    }
  }

  useEffect(() => {
    reloadId(); //this load part becomes cannot work, dont know why yet
    getCurrentTokens();
  }, [])

  return (
    <div className="container" style={{"margin": "25px"}}>
      <h1>Build a questionnaire</h1>
      <div>Select questionnaire to edit:</div>
      <select className="token-dropdown" id="selectMode" style={{"width": "300px"}} onChange={(e) => getCurrentQuestions(e)}>
        <option value="create">Create new questionnaire</option>
      </select>
      <br />
      <br />
      <div>Questionnaire Name:</div>
      <input type="text" id="name" name="name" />
      <div>Generate random token:</div>
      <input type="text" id="token" name="token" disabled/> <button id="reloadToken" onClick={() => reloadId()}>Reload</button>
      <br />
      <div style={{"margin": "15px", "border":"1px solid"}}>
        <div style={{"margin": "15px"}}>
        {questionList.map((data, idx) =>
        <div key={idx}>
          <div style={{"margin": "15px"}}>
            <input type="text" name="question" value={data["question"]} onChange={(e) => changeItem(e, idx, "question")}/>
            <select name="type" className="typeBox" value={data["type"]} onChange={(e) => changeItem(e, idx, "type")}>
              <option value="textbox">Textbox</option>
              <option value="mc">Multiple Choice</option>
              <option value="likert">Likert</option>
            </select>
            <input list={"dropdown-in-detail-"+idx} type="text" name="options" value={data["options"]} onChange={(e) => changeItem(e, idx, "options")} disabled />
            <datalist id={"dropdown-in-detail-"+idx}>  
              <option value="1-10" >likert 1-10</option>
              <option value="agree-disagree-5" >agree-disagree-5</option>
            </datalist>
            <button onClick={(e)=>addRow(e, idx)}>+</button>
          </div>
          <div id={"sample"+idx}></div>
        </div>
        )

        /* end of map */}

        <button onClick={()=>addLastRow()}>+</button>
      </div>
      <br />
      <br />

      </div>
      <button onClick={()=>submit()}>Submit</button>
      {JSON.stringify(questionList)}

    </div>
    );
}

export default App;
