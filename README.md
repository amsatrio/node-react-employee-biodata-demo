# Node React Employment Biodata Demo

## database
```sql
create database db-edi;
use `db-edi`;

create table users (
	id bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	email varchar(100) unique not null,
	password varchar (100) not null,
	role int not null default 1
);

create table biodata (
	id bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	position varchar(100) not null,
	name varchar(100) not null,
	ktp varchar(100),
	dob datetime,
	pob varchar(100),
	gender varchar(32),
	religion varchar(100),
	blood_type varchar(5),
	marital_status varchar(64),
	address_ktp text,
	address text,
	email varchar(100),
	phone_number varchar(18),
	closest_person varchar(100),
	skills text,
	willing_to_be_placed varchar(12),
	expected_salary varchar(100)
);

create table education_history (
	id bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	biodata_id bigint not null,
	last_education varchar(255),
	institution varchar(255),
	major varchar(255),
	graduation_year int,
	ipk double
);

create table course_history (
	id bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	biodata_id bigint not null,
	course_name varchar(255),
	is_sertificated varchar(18),
	year varchar(255)
);

create table employment_history (
	id bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	biodata_id bigint not null,
	company_name varchar(255),
	last_position varchar(255),
	last_salary varchar(255),
	year varchar(255)
);

-- create admin user
insert into users (email, password, role)
values 
('m@m.m', '$2b$10$WABbJpFf8nvNZFZcHdzCOuOUJ3jRhp8mXMSxIcbi0f0qi/7P4v.hes', 0);

```