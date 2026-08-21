CREATE DATABASE hr_flow;

USE hr_flow;

CREATE TABLE `hr_flow`.`departments` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE INDEX `department_name_UNIQUE` (`department_name` ASC) VISIBLE);

INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('1', 'Development');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('2', 'HR');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('3', 'QA');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('4', 'Sales');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('5', 'Marketing');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('6', 'Design');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('7', 'IT');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('8', 'Finance');
INSERT INTO `hr_flow`.`departments` (`department_id`, `department_name`) VALUES ('9', 'Support');


CREATE TABLE `hr_flow`.`employees` (
  `employees_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `position` VARCHAR(100) NOT NULL,
  `department_id` INT NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `employment_history` LONGTEXT NOT NULL,
  `contact` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`employees_id`),
  UNIQUE INDEX `first_name_UNIQUE` (`first_name` ASC) VISIBLE,
  UNIQUE INDEX `last_name_UNIQUE` (`last_name` ASC) VISIBLE,
  UNIQUE INDEX `contact_UNIQUE` (`contact` ASC) VISIBLE,
  INDEX `fk_department_id_idx` (`department_id` ASC) VISIBLE,
  CONSTRAINT `fk_department_id`
    FOREIGN KEY (`department_id`)
    REFERENCES `hr_flow`.`departments` (`department_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('1', 'Sibongile', 'Nkosi', 'Software Engineer', '1', '70000', 'Joined in 2015, promoted to Senior in 2018', 'sibongile.nkosi@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('2', 'Lungile', 'Moyo', 'HR Manager', '2', '80000', 'Joined in 2013, promoted to Senior in 2017', 'lungile.moyo@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('3', 'Thabo', 'Molefe', 'Quality', '3', '55000', 'Joined in 2018', 'thabo.molefe@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('4', 'Keshav', 'Naidoo', 'Sales', '4', '60000', 'Joined in 2020', 'keshav.naidoo@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('5', 'Zanele', 'Khumalo', 'Marketing', '5', '58000', 'Joined in 2019', 'zanele.khumalo@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('6', 'Sipho', 'Zulu', 'UI/UX Designer', '6', '65000', 'Joined in 2016', 'sipho.zulu@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('7', 'Naledi', 'Moeketsi', 'DevOps', '7', '72000', 'Joined in 2017', 'naledi.moeketsi@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('8', 'Farai', 'Gumbo', 'Content', '5', '56000', 'Joined in 2021', 'farai.gumbo@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('9', 'Karabo', 'Dlamini', 'Accountant', '8', '62000', 'Joined in 2018', 'karabo.dlamini@moderntech.com');
INSERT INTO `hr_flow`.`employees` (`employees_id`, `first_name`, `last_name`, `position`, `department_id`, `salary`, `employment_history`, `contact`) VALUES ('10', 'Fatima', 'Patel', 'Customer Support', '9', '58000', 'Joined in 2016', 'fatima.patel@moderntech.com');


CREATE TABLE `hr_flow`.`attendance` (
  `attendance_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `attendance_date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent') NOT NULL,
  PRIMARY KEY (`attendance_id`),
  INDEX `fk_employee_id_idx` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `fk_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `hr_flow`.`employees` (`employees_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

USE hr_flow;
INSERT INTO attendance (employee_id,
attendance_date, status)
VALUES
(1, '2025-07-25', 'Present'),
(1, '2025-07-26', 'Absent'),
(1, '2025-07-27', 'Present'),
(1, '2025-07-28', 'Present'),
(1, '2025-07-29', 'Present'),
(2, '2025-07-25', 'Present'),
(2, '2025-07-26', 'Present'),
(2, '2025-07-27', 'Absent'),
(2, '2025-07-28', 'Present'),
(2, '2025-07-29', 'Present'),
(3, '2025-07-25', 'Present'),
(3, '2025-07-26', 'Present'),
(3, '2025-07-27', 'Present'),
(3, '2025-07-28', 'Absent'),
(3, '2025-07-29', 'Present'),
(4, '2025-07-25', 'Absent'),
(4, '2025-07-26', 'Present'),
(4, '2025-07-27', 'Present'),
(4, '2025-07-28', 'Present'),
(4, '2025-07-29', 'Present'),
(5, '2025-07-25', 'Present'),
(5, '2025-07-26', 'Present'),
(5, '2025-07-27', 'Absent'),
(5, '2025-07-28', 'Present'),
(5, '2025-07-29', 'Present'),
(6, '2025-07-25', 'Present'),
(6, '2025-07-26', 'Present'),
(6, '2025-07-27', 'Absent'),
(6, '2025-07-28', 'Present'),
(6, '2025-07-29', 'Present'),
(7, '2025-07-25', 'Present'),
(7, '2025-07-26', 'Present'),
(7, '2025-07-27', 'Present'),
(7, '2025-07-28', 'Absent'),
(7, '2025-07-29', 'Present'),
(8, '2025-07-25', 'Present'),
(8, '2025-07-26', 'Absent'),
(8, '2025-07-27', 'Present'),
(8, '2025-07-28', 'Present'),
(8, '2025-07-29', 'Present'),
(9, '2025-07-25', 'Present'),
(9, '2025-07-26', 'Present'),
(9, '2025-07-27', 'Present'),
(9, '2025-07-28', 'Absent'),
(9, '2025-07-29', 'Present'),
(10, '2025-07-25', 'Present'),
(10, '2025-07-26', 'Present'),
(10, '2025-07-27', 'Absent'),
(10, '2025-07-28', 'Present'),
(10, '2025-07-29', 'Present');


CREATE TABLE `hr_flow`.`leave_request` (
  `leave_id` INT NOT NULL AUTO_INCREMENT,
  `employees_id` INT NOT NULL,
  `leave_date` DATE NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `status` ENUM('Approved', 'Pending', 'Denied') NOT NULL,
  PRIMARY KEY (`leave_id`),
  INDEX `fk_employee_id_idx` (`employees_id` ASC) VISIBLE,
  CONSTRAINT `fk_employees_id`
    FOREIGN KEY (`employees_id`)
    REFERENCES `hr_flow`.`employees` (`employees_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


INSERT INTO leave_request (employees_id,
leave_date, reason, status)
VALUES
(1, '2025-07-22', 'Sick Leave', 'Approved'),
(1, '2024-12-01', 'Personal', 'Pending'),
(2, '2025-07-15', 'Family Responsibility', 'Denied'),
(2, '2024-12-02', 'Vacation', 'Approved'),
(3, '2025-07-10', 'Medical Appointment',
'Approved'),
(3, '2024-12-05', 'Personal', 'Pending'),
(4, '2025-07-20', 'Bereavement', 'Approved'),
(5, '2024-12-01', 'Childcare', 'Pending'),
(6, '2025-07-18', 'Sick Leave', 'Approved'),
(7, '2025-07-22', 'Vacation', 'Pending'),
(8, '2024-12-02', 'Medical Appointment',
'Approved'),
(9, '2025-07-19', 'Childcare', 'Denied'),
(10, '2024-12-03', 'Vacation', 'Pending');


CREATE TABLE `hr_flow`.`payroll` (
  `payroll_id` INT NOT NULL AUTO_INCREMENT,
  `employees_id` INT NOT NULL,
  `hours_worked` DECIMAL(6,2) NOT NULL,
  `leave_deductions` DECIMAL(6,2) NOT NULL,
  `final_salary` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`payroll_id`),
  INDEX `fk_employees_id_idx` (`employees_id` ASC) VISIBLE,
  CONSTRAINT `fk_employee_id_1`
    FOREIGN KEY (`employees_id`)
    REFERENCES `hr_flow`.`employees` (`employees_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
     
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('1', '160', '8', '69500');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('2', '150', '10', '79000');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('3', '170', '4', '54800');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('4', '165', '6', '59700');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('5', '158', '5', '57850');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('6', '168', '2', '64800');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('7', '175', '3', '71800');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('8', '160', '0', '56000');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('9', '155', '5', '61500');
INSERT INTO `hr_flow`.`payroll` (`employees_id`, `hours_worked`, `leave_deductions`, `final_salary`) VALUES ('10', '162', '4', '57750');

CREATE TABLE `hr_flow`.`performance` (
  `performance_id` INT NOT NULL AUTO_INCREMENT,
  `employees_id` INT NOT NULL,
  `performance_score` DECIMAL(5,2) NOT NULL,
  `goal_completion` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`performance_id`),
  INDEX `fk_employees_id_2_idx` (`employees_id` ASC) VISIBLE,
  CONSTRAINT `fk_employees_id_2`
    FOREIGN KEY (`employees_id`)
    REFERENCES `hr_flow`.`employees` (`employees_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('1', '1', '92', '94');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('2', '2', '87', '88');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('3', '3', '84', '82');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('4', '4', '78', '74');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('5', '5', '90', '91');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('6', '6', '81', '79');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('7', '7', '95', '96');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('8', '8', '76', '72');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('9', '9', '88', '86');
INSERT INTO `hr_flow`.`performance` (`performance_id`, `employees_id`, `performance_score`, `goal_completion`) VALUES ('10', '10', '83', '84');


CREATE TABLE `hr_flow`.`settings` (
  `settings_id` INT NOT NULL AUTO_INCREMENT,
  `company_name` VARCHAR(150) NOT NULL,
  `hr_contact_email` VARCHAR(150) NOT NULL,
  `notification_enabled` TINYINT NOT NULL,
  `dark_mode_enabled` TINYINT NOT NULL,
  PRIMARY KEY (`settings_id`),
  UNIQUE INDEX `company_name_UNIQUE` (`company_name` ASC) VISIBLE,
  UNIQUE INDEX `hr_contact_email_UNIQUE` (`hr_contact_email` ASC) VISIBLE);

INSERT INTO `hr_flow`.`settings` (`settings_id`, `company_name`, `hr_contact_email`, `notification_enabled`, `dark_mode_enabled`) VALUES ('1', 'ModernTech Solutions', 'hr@moderntech.com', '1', '0');

CREATE DATABASE IF NOT EXISTS hrflow_database;
USE hrflow_database;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee', 'manager', 'hr') NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;
