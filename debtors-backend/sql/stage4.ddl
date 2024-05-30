-----------Invoice Module------------

--------------------ac_invoice------------------

CREATE TABLE ac_invoice
(
code INT PRIMARY KEY,
customer_code INT NOT NULL,
total_items INT NOT NULL,
taxable_amt DECIMAL NOT NULL,
igst_amt DECIMAL NOT NULL,
cgst_amt DECIMAL NOT NULL,
sgst_amt DECIMAL NOT NULL,
total_amt DECIMAL NOT NULL,
invoice_date date default SYSDATE
);

-------Create a sequence----------
CREATE SEQUENCE ac_invoice_code_seq START WITH 1 NOCACHE ORDER;

-------Foreign key-----------

-------customer_code-------
alter table ac_invoice
add CONSTRAINT ac_invoice_customer_code_fk FOREIGN KEY ( customer_code )
REFERENCES ac_customer( code );

--------------------ac_invoice_items------------------

CREATE TABLE ac_invoice_items 
(
code INT PRIMARY KEY,
item_code int NOT NULL,
qty INT NOT NULL,
taxable_amt DECIMAL NOT NULL,
igst_amt DECIMAL NOT NULL,
cgst_amt DECIMAL NOT NULL,
sgst_amt DECIMAL NOT NULL,
total_amt DECIMAL NOT NULL,
uom_code int NOT NULL,
invoice_number int NOT NULL,
);

-------Create a sequence----------
CREATE SEQUENCE ac_invoice_items_code_seq START WITH 1 NOCACHE ORDER;

-------Foreign key-----------

-------item_code-------
alter table ac_invoice_items
add CONSTRAINT ac_invoice_items_item_code_fk FOREIGN KEY ( item_code )
REFERENCES ac_item( code );

------uom_code------
alter table ac_invoice_items
add CONSTRAINT ac_invoice_uom_code_fk FOREIGN KEY ( uom_code )
REFERENCES ac_uom( code );

------invoice_code------
alter table ac_invoice_items
add CONSTRAINT ac_invoice_items_invoice_code_fk FOREIGN KEY ( invoice_number )
REFERENCES ac_invoice( code );

-----------------ac_invoice_additional_charges---------------

CREATE TABLE ac_invoice_additional_charges
(
code INT PRIMARY KEY,
description char(500) NOT NULL,
taxable_amt DECIMAL NOT NULL,
igst_amt DECIMAL NOT NULL,
cgst_amt DECIMAL NOT NULL,
sgst_amt DECIMAL NOT NULL,
total_amt DECIMAL NOT NULL,
invoice_number int NOT NULL
);

-------Create a sequence----------
CREATE SEQUENCE ac_invoice_additional_charges_code_seq START WITH 1 NOCACHE ORDER;

-------Foreign key--------

-------invoice_code-------
alter table ac_invoice_additional_charges
add CONSTRAINT ac_invoice_additional_charges_invoice_code_fk FOREIGN KEY ( invoice_number )
REFERENCES ac_invoice( code );