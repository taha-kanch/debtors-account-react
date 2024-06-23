CREATE SEQUENCE ac_invoice_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_invoice_code_trg BEFORE
    INSERT ON ac_invoice
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_invoice_code_seq.nextval;
END;
/

CREATE SEQUENCE ac_invoice_items_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_invoice_items_code_trg BEFORE
    INSERT ON ac_invoice_items
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_invoice_items_code_seq.nextval;
END;
/

CREATE SEQUENCE ac_invoice_additional_charges_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_invoice_additional_charges_code_trg BEFORE
    INSERT ON ac_invoice_additional_charges
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_invoice_additional_charges_code_seq.nextval;
END;
/
