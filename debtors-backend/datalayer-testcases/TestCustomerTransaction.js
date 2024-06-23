const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];

if(testWhat  == "getAll") {

var m = new managers.CustomerTransactionManager();

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
