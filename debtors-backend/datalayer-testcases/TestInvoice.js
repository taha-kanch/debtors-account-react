const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "add") {

var customer_code = 4;
var total_items = 2;
var taxable_amt = 1000;
var igst_amt = 100;
var cgst_amt = 0;
var sgst_amt = 0;
var total_amt = 1100;

var items = [];
var item;
item = new entities.InvoiceItem(0, 7, 100, 4, 400, 10, 0, 0, 410, 1);
items.push(item);
item = new entities.InvoiceItem(0, 8, 100, 2, 200, 30, 0, 0, 230, 2);
items.push(item);

var additional_charges = [];
var additional_charge;
additional_charge = new entities.InvoiceAdditionalCharge(0, 'Shipping', 100, 5, 0, 0, 110);
additional_charges.push(additional_charge);
additional_charge = new entities.InvoiceAdditionalCharge(0, 'Secure Packing', 47, 2, 0, 0, 49);
additional_charges.push(additional_charge);

var invoice = new entities.Invoice(0,customer_code,total_items,taxable_amt,igst_amt,cgst_amt,sgst_amt,total_amt,items,additional_charges);
var m = new managers.InvoiceManager();
m.add(invoice)
.then(() => {
console.log(`Invoice created with code ${invoice.code}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'add' end here

if(testWhat  == "getAll") {

const filters = {
start_date: '2024-05-04',
end_date: '2024-05-04',
page: 1,
limit: 5
}
var m = new managers.InvoiceManager();

m.getAll(filters)
.then((invoices) => {
if(invoices.data.length == 0) {
console.log("No record found");
return;
}
var i = 0;
while(i < invoices.data.length) {
console.log(invoices.data[i]);
i++;
}
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getAll' end here

if(testWhat  == "getByCode") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var code = process.argv[3];
var m = new managers.InvoiceManager();

m.getByCode(code)
.then((invoice) => {
console.log(invoice);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByCode' end here
