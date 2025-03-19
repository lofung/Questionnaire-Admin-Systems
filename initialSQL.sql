CREATE TABLE login_table (

    login_name VARCHAR(255),
    doc_name VARCHAR(255),
    is_admin VARCHAR(255),
	password VARCHAR(255),
	login_id SERIAL PRIMARY KEY
);

CREATE TABLE clinic_source_table (
    clinic_id SERIAL PRIMARY KEY,
    clinic_name VARCHAR(255),
    am VARCHAR(255),
    date VARCHAR(255)
);

CREATE TABLE clinic_time_table (
    clinic VARCHAR(255),
	doctor VARCHAR(255),
	weight INT,
	am BOOLEAN,
	date VARCHAR(255),
	event_id SERIAL PRIMARY KEY
);

INSERT INTO login_table (login_name, doc_name, password, is_admin, login_id)
VALUES 
    ('bigadmin', 'bigadmin', '$2a$10$cj6NT/DqR4CZCNlUyNGmZeYIndDAmJgfq6vdH6w4Ojcyfa5IdQBTe', 'true', 30),
    ('admindemo', 'admindemo_name', '$2a$10$cj6NT/DqR4CZCNlUyNGmZeYIndDAmJgfq6vdH6w4Ojcyfa5IdQBTe', 'true', 31),
    ('userdemo', 'userdemo_name', '$2a$10$cj6NT/DqR4CZCNlUyNGmZeYIndDAmJgfq6vdH6w4Ojcyfa5IdQBTe', 'false', 32),
    ('user', 'user_name', '$2a$10$cj6NT/DqR4CZCNlUyNGmZeYIndDAmJgfq6vdH6w4Ojcyfa5IdQBTe', 'false', 33);
	
INSERT INTO clinic_time_table(clinic,doctor,weight,am,date,event_id)
VALUES 
    ('abc','bigadmin',1,False,'2024-11-02',10001),
    ('dfg','admindemo_name',1,True,'2024-11-05',10002),
    ('abc','bigadmin',1,True,'2020-12-01',10003),
    ('abc','lych_name',1,True,'2020-12-02',10004),
	('SOPD','user_name',1,False,'2020-12-01',10005),
	('COPD','userdemo_name',1,True,'2020-12-01',10006),
    ('COPD','bigadmin',1,True,'2020-12-01',10007),
	('abc','userdemo_name',1,True,'2020-12-02',10008);\
	
INSERT INTO clinic_source_table(clinic_id,clinic_name,am,date)
VALUES 
    (10001,'abc','false','Monday'),
    (10002,'dfg','false','Monday'),
    (10003,'smg','true','Monday'),
    (10004,'SOPD','true','Monday'),
	(10005,'COPD','false','Monday');
	
CREATE TABLE questionnaire_scheme (
    token VARCHAR(8),
	questionnaire_name VARCHAR(100),
	active BOOLEAN,
	create_date VARCHAR(10),
	modi_date VARCHAR(10),
	content_json json
);