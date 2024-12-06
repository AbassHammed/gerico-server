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
    job_title VARCHAR(100),
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

CREATE TABLE issue_reports (
    issue_id VARCHAR(36) PRIMARY KEY,
    issue_type VARCHAR(255) NOT NULL,
    priority VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    solved BOOLEAN DEFAULT FALSE,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_security_thresholds (
	threshold_id VARCHAR(11) PRIMARY KEY,
	threshold_name VARCHAR(50) NOT NULL,
	min_value DECIMAL(10, 2) NOT NULL,
	max_value DECIMAL(10, 2),
	is_ceiling BOOLEAN DEFAULT FALSE
);

CREATE TABLE deductions (
	deduction_id VARCHAR(16) PRIMARY KEY,
	deduction_type VARCHAR(100) NOT NULL,
	deduction_name VARCHAR(100) NOT NULL,
	part_salarial DECIMAL(8, 6) NOT NULL,
	part_patronal DECIMAL(8, 6) NOT NULL,
	threshold_id VARCHAR(16),
	FOREIGN KEY (threshold_id) REFERENCES social_security_thresholds(threshold_id) ON DELETE CASCADE
);

CREATE TABLE pay_slips (
	pid VARCHAR(36) PRIMARY KEY,
	uid VARCHAR(36) NOT NULL,
	gross_salary DECIMAL(20, 2) NOT NULL,
	net_salary DECIMAL(20, 2) NOT NULL,
	start_period DATE NOT NULL,
	end_period DATE NOT NULL,
	pay_date DATE NOT NULL,
	total_hours_worked JSON DEFAULT NULL,
	hourly_rate DECIMAL(5, 2),
	path_to_pdf TEXT,
	FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);
