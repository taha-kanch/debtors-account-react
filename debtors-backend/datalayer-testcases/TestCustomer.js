const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "add") {

var code = 0;
var name = 'Banti';
var address = '605, Silver Mall near INOX Central';
var state_code = 9;
var reg_title_1 = 'PAN';
var reg_value_1 = 'DFT67NCJDJL';
var reg_title_2 = '';
var reg_value_2 = '';
var reg_title_3 = '';
var reg_value_3 = '';
var contact_1 = '+917869249982';
var contact_2 = '';
var contact_3 = '';
var opening_balance = 0;
var opening_balance_type = 'DR';

var customer = new entities.Customer(code, name, address, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code);
var m = new managers.CustomerManager();
m.add(customer)
.then(() => {
console.log(`Customer: ${name} added with code ${customer.code}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'add' end here

if(testWhat  == "update") {

var code = 1;
var name = 'Chotu';
var address = '605, Crystal Mall';
var state_code = 9;
var reg_title_1 = 'PAN';
var reg_value_1 = 'DFT67NCJDJL';
var reg_title_2 = '';
var reg_value_2 = '';
var reg_title_3 = '';
var reg_value_3 = '';
var contact_1 = '+917869249982';
var contact_2 = '+16666666666';
var contact_3 = '';

var customer = new entities.Customer(code, name, address, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code);
var m = new managers.CustomerManager();
m.update(customer)
.then(() => {
console.log(`Customer is updated`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'update' end here

if(testWhat  == "getAll") {

var m = new managers.CustomerManager();

m.getAll()
.then((customers) => {
if(customers.data.length == 0) {
console.log("No record found");
return;
}
var i = 0;
while(i < customers.data.length) {
console.log(customers.data[i]);
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
var m = new managers.CustomerManager();

m.getByCode(code)
.then((customer) => {
console.log(customer);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByCode' end here

if(testWhat  == "remove") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var code = process.argv[3];
var m = new managers.CustomerManager();

m.remove(code)
.then(() => {
console.log(`Customer: with code ${code} removed`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'remove' end here
