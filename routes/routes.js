const express = require('express');
const router = express.Router();
const { getQuestions, buildNewScheme, editScheme, deleteScheme, postAnswers, getAllScheme, viewAnswers, getQuestionnaireSummary } = require('../controllers/controllers');

//https://youtu.be/KyWaXA_NvT0?t=787
//https://www.postman.com/

router
    .route('/get-all-token/')
    .get(getAllScheme)

router
    .route('/questionnairesummary')
    .get(getQuestionnaireSummary)

router
    .route('/questionnaire-live/:token')
    .get(getQuestions)

router
    .route('/buildnewscheme')
    .post(buildNewScheme)

router
    .route('/editscheme/:token')
    .put(editScheme)
    .delete(deleteScheme)

router
    .route('/postanswers/:token')
    .post(postAnswers)

router
    .route('/viewanswers/:token')
    .get(viewAnswers)

module.exports = router;