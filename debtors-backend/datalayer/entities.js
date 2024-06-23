class UnitOfMeasurement {
constructor(code, name) {
this.code = code;
this.name = name;
}

getCode() {
return this.code;
}

getName() {
return this.name
}

}

class Item {

constructor(code, name, hsnCode, cgst, sgst, igst, unitOfMeasurement, is_deleted) {
this.code = code;
this.name = name;
this.hsn_code = hsnCode;
this.cgst = cgst;
this.sgst = sgst;
this.igst = igst;
this.unitOfMeasurements = unitOfMeasurement;
this.is_deleted = is_deleted;
}

getCode() {
return this.code;
}

getName() {
return this.name;
}

getHSNCode() {
return this.hsnCode;
}

getCGST() {
return this.cgst;
}

getSGST() {
return this.sgst;
}

getIGST() {
return this.igst;
}

getUnitOfMeasurement() {
return this.unitOfMeasurement;
}

}

class State {

constructor(code, name, alpha_code) {
this.code = code;
this.name = name;
this.alpha_code = alpha_code;
}

getCode() {
return this.code;
}

getName() {
return this.name;
}

getAlphaCode() {
return this.alpha_code;
}

}


class Trader {

constructor(code, name, address, gst_num, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code, bank_account_branch_name, bank_account_num, bank_account_ifsc, bank_account_name) {
this.code = code;
this.name = name;
this.address = address;
this.gst_num = gst_num;
this.reg_title_1 = reg_title_1;
this.reg_value_1 = reg_value_1;
this.reg_title_2 = reg_title_2;
this.reg_value_2 = reg_value_2;
this.reg_title_3 = reg_title_3;
this.reg_value_3 = reg_value_3;
this.contact_1 = contact_1;
this.contact_2 = contact_2;
this.contact_3 = contact_3;
this.state_code = state_code;
this.bank_account_name = bank_account_name;
this.bank_account_num = bank_account_num;
this.bank_account_branch_name = bank_account_branch_name;
this.bank_account_ifsc = bank_account_ifsc;
}

getCode() {
return this.code;
}

getName() {
return this.name;
}

getAddress() {
return this.address;
}

getGstNum() {
return this.gst_num;
}

getRegTitle1() {
return this.reg_title_1;
}

getRegValue1() {
return this.reg_value_1;
}

getRegTitle2() {
return this.reg_title_2;
}

getRegValue2() {
return this.reg_value_2;
}

getRegTitle3() {
return this.reg_title_3;
}

getRegValue3() {
return this.reg_value_3;
}

getContact1() {
return this.contact_1;
}

getContact2() {
return this.contact_2;
}

getContact3() {
return this.contact_3;
}

getStateCode() {
return this.state_code;
}

getBankAccountName() {
return this.bank_account_name;
}

getBankAccountNumber() {
return this.bank_account_num;
}

getBankAccountBranchName() {
return this.bank_account_branch_name;
}

getBankAccountIFSC() {
return this.bank_account_ifsc;
}

}

class Customer {

constructor(code, name, address, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code) {
this.code = code;
this.name = name;
this.address = address;
this.reg_title_1 = reg_title_1;
this.reg_value_1 = reg_value_1;
this.reg_title_2 = reg_title_2;
this.reg_value_2 = reg_value_2;
this.reg_title_3 = reg_title_3;
this.reg_value_3 = reg_value_3;
this.contact_1 = contact_1;
this.contact_2 = contact_2;
this.contact_3 = contact_3;
this.state_code = state_code;
}

getCode() {
return this.code;
}

getName() {
return this.name;
}

getAddress() {
return this.address;
}

getRegTitle1() {
return this.reg_title_1;
}

getRegValue1() {
return this.reg_value_1;
}

getRegTitle2() {
return this.reg_title_2;
}

getRegValue2() {
return this.reg_value_2;
}

getRegTitle3() {
return this.reg_title_3;
}

getRegValue3() {
return this.reg_value_3;
}

getContact1() {
return this.contact_1;
}

getContact2() {
return this.contact_2;
}

getContact3() {
return this.contact_3;
}

getStateCode() {
return this.state_code;
}

}

class Invoice {

constructor(code, customer_code, total_items, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, items, additional_charges, invoice_date) {
this.code = code;
this.customer_code = customer_code;
this.total_items = total_items;
this.taxable_amt = taxable_amt;
this.igst_amt = igst_amt;
this.cgst_amt = cgst_amt;
this.sgst_amt = sgst_amt;
this.total_amt = total_amt;
this.invoice_date = invoice_date;
this.items = items;
this.additional_charges = additional_charges;
}

getCode() {
return this.code;
}

getCustomerCode() {
return this.customer_code;
}

getTotalItems() {
return this.total_items;
}

getTaxableAmt() {
return this.taxable_amt;
}

getIGSTAmt() {
return this.igst_amt;
}

getCGSTAmt() {
return this.cgst_amt;
}

getSGSTAmt() {
return this.sgst_amt;
}

getTotalAmt() {
return this.total_amt;
}

getInvoiceDate() {
return this.invoice_date;
}

getItems() {
return this.items;
}

getAdditionalCharges() {
return this.additional_charges;
}

}

class InvoiceItem {

constructor(code, item_code, price, qty, taxable_amt, igst_amt, sgst_amt, cgst_amt, total_amt, uom_code, invoice_number) {
this.code = code;
this.item_code = item_code;
this.price = price;
this.qty = qty;
this.taxable_amt = taxable_amt;
this.igst_amt = igst_amt;
this.cgst_amt = cgst_amt;
this.sgst_amt = sgst_amt;
this.total_amt = total_amt;
this.uom_code = uom_code;
this.invoice_number = invoice_number;
}

getCode() {
return this.code;
}

getItemCode() {
return this.item_code;
}

getPrice() {
return this.price;
}

getQuantity() {
return this.qty;
}

getTaxableAmt() {
return this.taxable_amt;
}

getIGSTAmt() {
return this.igst_amt;
}

getCGSTAmt() {
return this.cgst_amt;
}

getSGSTAmt() {
return this.sgst_amt;
}

getTotalAmt() {
return this.total_amt;
}

getUOMCode() {
return this.uom_code;
}

getInvoiceNumber() {
return this.invoice_number;
}

}

class InvoiceAdditionalCharge {

constructor(code, description, taxable_amt, igst_amt, sgst_amt, cgst_amt, total_amt, invoice_number) {
this.code = code;
this.description = description;
this.taxable_amt = taxable_amt;
this.igst_amt = igst_amt;
this.cgst_amt = cgst_amt;
this.sgst_amt = sgst_amt;
this.total_amt = total_amt;
this.invoice_number = invoice_number;
}

getCode() {
return this.code;
}

getDescription() {
return this.description;
}

getTaxableAmt() {
return this.taxable_amt;
}

getIGSTAmt() {
return this.igst_amt;
}

getCGSTAmt() {
return this.cgst_amt;
}

getSGSTAmt() {
return this.sgst_amt;
}

getTotalAmt() {
return this.total_amt;
}

getInvoiceNumber() {
return this.invoice_number;
}

}

class Receipt {

constructor(code, customer_code, amount, narration, receipt_date) {
this.code = code;
this.customer_code = customer_code;
this.amount = amount;
this.narration = narration;
this.receipt_date = receipt_date;
}

getCode() {
return this.code;
}

getCustomerCode() {
return this.customer_code;
}

getAmount() {
return this.amount;
}

getNarration() {
return this.narration;
}

getReceiptDate() {
return this.receipt_date;
}

}

class CustomerTransaction {

constructor(code, customer_code, total_sales, total_receipts, opening_balance) {
this.code = code;
this.customer_code = customer_code;
this.total_sales = total_sales;
this.total_receipts = total_receipts;
this.opening_balance = opening_balance;
}

getCode() {
return this.code;
}

getCustomerCode() {
return this.customer_code;
}

getTotalSales() {
return this.total_sales;
}

getTotalReceipts() {
return this.total_receipts;
}

getOpeningBalance() {
return this.opening_balance;
}

}


module.exports = { UnitOfMeasurement, Item, State, Trader, Customer, Invoice, InvoiceItem, InvoiceAdditionalCharge, Receipt, CustomerTransaction };