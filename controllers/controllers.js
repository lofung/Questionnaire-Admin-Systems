const pool = require("../config/elephantsql");

// @desc GET ALL Questionnaires token and name
// @route /api/v1/get-all-token
// @access public

exports.getAllScheme = async (req, res, next) => {
    // get questions for the front-client students
    //res.send('hello world')
    try {
        await pool.query('SELECT token, questionnaire_name FROM questionnaire_scheme', (err, result) => {
            if (err) throw err;
            //let options = {"token": result['rows'][0]['token'], "q_name": result['rows'][0]['questionnaire_name'], "modi_date": result['rows'][0]['modi_date'], "questions": result['rows'][0]['content_json']}
            //console.log(result)
            return res.status(201).json({
                success: "success",
                data: result.rows,
                fields: result.fields
            })
        })
    } catch (err) {
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "cannot retrieve tokesn and questionnaires"
        })
    }
}

// @desc GET ALL Questionnaires data, FULL TABLE
// @route /api/v1/questionnairesummary
// @access public

exports.getQuestionnaireSummary = async (req, res, next) => {
    // get questions for the front-client students
    //res.send('hello world')
    try {
        await pool.query('SELECT * FROM questionnaire_scheme', (err, result) => {
            if (err) throw err;
            //let options = {"token": result['rows'][0]['token'], "q_name": result['rows'][0]['questionnaire_name'], "modi_date": result['rows'][0]['modi_date'], "questions": result['rows'][0]['content_json']}
            //console.log(result)
            return res.status(201).json({
                success: "success",
                data: result.rows,
                fields: result.fields
            })
        })
    } catch (err) {
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "cannot GET the whole table"
        })
    }
}

// @desc GET Questions for students for ONE indivdual questionnaire
// @route /api/v1/questionnaire-live/:token
// @access public

exports.getQuestions = async (req, res, next) => {
    // get questions for the front-client students
    //res.send('hello world')
    let token = req.params.token;
    let query = []
    query.push(token)
    try {
        let result = await pool.query('SELECT * FROM questionnaire_scheme WHERE token = $1', query, (err, result) => {
            if (err) throw err;
            //let options = {"token": result['rows'][0]['token'], "q_name": result['rows'][0]['questionnaire_name'], "modi_date": result['rows'][0]['modi_date'], "questions": result['rows'][0]['content_json']}
            //console.log(result)
            return res.status(201).json({
                success: "success",
                data: result.rows[0],
                fields: result.fields
            })
        })
    } catch (err) {
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "cannot retrieve questions"
        })
    }

}

// @desc POST answers to server
// @route /api/v1/postanswers/:token
// @access public

exports.postAnswers = async (req, res, next) => {
    //name, date, answers
    const { name, date, answers } = req.body;
    const token = req.params.token
    //console.log(content_json)
    let final_JSON = JSON.stringify(answers)
    //stringify JSON, then upload it with the below syntax into postqreSQL
    //console.log(final_JSON)
    try {
        await pool.query("INSERT INTO " + token + " (name, create_date, answer) VALUES ($1, $2, $3::json)",
            [name, date, final_JSON],
            (err, result) => {
                if (err) throw err;
            })
        console.log("update success")
        return res.redirect(303, '/bd/admin-config/')
        //303 code allows redirect after PUT function
        //this 303 code does not automatically redirect on client, must trigger a redirect in the frontend
    } catch (err) {
        console.log("error, cannot update scheme")
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "fail to upload answer onto " + token
        })
    }
}


// @desc POST build new scheme
// @route /api/v1/buildnewscheme
// @access public

exports.buildNewScheme = async (req, res, next) => {

    // 1. build a entry in the main database quesitonnaire_scheme
    // 2. build a (sub-)database using the token name
    // there is no good way to delete the sub-database yet. however, it should not be easy to delete the sub-database to avoid deleting important data

    // **. there is a wish to dynamically build a sub-database with as much columns as question
    // **currently all the answers are saved in ONE JSON column
    // **there is no time to investigate into this feature as it is a 'small' project
    // **but having answers spread out in columns can speed up analysis

    // **HOWEVER, there is also an issue where when EDITING the questionnaire, the sub-database also needs to be updated which is annoying
    // **it compounds the problem when someone wants to EDIT the questionnaire in the middle of a live run collecting data.

    console.log("new schcme called")
    //'token', 'questionnaire_name', 'active', 'create_date', 'modi_date', 'content_JSON', questionList, moneySignList
    const { token, questionnaire_name, active, create_date, modi_date, content_json, questionList, moneySignList } = req.body;
    //console.log(content_json)
    let final_JSON = JSON.stringify(content_json)
    //stringify JSON, then upload it with the below syntax into postqreSQL
    //console.log(final_JSON)

    // 1. build a entry in the main database quesitonnaire_scheme
    try {
        await pool.query("INSERT INTO questionnaire_scheme (questionnaire_name, active, create_date, modi_date, content_JSON, token) VALUES ($1, $2, $3, $4, $5::json, $6)",
            [questionnaire_name, active, create_date, modi_date, final_JSON, token],
            (err, result) => {
                if (err) throw err;
            })
        console.log("update success")
        //return res.redirect(303, '/front/' + token)
        //303 code allows redirect after PUT function
    } catch (err) {
        console.log("error, cannot update scheme")
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "fail to update into questionnaire scheme database"
        })
    }

        // 2. build a (sub-)database using the token name
        //CAN DO BETTER by spreading all data into different columns but time is limited
        //(the moneySignList and questionList array are built for this feature)
        //will discover later.
    try {
        await pool.query("CREATE TABLE " + token + " (name varchar(100), create_date varchar(10), answer json)", (err, result) => {
            if (err) throw err;
        })
        console.log("create table success!")
        return res.redirect(303, '/front/' + token)
        //this 303 code does not automatically redirect on client, must trigger a redirect in the frontend
    } catch (err) {
        console.log("error, cannot build new table")
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "fail to create table but successful inserting into questionnaire scheme. check db"
        })
    }
}

// @desc PUT edit new scheme
// @route /api/v1/editscheme/:token
// @access public

exports.editScheme = async (req, res, next) => {
    //'token', 'questionnaire_name', 'active', 'create_date', 'modi_date', 'content_JSON', questionList, moneySignList
    const { token, questionnaire_name, active, modi_date, content_json, questionList, moneySignList } = req.body;
    //console.log(content_json)
    let final_JSON = JSON.stringify(content_json)
    //stringify JSON, then upload it with the below syntax into postqreSQL
    //console.log(final_JSON)
    try {
        await pool.query("UPDATE questionnaire_scheme SET (questionnaire_name, active, modi_date, content_JSON) = ($1, $2, $3, $4::json) WHERE token=$5",
            [questionnaire_name, active, modi_date, final_JSON, token],
            (err, result) => {
                if (err) throw err;
            })
        console.log("update success")
        return res.redirect(303, '/front/' + token)
        //303 code allows redirect after PUT function
    } catch (err) {
        console.log("error, cannot update scheme")
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "fail to update into questionnaire scheme database"
        })
    }
}

// @desc DELETE new scheme
// @route /api/v1/editscheme/:token
// @access public

exports.deleteScheme = async (req, res, next) => {
    const token = req.params.token
    try {
        await pool.query("DELETE FROM questionnaire_scheme WHERE token = $1", [ token ],
            (err, result) => {
                if (err) throw err;
            })
        console.log("delete success")
        return res.redirect(303, '/bd/admin-config/')
        //303 code allows redirect after PUT function
    } catch (err) {
        console.log("error, cannot delete scheme")
        return res.status(500).json({
            success: "fail",
            error: err,
            message: "fail to delete scheme " + token
        })
    }
}

// @desc GET Answers
// @route /api/v1/viewanswers/:token
// @access public

exports.viewAnswers = async (req, res, next) => {
    //GET answers for the front-client students
    //res.send('hello world')
    let token = req.params.token;
    try {
        await pool.query('SELECT * FROM ' + token, (err, result) => {
            if (err) throw err;
            //let options = {"token": result['rows'][0]['token'], "q_name": result['rows'][0]['questionnaire_name'], "modi_date": result['rows'][0]['modi_date'], "questions": result['rows'][0]['content_json']}
            //console.log(result)
            return res.status(201).json({
                success: "success",
                data: result.rows,
                fields: result.fields,
                token
            })
        })
    } catch (err) {
        return res.status(500).json({
            success: "fail",
            error: err,
            message:"cannot get answers"
        })
    }
}