const sql = require("./db.js");

// constructor
const Student = function(student) {
  this.email = student.email;
  this.suspended = student.suspended;
};

Student.create = (newStudent, result) => {
  sql.query("INSERT INTO students SET ?", newStudent, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created student: ", { email: Student.email, ...newStudent });
    result(null, { email: Student.email, ...newStudent });
  });
};

Student.getAll = result => {
  sql.query("SELECT * FROM students", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("students: ", res);
    result(null, res);
  });
};

Student.updateByEmail = (oldEmail, newEmail, result) => {
  sql.query(
    "UPDATE students SET email = ? WHERE email = ?",
    [newEmail, oldEmail],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Student with the email
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated student: ", { email: newEmail, ...student });
      result(null, { email: newEmail, ...student });
    }
  );
};

Student.remove = (email, result) => {
  sql.query("DELETE FROM students WHERE email = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Student with the email
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted student with email: ", email);
    result(null, res);
  });
};

Student.removeAll = result => {
  sql.query("DELETE FROM students", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} students`);
    result(null, res);
  });
};

module.exports = Student;