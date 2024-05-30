create table ac_state
(
code integer primary key,
name char(50) not null unique,
alpha_code char(2) not null unique
);
------------------------------------
I have copy/pasted the names of states and their code with alpha_code in a file name as states.data
Now you write a program that will read a line from file and will prepare that will read line from file and
will prepare the required sql statement to insert one record per line  in our ac_state table.

Andaman and Nicobar Islands 35 AN
Andhra Pradesh 28 AP
Andhra Pradesh (New) 37 AD
Arunachal Pradesh 12 AR
Assam 18 AS
Bihar 10 BH
Chandigarh 04 CH
Chattisgarh 22 CT
Dadra and Nagar Haveli 26 DN
Daman and Diu 25 DD
Delhi 07 DL
Goa 30 GA
Gujarat 24 GJ
Haryana 06 HR
Himachal Pradesh 02 HP
Jammu and Kashmir 01 JK
Jharkhand 20 JH
Karnataka 29 KA
Kerala 32 KL
Lakshadweep Islands 31 LD
Madhya Pradesh 23 MP
Maharashtra 27 MH
Manipur 14 MN
Meghalaya 17 ME
Mizoram 15 MI
Nagaland 13 NL
Odisha 21 OR
Pondicherry 34 PY
Punjab 03 PB
Rajasthan 08 RJ
Sikkim 11 SK
Tamil Nadu 33 TN
Telangana 36 TS
Tripura 16 TR
Uttar Pradesh 09 UP
Uttarakhand 05 UT
West Bengal 19 WB

---------------------------
The following table will contain only one record information about the trader who is using this application

create table ac_trader
(
code integer primary key,
name char(150) not null unique,
address varchar(500) not null,
gst_num char(20) not null unique,
reg_title_1 char(50), //other document name
reg_value_1 char(50), // Its value
reg_title_2 char(50), //other document name
reg_value_2 char(50), // Its value
reg_title_3 char(50), //other document name
reg_value_3 char(50), // Its value,
contact_1 char(20),
contact_2 char(20),
contact_3 char(20),
state_code int not null
);

make state_code column as foreign key

alter table ac_trader
add CONSTRAINT ac_trader_state_code_fk FOREIGN KEY ( state_code )
REFERENCES ac_state( code );

----------------------------------

create data layer code for (entities.js -- like Unit of Measurement) State and StateManager (managers.js --- like Unit of Measurement),
in StateManager just create getAll method, getByCode method, getByAlphaCode method (no need for add, update & delete methods).

In server/DebtorsAccounting.js map a function to url '/getStates'
						     '/getStateByCode'
						     '/getStateByAlphaCode'

---------------------------------------------------------------------------------------------------------------------------------------- 

create data layer code for (entities.js -- like Unit of Measurement) Trader and TraderManager (managers.js --- like Unit of Measurement),
in TraderManager just create get method whose details are as follows:
Note: ac_trader table is supposed to contain only one record.
get method should check, if record exists if not
return empty object
else return filled object

One more method name as update
Note: no add, remove, get all are required
in update method: If record does not exist in ac_trader table then insert a record
if exists, update the records


In server/DebtorsAccounting.js map a function to url '/getTrader'
						     '/updateTrader'

----------------------------------------------------------------------------------------------------------------------------------------


