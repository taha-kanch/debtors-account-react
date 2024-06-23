---------------Create customer_trasactions table ------------------
create table ac_customer_transactions (
code int primary key,
customer_code int not null,
total_sales decimal(15,2) not null,
total_receipts decimal(15,2) not null,
opening_balance decimal(15,2) not null
)

-------Create a sequence----------
CREATE SEQUENCE ac_customer_transactions_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_customer_transactions_code_trg BEFORE
    INSERT ON ac_customer_transactions
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_customer_transactions_code_seq.nextval;
END;
/

-------Foreign key-----------
alter table ac_customer_transactions
add CONSTRAINT ac_customer_transactions_customer_code_fk FOREIGN KEY ( customer_code )
REFERENCES ac_customer( code );

-------------------------------------------------------------------------------------
When a customer is added one record should be inserted in customer table
and one record in ac_customer_transaction with total_sales, total_receipts as zero.
-------------------------------------------------------------------------------------
Whenever a new sales perform by inserting record in invoice table, total_amt should
get updated in total_sales of customer_transactions.
Same as when a new receipt inserted amount value should get update in total_receipt
of c_customer_transactions
-------------------------------------------------------------------------------------

----------------Create triggers-----------
----------------ac_invoice----------------
----Insert-----
create or replace trigger ac_invoice_insert after insert on ac_invoice 
for each row
begin
update ac_customer_transactions set total_sales = total_sales + :new.total_amt where
customer_code = :new.customer_code;
end;
/

----Delete-----
create or replace trigger ac_invoice_delete after delete on ac_invoice
for each row
begin
update ac_customer_transactions set total_sales = total_sales - :old.total_amt where
customer_code = :old.customer_code;
end;
/

----Update-----
create or replace trigger ac_invoice_update after update on ac_invoice
for each row
begin
update ac_customer_transactions set total_sales = total_sales - :old.total_amt where 
customer_code = :old.customer_code;
update ac_customer_transactions set total_sales = total_sales + :new.total_amt where
customer_code = :new.customer_code;
end;
/




----------------ac_receipt---------------
----Insert-----
create or replace trigger ac_receipt_insert after insert on ac_receipt
for each row
begin
update ac_customer_transactions set total_receipts = total_receipts + :new.amount where
customer_code = :new.customer_code;
end;
/

-----Delete-----
create or replace trigger ac_receipt_delete after delete on ac_receipt
for each row
begin
update ac_customer_transactions set total_receipts = total_receipts - :old.amount where
customer_code = :old.customer_code;
end;
/

-----Update-----
create or replace trigger ac_receipt_delete after update on ac_receipt
for each row
begin
update ac_customer_transactions set total_receipts = total_receipts - :old.amount where 
customer_code = :old.customer_code;
update ac_customer_transactions set total_receipts = total_receipts + :new.amount where 
customer_code = :new.customer_code;
end;
/

 