module.exports = app => {
    const teachers = require("../controllers/teacher.controller.js");
  
    // Register students to a particular teacher
    app.post("/api/register", teachers.registerStudents);

    // Get common students under a list of ALL given teachers
    app.get("/api/commonstudents", teachers.commonStudents);

    // Suspend a student (ONLY 1 STUDENT AT A TIME)
    app.post("/api/suspend", teachers.suspendStudent);

    // Retrieve students that can receive notifications
    app.post("/api/retrievefornotifications", teachers.retrieveForNotifications);
  };