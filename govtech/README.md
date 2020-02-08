# Lye Jun's Submission

## Background
Here are the programmes I have used.
* WampServer
* Postman API
* SQL WorkBench
* Visual Code Studio

Here are the packages I have used.
* express mysql body-parser (via npm install)

Here is the guide I have used to set up the foundational structure.
* https://bezkoder.com/node-js-rest-api-express-mysql/

## Instructions
1. Create a schema called 'moe' with no password    
2. Create the necessary tables and insert the default values from the file 'moe.sql'

## User stories
### 1. As a teacher, I want to register one or more students to a specified teacher.
A teacher can register multiple students. A student can also be registered to multiple teachers.

* Assumption made here will be the value of "students" is always an array even if there are 0 or 1 student.

* Endpoint: `POST /api/register`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
```
{
    "teacher": "teacher2@class2.com"
    "students":
    [
        "Dick@class5.com",
        "Ted@class5.com"
    ]
}
```

### 2. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).

* Endpoint: `GET /api/commonstudents`
* Success response status: HTTP 200
* Request example 1: `GET /api/commonstudents?teacher=teacher1%40class1.com`
* Success response body 1:
```
{
    "students": [
        "peter@class1.com",
        "john@class1.com",
        "simon@class2.com"
    ]
}
```
* Request example 2: `GET /api/commonstudents?teacher=teacher%40class1.com&teacher=teacher2%40class2.com`
* Success response body 2:
```
{
    "students": [
        "simon@class2.com"
    ]
}
```

### 3. As a teacher, I want to suspend a specified student.

* Endpoint: `POST /api/suspend`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
```
{
    "student" : "Ted@class5.com"
}
```

### 4. As a teacher, I want to retrieve a list of students who can receive a given notification.

Assumption made here will be that the mentioned students in the notification message are students found in students table.

A notification consists of:
* the teacher who is sending the notification, and
* the text of the notification itself.

To receive notifications from e.g. 'teacher1@class1.com', a student:
* MUST NOT be suspended,
* AND MUST fulfill *AT LEAST ONE* of the following:
    1. is registered with “teacher1@class1.com"
    2. has been @mentioned in the notification

The list of students retrieved should not contain any duplicates/repetitions.

* Endpoint: `POST /api/retrievefornotifications`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 200
* Request body example 1:
```
{
  "teacher":  "teacher2@class2.com",
  "notification": "Hello students! @Ted@class5.com @Dick@class5.com"
}
```
* Success response body 1:
```
{
    "recipients": [
        "Ted@class5.com",
        "Dick@class5.com",
        "simon@class2.com"
    ]
}
```
In the example above, Ted@class5.com and Dick@class5.com can receive the notification from teacher2@class2.com, regardless whether they are registered to him, because they are @mentioned in the notification text. simon@class2.com however, has to be registered to teacher2@class2.com.
* Request body example 2:
```
{
  "teacher":  "teacher1@class1.com",
  "notification": "Hello students!"
}
```
* Success response body 2:
```
{
    "recipients": [
        "peter@class1.com",
        "john@class1.com",
        "simon@class2.com"
    ]
}
```

## Error Responses
For all the above API endpoints, error responses should:
* have an appropriate HTTP response code
* have a JSON response body containing a meaningful error message:
```
{ "message": "Some meaningful error message" }
```