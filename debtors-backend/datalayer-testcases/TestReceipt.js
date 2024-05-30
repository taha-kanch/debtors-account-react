const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];

if(testWhat  == "add") {

var code = 0;
var customer_code = 5;
var amount = 100;
var narration = null;

var receipt = new entities.Receipt(code, customer_code, amount, narration);
var m = new managers.ReceiptManager();
m.add(receipt)
.then(() => {
console.log(`Receipt created with code ${receipt.code}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'add' end here

if(testWhat  == "getAll") {

var m = new managers.ReceiptManager();

const filters = {
search: ""
}

m.getAll(filters)
.then((receipts) => {
if(receipts.length == 0) {
console.log("No record found");
return;
}
var i = 0;
while(i < receipts.length) {
console.log(receipts[i]);
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
var m = new managers.ReceiptManager();

m.getByCode(code)
.then((receipt) => {
console.log(receipt);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByCode' end here

if(testWhat  == "getRemainingBalance") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var code = process.argv[3];
var m = new managers.ReceiptManager();

m.getRemainingBalance(code)
.then((data) => {
console.log(data);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getRemainingBalance' end here