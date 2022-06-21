BEGIN TRANSACTION;
DROP TABLE IF EXISTS "studyPlans";
DROP TABLE IF EXISTS "incompatibleCourses";
DROP TABLE IF EXISTS "students";
DROP TABLE IF EXISTS "courses";

CREATE TABLE IF NOT EXISTS "studyPlans" (
	"studentID"	INTEGER,
	"courseID"	TEXT,
	PRIMARY KEY("courseID","studentID"),
	FOREIGN KEY("courseID") REFERENCES "courses"("code"),
	FOREIGN KEY("studentID") REFERENCES "students"("id")
);

CREATE TABLE IF NOT EXISTS "courses" (
	"code"	TEXT,
	"name"	TEXT NOT NULL,
	"credits"	INTEGER NOT NULL,
	"preparatoryCourse"	TEXT,
	"maxStudentsNumber"	INTEGER,
	PRIMARY KEY("code")
);

CREATE TABLE IF NOT EXISTS "students" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	"hash"	TEXT NOT NULL,
	"studyplan"	TEXT,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "incompatibleCourses" (
	"code_1"	TEXT,
	"code_2"	TEXT,
	FOREIGN KEY("code_1") REFERENCES "courses"("code"),
	FOREIGN KEY("code_2") REFERENCES "courses"("code"),
	PRIMARY KEY("code_1","code_2")
);

INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('02GOLOV','Architetture dei sistemi di elaborazione',12,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('02LSEOV','Computer architectures',12,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01SQJOV','Data Science and Database Technology',8,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01SQMOV','Data Science e Tecnologie per le Basi di Dati',8,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01SQLOV','Database systems',8,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01OTWOV','Computer network technologies and services',6,NULL,3);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('02KPNOV','Tecnologie e servizi di rete',6,NULL,3);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01TYMOV','Information systems security services',12,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01UDUOV','Sicurezza dei sistemi informativi',12,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('05BIDOV','Ingegneria del software',6,'02GOLOV',NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('04GSPOV','Software engineering',6,'02LSEOV',NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01UDFOV','Applicazioni Web I',6,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01TXYOV','Web Applications I',6,NULL,3);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01TXSOV','Web Applications II',6,'01TXYOV',NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('02GRSOV','Programmazione di sistema',6,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01NYHOV','System and device programming',6,NULL,3);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01SQOOV','Reti Locali e Data Center',6,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01TYDOV','Software networking',7,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('03UEWOV','Challenge',5,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01URROV','Computational intelligence',6,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01OUZPD','Model based software design',4,NULL,NULL);
INSERT INTO "courses" ("code","name","credits","preparatoryCourse","maxStudentsNumber") VALUES ('01URSPD','Internet Video Streaming',6,NULL,2);




INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('02GOLOV','02LSEOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('01SQJOV','01SQMOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('01SQJOV','01SQLOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('01SQMOV','01SQLOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('01OTWOV','02KPNOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('02KPNOV','01UDUOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('05BIDOV','04GSPOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('01UDFOV','01TXYOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('01TXYOV','01UDFOV');
INSERT INTO "incompatibleCourses" ("code_1","code_2") VALUES ('02GRSOV','01NYHOV');



INSERT INTO "students" ("id","username","salt","hash","studyplan") VALUES (1,'test1@uni.edu','80c6bd19d02ade025ff4618870d007ba','434458142bf7b4cff5a1b7edebd6416b0586f788e4e0221c1c0e675f8505243970a1398b40a1ca44c4e7c89cb4247ae8794ecd47d022cdab5f1554092e362d20','part-time');
INSERT INTO "students" ("id","username","salt","hash","studyplan") VALUES (2,'test2@uni.edu','80c6bd19d02ade025ff4618870d007ba','434458142bf7b4cff5a1b7edebd6416b0586f788e4e0221c1c0e675f8505243970a1398b40a1ca44c4e7c89cb4247ae8794ecd47d022cdab5f1554092e362d20','full-time');
INSERT INTO "students" ("id","username","salt","hash","studyplan") VALUES (3,'test3@uni.edu','80c6bd19d02ade025ff4618870d007ba','434458142bf7b4cff5a1b7edebd6416b0586f788e4e0221c1c0e675f8505243970a1398b40a1ca44c4e7c89cb4247ae8794ecd47d022cdab5f1554092e362d20','full-time');
INSERT INTO "students" ("id","username","salt","hash","studyplan") VALUES (4,'test4@uni.edu','80c6bd19d02ade025ff4618870d007ba','434458142bf7b4cff5a1b7edebd6416b0586f788e4e0221c1c0e675f8505243970a1398b40a1ca44c4e7c89cb4247ae8794ecd47d022cdab5f1554092e362d20','part-time');
INSERT INTO "students" ("id","username","salt","hash","studyplan") VALUES (5,'test5@uni.edu','80c6bd19d02ade025ff4618870d007ba','434458142bf7b4cff5a1b7edebd6416b0586f788e4e0221c1c0e675f8505243970a1398b40a1ca44c4e7c89cb4247ae8794ecd47d022cdab5f1554092e362d20',NULL);

INSERT INTO "studyPlans" ("studentID","courseID") VALUES (1,'01UDFOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (1,'03UEWOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (1,'01URROV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (1,'01OTWOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (1,'01NYHOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01UDFOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'02GOLOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'03UEWOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01URROV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01OTWOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01SQJOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01TYMOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'05BIDOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01URSPD');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01OUZPD');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (2,'01NYHOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01OTWOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01NYHOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01TXYOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01TXSOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01TYDOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01UDUOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01SQOOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01SQMOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01TYMOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (3,'01URSPD');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (4,'01TYDOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (4,'01OUZPD');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (4,'01TYMOV');
INSERT INTO "studyPlans" ("studentID","courseID") VALUES (4,'01SQLOV');

COMMIT;
