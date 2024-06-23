create table ac_customer
(
code integer primary key,
name char(150) not null unique,
address varchar(500) not null,
reg_title_1 char(50),
reg_value_1 char(50),
reg_title_2 char(50),
reg_value_2 char(50),
reg_title_3 char(50),
reg_value_3 char(50),
contact_1 char(20),
contact_2 char(20),
contact_3 char(20),
state_code int not null
);

-----Create a sequence------------
CREATE SEQUENCE ac_customer_code_seq START WITH 1 NOCACHE ORDER;

------make state_code column as foreign key------

alter table ac_customer
add CONSTRAINT ac_customer_state_code_fk FOREIGN KEY ( state_code )
REFERENCES ac_state( code );

----------------------------------

create data layer code for (entities.js -- like Unit of Measurement) Customer and CustomerManager (managers.js --- like Unit of Measurement),
in CustomerManager create all CRUD methods

In server/DebtorsAccounting.js map a function to url '/addCustomer'
						     '/updateCustomer'
						     '/removeCustomer'
						     'getCustomerByCode'
						     'getCustomers'


--------------------UI Design---------------------------------

