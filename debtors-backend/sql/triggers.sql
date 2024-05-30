CREATE SEQUENCE ac_item_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_item_code_trg BEFORE
    INSERT ON ac_item
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_item_code_seq.nextval;
END;
/

CREATE SEQUENCE ac_uom_code_seq START WITH 1 NOCACHE ORDER;

CREATE OR REPLACE TRIGGER ac_uom_code_trg BEFORE
    INSERT ON ac_uom
    FOR EACH ROW
    WHEN ( new.code IS NULL )
BEGIN
    :new.code := ac_uom_code_seq.nextval;
END;
/