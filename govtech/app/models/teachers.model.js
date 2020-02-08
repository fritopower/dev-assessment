const sql = require("./db.js");

// constructor
const Teacher = function(teacher) {
  this.email = teacher.email;
};

// Teacher.create = (newTeacher, result) => {
//   sql.query("INSERT INTO teachers SET ?", newTeacher, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created teacher: ", { email: Teacher.email, ...newTeacher });
//     result(null, { email: Teacher.email, ...newTeacher });
//   });
// };

// Teacher.suspend = (studentEmail) => {
//   sql.query(
//     "UPDATE students SET suspended = ? WHERE email = ?",
//     [true, studentEmail],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Student with the email
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("suspended Student: ", { email: studentEmail, ...student });
//       result(null, { email: studentEmail, ...student });
//     }
//   );
// }

// Teacher.getAll = result => {
//   var response = {teachers: []}
//   sql.query("SELECT * FROM teachers", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("teachers: ", res);
//     for (var i = 0; i < res.length; i++) {
//       response.teachers.push(res[i].email)
//     }
//     result(null, response);
//   });
// };

// Teacher.updateByEmail = (oldEmail, newEmail, result) => {
//   sql.query(
//     "UPDATE teachers SET email = ? WHERE email = ?",
//     [newEmail, oldEmail],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Teacher with the email
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated teacher: ", { email: email, ...teacher });
//       result(null, { email: email, ...teacher });
//     }
//   );
// };

// Teacher.remove = (email, result) => {
//   sql.query("DELETE FROM teachers WHERE email = ?", email, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Teacher with the email
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted teacher with email: ", email);
//     result(null, res);
//   });
// };

// Teacher.removeAll = result => {
//   sql.query("DELETE FROM teachers", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} teachers`);
//     result(null, res);
//   });
// };

// Assumption that input teachers and students already exist
Teacher.registerStudentsFunction = (tEmail, studentsArr, result) => {
  var response = {"message": "Successfully registered!","teacher": tEmail, "students": []}

  sql.query("Select * FROM teachers WHERE email = ?", tEmail, async (err, res) => {
    if (err) {

      console.log("error: ", err);
      result(null, err);
      return;

    } else if (res.length == 0) {

      // Teacher doesn't exist
      result({ kind: "teacher_not_found" }, null);
      return;

    }
    if (res.length != 0) {

      await studentsArr.forEach(async(element) => {
        sql.query("Select * FROM students WHERE email = ?", element, (err, res) => {
          if (err) {

            console.log("error: ", err);
            result(null, err);
            return;

          } else if (res.length == 0) {

            // Student doesn't exist
            result({ kind: "student_not_found" }, null);
            return;

          } else {
            response["students"].push(element)
            if (element == studentsArr[studentsArr.length - 1]) {
              studentsArr.forEach(async(eachStudent) => {
                sql.query("Select * from register where tEmail = ? and sEmail = ?", [tEmail, eachStudent], (err, res) => {

                  // Check if student is registered to teacher
                  // If not registered, then insert
                  if (res.length == 0) {
                    sql.query("INSERT INTO register (tEmail, sEmail) VALUES (?,?)", [tEmail, eachStudent], (err, res) => {
                      if (err) {

                        console.log("error: ", err);
                        result(null, err);
                        return;

                      }
                      
                      if (eachStudent == studentsArr[studentsArr.length -1]) {
                        result(null, response)
                        return;
                      }
                    })
                  } else {
                    if (eachStudent == studentsArr[studentsArr.length -1]) {
                      result(null, response)
                      return;
                    }
                  }
                })
              })
            }
          }
        }) 
      })
    }
  });
}

Teacher.findCommonStudents = (teachersArray, result) => {
  //do arraylist or hash map to count number of studnets
  // if student email appearance is the same as teachersArray length, return that
  var temp = {}
  var response = {"students": [] }

  teachersArray.forEach((element) => {
    sql.query("Select sEmail from register where tEmail = ?", element, async (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      } else if (res.length == 0) {
        // not found Teacher with the email
        result({ kind: "not_found" }, null);
        return;
      } else {

        if (res.length != 0) {
          for (var i = 0; i < res.length; i++) {
            var student = res[i]["sEmail"]
            if (temp[student] == undefined) {
              temp[student] = 1
            } else {
              temp[student] = temp[student] + 1;
            }
          }
          if (element == teachersArray[teachersArray.length - 1]) {
            for (var key in temp) {
              var value = temp[key];
              if (value == teachersArray.length) {
                response["students"].push(key)
              }
            }
            result(null, response);
            return;
          }
        }
      }
    });
  })
}

Teacher.suspendStudent = (studentEmail, result) => {
  var response = {"message": ""};

  sql.query("Select * FROM students WHERE email = ?", studentEmail, async (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;

    } else if (res.length == 0) {

      // not found Student with the email
      result({ kind: "not_found" }, null);
      return;

    } else if (res.length != 0) {
      var student = res[0]["email"];

      // 0 means false, 1 means true
      var suspendedStatus = res[0]["suspended"]

      if (suspendedStatus == 1) {

        response["message"] = "Student is already suspended."
        console.log(response)
        result({ kind: "already_suspended"}, null);
        return;

      } else {
        sql.query("Update students set suspended = 1 where email = ?", studentEmail, async (err, res) => {
          var tempMessage = studentEmail + " has been suspended successfully."
          response["message"] = tempMessage;
          console.log(tempMessage)
          result(null, response);
          return;
        })
      }
    }
  })
}

Teacher.retrieveForNotifications = (teacherEmail, notificationMessage, result) => {
  var response = {"recipients": []};
  
  // email, suspendedStatus
  // 0 false, 1 true
  var studentObject = {"students":[]}

  sql.query("Select * FROM teachers WHERE email = ?", teacherEmail, async (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;

    } else if (res.length == 0) {
      // not found Teacher with the email
      result({ kind: "teacher_not_found" }, null);
      return;

    } else if (res.length != 0) {
      var teacher = res[0]["email"];
      var studentsArray = []
      var atIndex = 0;
      var spaceIndex = 0;
      var tempStudentEmail = ""
      //console.log(notificationMessage);
      if (notificationMessage.indexOf("@") != -1) {
        while (atIndex != -1) {
          atIndex = notificationMessage.indexOf("@", atIndex);
          spaceIndex = notificationMessage.indexOf(" ", atIndex);
          if (spaceIndex == -1) {
            tempStudentEmail = notificationMessage.substring(atIndex + 1);
            if (studentObject["students"].includes(tempStudentEmail) == false) {
              studentObject["students"].push(tempStudentEmail)
            }
            atIndex = -1
          } else {
            tempStudentEmail = notificationMessage.substring(atIndex + 1, spaceIndex)
            if (studentObject["students"].includes(tempStudentEmail) == false) {
              studentObject["students"].push(tempStudentEmail)
            }
            atIndex = notificationMessage.indexOf("@", spaceIndex);
            spaceIndex = notificationMessage.indexOf(" ", atIndex);
          }
        }
      }

      sql.query("Select sEmail FROM register WHERE tEmail = ?", teacherEmail, async (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
    
        } else if (res.length == 0) {
          // Teacher has no student registered
          // Result the tagged students if have
          result(null, studentObject);
          return;
        } else {
          for (var i = 0; i < res.length; i++) {
            //console.log(res[i]["sEmail"]);
            if (studentObject["students"].includes(res[i]["sEmail"]) == false) {
              studentObject["students"].push(res[i]["sEmail"]);
            }
          }
          
          console.log(studentObject)
          var studentObjectLength = studentObject["students"].length;
          
          studentObject["students"].forEach(async(tempStudent) => {
            sql.query("Select suspended from students where email = ?", tempStudent, async (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
              } else {
                if (res[0]["suspended"] == 0) {
                  response["recipients"].push(tempStudent);
                }

                if (tempStudent == studentObject["students"][studentObjectLength - 1]) {
                  console.log(response)
                  result(null, response);
                  return;
                }
              }
            })
          })

        }
      })
    }
  })
}
module.exports = Teacher;