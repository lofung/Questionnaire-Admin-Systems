import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [summaryList, setSummaryList] = useState([{"token":"abfs2357","questionnaire_name":"first_questionnaire","active":true,"create_date":"2021/1/25","modi_date":"2021/1/25","content_json":null},{"token":"abfs2358","questionnaire_name":"first_questionnaire","active":true,"create_date":"2021/1/25","modi_date":"2021/01/26","content_json":[{"question":"hello wold can json work?","type":"textbox","options":"","required":false},{"question":"gg it works!","type":"mc","options":" yes; no; i dunno;","required":false},{"question":"can edit API work?","type":"likert","options":"1-10","required":false},{"question":"does redirect work? try","type":"likert","options":"agree-disagree-5","required":false}]},{"token":"j6w2x1qi","questionnaire_name":"test create q","active":true,"create_date":"2021/01/26","modi_date":"2021/01/26","content_json":[{"question":"are you fat?","type":"textbox","options":""}]},{"token":"vr0f4djB","questionnaire_name":"test create q and server","active":true,"create_date":"2021/01/26","modi_date":"2021/01/26","content_json":[{"question":"are you very fat?","type":"textbox","options":""}]},{"token":"oLjLAXl1","questionnaire_name":"multi field input test","active":true,"create_date":"2021/01/26","modi_date":"2021/01/26","content_json":[{"question":"textbox?","type":"textbox","options":""},{"question":"mc?","type":"mc","options":"fat; very fat; not fat;"},{"question":"agree?","type":"likert","options":"agree-disagree-5"},{"question":"1-10 score?","type":"likert","options":"1-10"}]}]);

  const deleteQ = async (token) => {
    //trigger delete row in database, BUT DO NOT DELETE THE ATTACHED DATABASE
    //console.log("hello world " + token)
    if (window.confirm("Are you sure you want to delete? You may deactivate the questionnaire first and delete when you are sure!")){
      //ask before delete
      try {
          const deleteTodo = await fetch (`/api/v1/editscheme/${token}`,{
              method: "DELETE"
          });
          console.log(deleteTodo);
          await loadSummaryList();
      } catch (err) {
          console.error(err.message)
      }
  }
  }

  const loadSummaryList = async () => {
    //load the whole main database of info
    //console.log("load! air!")
    try {
      const response = await fetch('/api/v1/questionnairesummary');
      const jsonData = await response.json();
      setSummaryList(jsonData.data)
      if (!jsonData.data) {setSummaryList([])} //if no data then give empty array to avoid breaking whole site
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadSummaryList();
  }, [])

  return (
    <div className="container">
      <h1>View, activate/deactivate or delete questionnaires</h1>
      <br />
      <table style={{"border": "1px solid black"}}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Questionnaire Name</th>
            <th>Active</th>
            <th>Creation Date</th>
            <th>Last Modification</th>
            <th>{/*view*/}</th>
            <th>{/*edit*/}</th>
            <th>{/*delete*/}</th>
          </tr>
        </thead>
        <tbody>
          {summaryList?summaryList.map((entry, idx) => 
            <tr key={idx+entry.token}>
              <td>{entry.token}</td>
              <td>{entry.questionnaire_name}</td>
              <td>
                <span style={{"display":"block", "textAlign":"center"}}>{entry.active===true?"active":entry.active===false?"deactived":"error!!" /* cannot show boolean in table*/}</span>
                <button disabled>Activate</button>{/* the activate deactivate part is easy but no time to make */}
                <button disabled>Deactivate</button>{/* allow student to read but disallow submit when deactivate */}
              </td>
              <td>{entry.create_date}</td>
              <td>{entry.modi_date}</td>
              <td><a target='_blank' href={'/front/qr/'+entry.token /* _blank opens new window */}><button>QR</button></a></td>
              <td><a target='_blank' href={'/front/'+entry.token}><button>Preview</button></a></td>
              <td><a target='_blank' href={'/bd/admin-config/view-result/'+entry.token}><button>Results</button></a></td>
              <td><button onClick={() => {window.location.href = '/bd/admin-config/build-edit/'}}>Edit</button></td>
              <td><button onClick={() => deleteQ(entry.token)}>DELETE</button></td>
            </tr>
          ):<tr><td>No records!</td></tr> /* return no record if there is no summary drawable*/
          /* this part does not work yet */}
        </tbody>
      </table>
    </div>
  );
}

export default App;
