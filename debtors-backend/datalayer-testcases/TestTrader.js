const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "update") {

var code = 1;
var name = 'Bantu';
var address = '605, Silver Mall near INOX Central';
var gst_number = 'ABCD123456789';
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
var bank_account_name= 'HDFC';
var bank_account_num= 1234567899876;
var bank_account_branch_name= 'Bhawakua';
var bank_account_ifsc= 'HDFC67BHW';

var trader = new entities.Trader(code, name, address, gst_number, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code, bank_account_num, bank_account_branch_name, bank_account_ifsc, bank_account_name);
var m = new managers.TraderManager();
m.update(trader)
.then(() => {
console.log(`Trader detail is updated`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'update' end here

if(testWhat  == "get") {

var m = new managers.TraderManager();

m.get()
.then((trader) => {
console.log(trader);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'get' end here
