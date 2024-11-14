CREATE TABLE company_info (
    siret VARCHAR(14) PRIMARY KEY CHECK (LENGTH(siret) = 14),
    code_ape VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    collective_convention VARCHAR(255)
);

CREATE TABLE users (
    uid VARCHAR(36) PRIMARY KEY,
    civility VARCHAR(11) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    job VARCHAR(100),
    job_department VARCHAR(100),
    remaining_leave_balance DECIMAL(3, 1),
    is_admin BOOLEAN DEFAULT FALSE,
    hire_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    departure_date DATE,
    is_archived BOOLEAN DEFAULT FALSE,
    reset_code VARCHAR(6) DEFAULT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    date_of_birth DATE,
    social_security_number VARCHAR(15) UNIQUE CHECK (LENGTH(social_security_number) = 15),
    contract_type VARCHAR(20) NOT NULL,
    marital_status VARCHAR(15) NOT NULL,
    dependants INT DEFAULT 0,
    company_id VARCHAR(14),
    FOREIGN KEY (company_id) REFERENCES company_info(siret) ON DELETE SET NULL
);

CREATE TABLE leave_requests (
    leave_request_id VARCHAR(16) PRIMARY KEY,
    uid VARCHAR(36) NOT NULL,
    request_status ENUM('approved', 'rejected', 'pending') NOT NULL,
    start_leave_request DATETIME NOT NULL,
    end_leave_request DATETIME NOT NULL,
    request_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    leave_type ENUM('paid', 'unpaid', 'sick', 'maternity', 'other') NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE users_logs (
    log_id VARCHAR(16) PRIMARY KEY,
    uid VARCHAR(36) NOT NULL,
    log_type ENUM('leave', 'profile_update', 'other') NOT NULL,
    log_message TEXT,
    log_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE issue_reports (
    issue_id VARCHAR(36) PRIMARY KEY,
    issue_type ENUM('auth', 'leave', 'payslip', 'other') NOT NULL,
    priority ENUM('average', 'normal', 'high') NOT NULL,
    subject VARCHAR(50),
    message TEXT,
    solved BOOLEAN DEFAULT FALSE,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
