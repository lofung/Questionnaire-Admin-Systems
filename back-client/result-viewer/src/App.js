import React, { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [summaryList, setSummaryList] = useState([{"name":"kelvin","create_date":"2021/01/26","answer":[{"question":"textbox?","answer":"yes"},{"question":"mc?","answer":[" very fat"," not fat"]},{"question":"agree?","answer":"Agree"},{"question":"1-10 score?","answer":"2"}]},{"name":"john","create_date":"2021/01/26","answer":[{"question":"textbox?","answer":"hello"},{"question":"mc?","answer":["fat"]},{"question":"agree?","answer":"Disagree"},{"question":"1-10 score?","answer":"3"}]},{"name":"sanny","create_date":"2021/01/26","answer":[{"question":"textbox?","answer":"gg"},{"question":"mc?","answer":[" not fat"]},{"question":"agree?","answer":"Strongly Disagree"},{"question":"1-10 score?","answer":"4"}]}]);
  const [token, setToken] = useState("oLjLAXl1")
  const [questionnaireName, setQuestionnaireName] = useState("Q-name")

  const getCurrentAddress = async () => {
    //get the current address and then break down into token, and then load the data
    let address = window.location.href //address that is typed into the client browser
    //console.log(window.location.href)
    let addressArray = address.split("/")
    let token = addressArray[addressArray.length-1] //the token of the q we want to fetch from server
    //alert(token)
    setToken(token)
    try {
      //did not attached questionnaire name into the sub-database and hence need to load from main
      const response = await fetch('/api/v1/questionnaire-live/' + token)
      //console.log(response)
      //must need this line to get the result of JSON, not some silly stuff
      const JSONData = await response.json();
      //console.log(JSONData)
      setQuestionnaireName(JSONData.data.questionnaire_name)
      setToken(JSONData.data.token)
    } catch (err) {
      console.error(err)
    }
    try {
      //load answers from sub-database
      const response = await fetch('/api/v1/viewanswers/' + token)
      //console.log(response)
      //must need this line to get the result of JSON, not some silly stuff
      const JSONData = await response.json();
      //console.log(JSONData)
      setSummaryList(JSONData.data)
    } catch (err) {
      console.error(err)
    }

  }

  useEffect(() => {
    getCurrentAddress();
    console.log(summaryList)
  }, [])

  return (
    <div className="container" style={{"margin":"15px"}}>
      <h1>Results of {questionnaireName} ({token})</h1>
      <br />
      <a href="/bd/admin-config/">Return to main page</a>
      <br />
      <br />
      <table style={{"border": "1px solid black"}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            {summaryList[0]["answer"].map((item, idx)=> 
              <th key={idx+item.question}>{item.question}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {summaryList.map((entry, index) => 
            <tr key={index+entry.name}>
              <td>{entry.name}</td>
              <td>{entry.create_date}</td>
              {entry.answer.map((item, idx) => 
                <td key={entry.name+idx+item.answer}>{Array.isArray(item.answer)===true?item.answer.map((ans, k) =><div key={"a"+k}>{ans}</div>):item.answer}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
