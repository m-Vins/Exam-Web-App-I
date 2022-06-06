# Exam #12345: "Exam Title"

## Student: s294999 MEZZELA VINCENZO

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

##### Legend

- **`primary key`**
- **not null fields**
- **_optional fields_**

### COURSES

- **`code`**
- **name**
- **credits**
- **_preparatoryCourse_**
- **_maxStudentsNumber_**

### STUDENTS

- **`id`**
- **username**
- **salt**
- **hash**
- **_studyplan_** can be
  1. `part-time`
  2. `full-time`
  3. `NULL` in case the student haven't any studyplan, thus there should be no record in the **STUDY-PLANS** table with the relative **`studentID`**

### STUDYPLANS

- **`studentID`**
- **`courseID`**
- **permanent**

### INCOMPATIBLECOURSES

- **`code_1`**
- **`code_2`**

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
