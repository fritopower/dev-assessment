const Teacher = require("../models/teachers.model.js");

// Create and Save a new Teacger
// exports.create = (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//     }

//     // Create a Teacher
//     const teacher = new Teacher({
//         email: req.body.email,
//     });

//     // Save Teacher in the database
//     Teacher.create(teacher, (err, data) => {
//     if (err)
//         res.status(500).send({
//         message:
//             err.message || "Some error occurred while creating the Teacher."
//         });
//     else res.send(data);
//     });
// };

// Retrieve all Teachers from the database.
// exports.findAll = (req, res) => {
//     Teacher.getAll((err, data) => {
//         if (err)
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving teachers."
//             });
//         else res.send(data);
//     });
// };

// Find a single Teacher with a tEmail
// exports.findOne = (req, res) => {
//     Teacher.findById(req.params.tEmail, (err, data) => {
//         if (err) {
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Teacher with email ${req.params.tEmail}.`
//                 });
//             } else {
//                 res.status(500).send({
//                     message: "Error retrieving Teacher with email " + req.params.tEmail
//                 });
//             }
//         } else res.send(data);
//     });
// };

// // Update a Teacher identified by the tEmail in the request
// exports.update = (req, res) => {
//     // Validate Request
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//     }
    
//     Teacher.updateById(
//         req.params.tEmail,
//         new Teacher(req.body),
//         (err, data) => {
//             if (err) {
//                 if (err.kind === "not_found") {
//                     res.status(404).send({
//                         message: `Not found Teacher with email ${req.params.tEmail}.`
//                     });
//                 } else {
//                     res.status(500).send({
//                         message: "Error updating Teacher with email " + req.params.tEmail
//                     });
//                 }
//             } else res.send(data);
//         }
//       );
// };

// // Delete a Teacher with the specified tEmail in the request
// exports.delete = (req, res) => {
//     Teacher.remove(req.params.tEmail, (err, data) => {
//         if (err) {
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Teacher with email ${req.params.tEmail}.`
//                 });
//             } else {
//                 res.status(500).send({
//                     message: "Could not delete Teacher with email " + req.params.tEmail
//                 });
//             }
//         } else res.send({ message: `Teacher was deleted successfully!` });
//       });
// };

// // Delete all Teachers from the database.
// exports.deleteAll = (req, res) => {
//     Teacher.removeAll((err, data) => {
//         if (err)
//           res.status(500).send({
//             message:
//               err.message || "Some error occurred while removing all teachers."
//           });
//         else res.send({ message: `All Teachers were deleted successfully!` });
//       });
// };


// Register students to a particular teacher
exports.registerStudents = (req, res) => {
    var teacher = req.body["teacher"];
    var students = req.body["students"]
    Teacher.registerStudentsFunction(teacher, students, (err, data) => {
        if (err) {
            if (err.kind === "teacher_not_found") {
                res.status(404).send({
                    message: "Teacher doesn't exist!"
                });
            } else if (err.kind === "student_not_found") {
                res.status(404).send({
                    message: "One of students doesn't exist!"
                });
            }
        } else {
            // Nothing is shown, except status code 204.
            // res.send(data) will show data.

            // Data is just JSON with message, teachers and students.
            res.status(204).send(data)
            return;
        }
        // else res.status(204).send({
        //     message: "Success!"
        // });
    })
};

// Get common students under a list of ALL given teachers
exports.commonStudents = (req, res) => {
    var teacherArray = req.query["teacher"];
    var temp = [];
    if (typeof(teacherArray) == 'string') {
        temp.push(teacherArray)
        teacherArray = temp;
    }

    Teacher.findCommonStudents(teacherArray, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "One of the teachers cannot be found or teacher has no students!"
                });
            } else {
                res.status(500).send({
                    message: "One of the teachers' email is invalid"
                });
            }
        } else res.send(data);
    });
};

// Suspend a student (ONLY 1 STUDENT AT A TIME)
exports.suspendStudent = (req, res) => {
    var studentEmail = req.body["student"]
    Teacher.suspendStudent(studentEmail, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: studentEmail + " doesn't exist!"
                })
            } else if (err.kind === "already_suspended") {
                res.status(404).send({
                    message: studentEmail + " already suspended!"
                })
            }else {
                res.status(500).send({
                    message: err.message || "Some error occurred while suspending the student."
                });
            }
        } else {
            // Nothing is shown, except status code 204.
            // res.send(data) will show data.

            // Data is just JSON with message.
            res.status(204).send(data)
            //return;
        }
        // else res.status(204).send({
        //     message: "Success!"
        // });
    })
};

exports.retrieveForNotifications = (req, res) => {
    var teacherEmail = req.body["teacher"]
    var notificationMessage = req.body["notification"]
    Teacher.retrieveForNotifications(teacherEmail, notificationMessage, (err, data) => {
        if (err) {
            if (err.kind === "teacher_not_found") {
                res.status(404).send({
                    message: teacherEmail + " doesn't exist!"
                })
            } else if (err.kind === "already_suspended") {
                res.status(404).send({
                    message: studentEmail + " already suspended!"
                })
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while suspending the student."
                });
            }
        } else {
            // Nothing is shown, except status code 204.
            // res.send(data) will show data.

            // Data is just JSON with message.
            res.send(data)
            //return;
        }
        // else res.status(204).send({
        //     message: "Success!"
        // });
    })
};