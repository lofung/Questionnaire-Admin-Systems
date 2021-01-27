1. Building new scheme (API), logging entry into main database, and building sub-database
	
	as of 27/1/2021, the action runs like this
    // 1. build a entry in the main database quesitonnaire_scheme
    // 2. build a (sub-)database using the token name
    // there is no good way to delete the sub-database yet. however, it should not be easy to delete the sub-database to avoid deleting important data
    
    // **. there is a wish to dynamically build a sub-database with as much columns as question
    // **currently all the answers are saved in ONE JSON column
    // **there is no time to investigate into this feature as it is a 'small' project
    // **but having answers spread out in columns can speed up analysis

    // **HOWEVER, there is also an issue where when EDITING the questionnaire, the sub-database also needs to be updated which is annoying
    // **it compounds the problem when someone wants to EDIT the questionnaire in the middle of a live run collecting data.
	
2. token cannot reload ((SOLVED, non-function part of the if-else statement))

3. type is null when building questionnaire. when loading in frontend collecting data the field becomes null
((SOLVED: make textbox the default type))

4. the view result page will return empty when there is no data from the questionnaire

5. in questionnaire-summary-viewer, it is better to redirect edit to the edit page and the select the token immeidately ((Possible solution, but need to update the API to :token))

6. in the builder, it is possible to select a old questionnaire, edit it, reload the token, and then the update would go to nowhere or be really messed up. Need to look for a way to properly disable the reload button when editing a old questionnaire

7. now it is a 'feature' to low a old questionnaire and then choose to "create a new questionnaire". few problems.
(1) one can submit a new questionnaire witht the same token (no prevention has been made yet, not enough time)
(2) there would be an error show up in the console since one cannot fetch from the api with /create

8. it is now possible to submit questions in the scheme with empty field (did not have time to implement filter)

9. it is now impossible delete rows manually (solution exists, no time to implement)

10. implement the activate/deactivate feature in the systems and the API
11. disallow students to submit when deactivating the questionnaire

12. should have used date AND time in all the matters of recording

13. apply a bootstrap template into frontend questionnaire reader

14. currently, the app.use and app.get list in server.js is a bit messy. there should be a way to do better

15. did not do mobile optimization for the front-client student-end due to time

16. there is a element of "required" ready in the questionnaire field. When it is true, the students would be required to fill in the question.