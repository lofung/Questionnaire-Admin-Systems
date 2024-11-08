README.

Please use notepad++

If you cannot open the website in any formats, PLEASE CERTAINLY LET KELVIN KNOW. I have worked more than 30 hours on this project and definitely do not want to be ghosted just because "someone cannot open the designated files".

-----------------------------------------
To download the source code .zip file
-----------------------------------------

The whole folder (200MB, recommanded)
https://drive.google.com/file/d/1PPPbfSPtaqXphnJvOcfAIk4QekCQz5tO/view?usp=sharing

Without node_modules (20MB)
https://drive.google.com/file/d/1xFSdmqdI6yra9Ckt9u_oOqMwB3OPhQZI/view?usp=sharing

-----------------------------------------
GITHUB Repositories
-----------------------------------------

(A) The whole folder (the whole website has to be worked that way since there are relative links)
https://github.com/lofung/OSP

(B) OSP_Frontend
https://github.com/lofung/OSP_frontend

(C) OSP_Backend
https://github.com/lofung/OSP_backend

-----------------------------------------
HOW TO START THE SERVER
-----------------------------------------

The frontend react side are all built.

You may see the project at:
(1) https://warm-lake-91942.herokuapp.com/
Heroku is very slow and could cause problem when accessing some API's (particularly when building a questionnaire. Since it would have an entry in one database and build another (sub-)database
((seems problem mitigrated as of 28/1/2021 Thursday))

(2) Use localhost. Run at the root (where server.js is) with 

npm run server

What loads up at the root (localhost:5000 or heroku) would be the frontend for students. The backend for admins is "hidden" at the top left hand corner in a hyperlink.

Currenly, no authentication system has been put up.

------------------------------------------
Database structure
------------------------------------------

The online database of PostgreSQL can be accessed at 

https://www.elephantsql.com/
Login name: (available in offline files)
Password: (available in offline files)

The base database with all the questionnaire information can be accessed at

SELECT * FROM "public"."questionnaire_scheme" LIMIT 100

For every questionnaire, there would be a database built with their token when the questionnaire template is submitted to the database. And hence all the answerse can be submitted with

SELECT * FROM "public"."(TOKEN)" LIMIT 100
SELECT * FROM "public"."oc7qsp4f" LIMIT 100 (for example)

The sub-databases with the token name currently cannot be deleted. (Would be planned carefully)

Only data lines on the main database "questionnaire_scheme" can be deleted in the admin pages.

------------------------------------------
File strcture for the web	
------------------------------------------

back-client										folder for the admin panels
back-client/builder								react for the questionnaire building/editing page
back-client/questionnaire-summary-viewer		react for viewing all data of questionnaire templates
back-client/result-viewer						react for viewing respect answers for a questionnaire
back-client/index.html, landing_page.js			vanilla javascript page for admin panel landing

front-client									folder for the webpages accessible by students
front-client/landing-page						vanilla javascript page for student landing
front-client/QR-code							vanilla javascript page for generating QR code
front-client/questionnaire-reader				react for entering answers into questionnaire

controllers										backend APIs
routes											entry points for the APIs
config											configs for postgreSQL and config.env
server.js										main .js for the server

------------------------------------------
APIs and other comments
------------------------------------------

Those should be self-explainatory. Comments are mostly sticked into respective parts of the source code.

------------------------------------------
Remarks	
------------------------------------------

All the bugs and 'wishes' are in the seperate README of README current bugs and wishes.txt

The front end design is not put up yet. However, the vanilla pages should be mostly functional.

Frontend designs have been given up at this stage since it could take a few weeks to develop a good design. However, those designs are mostly cosmetic and would not interfere into most usages.

There are some quality-of-life(QOL) front end designs that could be made. For example

Progress steps: https://lofung.github.io/40_02_progress_steps/  ((DONE))
Seperating choices (MC): https://lofung.github.io/40_13_random_choice_UI/  ((DONE))
Animated buttons: https://lofung.github.io/40_32_animated_buttons/

As of now 27/1/2021 night (Wedendasay), I have seemed to put in about 30 hours for this project. I surely hope to see some good results coming.


