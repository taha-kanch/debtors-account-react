-----------Receipt Module------------

--------------------ac_receipt------------------

CREATE TABLE ac_receipt
(
code INT PRIMARY KEY,
customer_code INT NOT NULL,
amount DECIMAL NOT NULL,
narration VARCHAR(500),
receipt_date date NOT NULL
);

-------Create a sequence----------
CREATE SEQUENCE ac_receipt_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_receipt_code_trg BEFORE
    INSERT ON ac_receipt
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_receipt_code_seq.nextval;
END;
/

-------Foreign key-----------

-------customer_code-------
alter table ac_receipt
add CONSTRAINT ac_receipt_customer_code_fk FOREIGN KEY ( customer_code )
REFERENCES ac_customer( code );


