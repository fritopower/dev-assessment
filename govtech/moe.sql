# Creation of teachers table
CREATE TABLE IF NOT EXISTS `teachers` (
  email varchar(255) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Creation of students table
CREATE TABLE IF NOT EXISTS `students` (
  email varchar(255) NOT NULL PRIMARY KEY,
  suspended boolean NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Creation of register table
CREATE TABLE IF NOT EXISTS `register` (
  tEmail varchar(255) NOT NULL references teachers(email),
  sEmail varchar(255) NOT NULL references students(email)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO students (email, suspended)
VALUES
('peter@class1.com', false),
('john@class1.com', false),
('simon@class2.com', false),
('jane@class3.com', false),
('richard@class4.com', false),
('Ted@class5.com', false),
('Dick@class5.com', false);

INSERT INTO teachers (email)
VALUES
('teacher1@class1.com'), 
('teacher2@class2.com'),
('teacher3@class3.com'),
('teacher4@class4.com'),
('teacher5@class5.com');

INSERT INTO register (tEmail, sEmail)
VALUES
('teacher1@class1.com', 'peter@class1.com'),
('teacher1@class1.com', 'john@class1.com'), 
('teacher1@class1.com', 'simon@class2.com'), 
('teacher2@class2.com', 'simon@class2.com'),
('teacher3@class3.com', 'jane@class3.com'),
('teacher4@class4.com', 'richard@class4.com'),
('teacher5@class5.com', 'Ted@class5.com'),
('teacher5@class5.com', 'Dick@class5.com');

# Check all entries from respective tables
select * from register;
select * from teachers;
select * from students;

# Template for finding a student with email
select * from students where email = 'Ted@class5.com';

# Template for suspending a student
update students set suspended = 0 where email = 'peter@class1.com';

# Template for finding relationship in register table between teacher and student
Select * from register where tEmail = 'teacher2@class5.com' and sEmail = 'Ted@class5.com';

# Template for finding students registered to a particular teacher
Select sEmail from register where tEmail = "teacher1@class1.com";

# Template for checking if a student is suspended
select suspended from students where email = "peter@class1.com";

# Delete entry from register table with the particular teacher and student
delete from register where tEmail = "teacher2@class2.com" and sEmail = "richard@class4.com";