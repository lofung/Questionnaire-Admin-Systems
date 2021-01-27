import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [title, setTitle] = useState("Ordinary Questionnaire (Cannot fetch db - demo)")
  const [token, setToken] = useState("vkkU2MmK")
  const [questionList, setQuestionList] = useState(
    [{"question":"day?","type":"textbox","options":"", "required": false, "answer": ""},
    {"question":"drinking?","type":"mc","options":"yes; no; i dunno;", "required": false, "answer": ""},
    {"question":"like parents?","type":"likert","options":"1-10", "required": false, "answer": ""},
    {"question":"like hk?","type":"likert","options":"agree-disagree-5", "required": false, "answer": ""}]
    );

  //get the date of today, should have got time also
  function getTodayDate(){
    //https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return yyyy + '/' + mm + '/' + dd;
  }

  //when hitting the submitt button
  const submitQ = async () => {
    let answerList = []

    //rebuild the JSON to ease load on database
    questionList.forEach((item, idx) => {
      answerList.push({"question": item.question, "answer": item.answer})
    })
    //only get q and a to minimize db load

    const answer = {
      name: document.getElementById('name').value,
      date: getTodayDate(),
      answers: answerList
    }
    try {
      //'token', 'questionnaire_name', 'active', 'create_date', 'modi_date', 'content_JSON', questionList, moneySignList
      const response = await fetch('/api/v1/postanswers/' + token.substring(0, 8), {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(answer),
          
      });
      alert("input success, thank you for answering!!")
      window.location.href = "/" 
    } catch (err) {
      console.error(err);
    }
  }

  //load the checked boxes in mc to the JSON of answer
  const changeCheckboxAnswer = (index, question) => {
    //https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/
    const checkedboxes = document.querySelectorAll(`input[name=q${index}]:checked`);
    //querySelectorAll cannot search special characters!!
    //console.log(checkedboxes)
    let values = [];
    checkedboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    let tempAnswerList = [...questionList]
    tempAnswerList[index]["answer"] = values
    setQuestionList(tempAnswerList)
  }

  //generate options for the check boxes
  const generateOptions = (options, index, question) => {
    //return options.split(';').map(answer => "hello world")
    //console.log(options.split(';'))
    return (options.split(";").filter(answer => answer!=="").map((answer, idx) => 
        <div key={answer+"-"+idx} style={{"margin": "5px"}}>
          <input type="checkbox" value={answer} name={"q"+index} onChange={(e) => changeCheckboxAnswer(index)}/>
          <label htmlFor={answer}>{answer}</label>
        </div>
    ))
  }

  const recordAnswer = (e, idx) => {
    //if detect a change in options, immeidately log it in state
    let tempAnswerList = [...questionList]
    tempAnswerList[idx]["answer"] = e.target.value
    setQuestionList(tempAnswerList)
  }

  const answerSwitch = (type, options, index, question) => {
    // https://stackoverflow.com/questions/46592833/how-to-use-switch-statement-inside-a-react-component/60365434
    // to resolve different question types for the questionnaire
    let obj = ""
    switch(type){
      case "textbox":
        obj = <input type="text" id={"q"+index} onChange={(e) => recordAnswer(e, index)}/>
        break;
      case "mc":
        //https://www.w3schools.com/tags/att_select_multiple.asp
        obj = <div id={"q"+index}>
          {generateOptions(options, index, question)}
        </div>
        break;
      case "likert":
        if (options === "1-10"){
          //in case if the likert has to become odd values like 2-15
          //then replace with Regex
          let limits = options.split("-")
          let lowerLimit = parseInt(limits[0])
          let upperLimit = parseInt(limits[1])
          let resultArray = []
          for (let k = lowerLimit; k<upperLimit+1; k++) { resultArray.push(k) }
          obj = <select name={"q"+index} id={"q"+index} defaultValue="default" onChange={(e) => recordAnswer(e, index)}>
            <option value="default" disabled>Select</option>
            {resultArray.map(score => <option key={score+"score"} value={score}>{score}</option>)}
          </select>
        }
        if (options === "agree-disagree-5"){
          let resultArray = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
          obj = <select name={"q"+index} id={"q"+index}  defaultValue="default" onChange={(e) => recordAnswer(e, index)}>
            <option value="default" disabled>Select</option>
            {resultArray.map(score => <option key={score+"agree"}value={score}>{score}</option>)}
          </select>
        }
        break;
      //the odd default catch
      default:
        obj ="caught in default, contact developer"
        break;
    }
    return obj
  }

  //get the token in the address link and load the questions
  const getCurrentAddress = async () => {
    let address = window.location.href //address that is typed into the client browser
    //console.log(window.location.href)
    let addressArray = address.split("/")
    let token = addressArray[addressArray.length-1] //the token of the q we want to fetch from server
    //alert(token)
    setToken(token)
    
    //load questions
    try {
      const response = await fetch('/api/v1/questionnaire-live/' + token)
      //console.log(response)
      //must need this line to get the result of JSON, not some silly stuff
      const JSONData = await response.json();
      //console.log(JSONData)
      const questionData = JSONData.data.content_json
      //console.log(questionData)
      setTitle(JSONData.data.questionnaire_name)
      setToken(JSONData.data.token + " - load success")
      setQuestionList(questionData)
    } catch (err) {
      console.error(err)
    }

  }

  useEffect(() =>{
    getCurrentAddress()
  }, []);

  return (
    <div className="container" style={{"margin": "15px"}}>
      <h1>{title}</h1>
      Token: <input type="text" value={token} disabled />
      <div className="questionnaire-container" style={{"margin": "15px", "border":"1px solid"}}>
        <br />
        Name: <input type="text" id="name" />
        {/* generate questionnaire here */}
        {questionList.map((data, idx) => 
          <div key={idx+'box'} className={'question-'+idx+'-box'} style={{"margin": "10px"}}>
            <div>{idx+1}. {data.question}</div>
            {/* generate answer in swtich */}
            {answerSwitch(data.type, data.options, idx, data.question)}
          </div>
        )}
      </div>

      <button onClick={() => submitQ()}>Submit</button>
      <br/>{JSON.stringify(questionList)}
    </div>
  );
}

export default App;
