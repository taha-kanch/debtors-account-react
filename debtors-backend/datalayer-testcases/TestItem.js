const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "add") {

var name = 'Hook';
var hsnCode = 1211;
var cgst = 18;
var sgst = 18;
var igst = 24;
var unitOfMeasurements = [];
var unitOfMeasurement;
unitOfMeasurement = new entities.UnitOfMeasurement(1, 'Kilo');
unitOfMeasurements.push(unitOfMeasurement);
unitOfMeasurement = new entities.UnitOfMeasurement(6, 'PKT');
unitOfMeasurements.push(unitOfMeasurement);
unitOfMeasurement = new entities.UnitOfMeasurement(0, 'GRAM');
unitOfMeasurements.push(unitOfMeasurement);
unitOfMeasurement = new entities.UnitOfMeasurement(0, 'PCS');
unitOfMeasurements.push(unitOfMeasurement);

var item = new entities.Item(0, name,hsnCode, cgst, sgst, igst, unitOfMeasurements);
var m = new managers.ItemManager();
m.add(item)
.then(() => {
console.log(`Item: ${name} added with code ${item.code}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'add' end here

if(testWhat  == "update") {

if(process.argv.length < 5) {
console.log('Data to update is missing');
return;
}

var code = process.argv[3];
var name = process.argv[4];
var hsnCode = 299;
var cgst = 3;
var sgst = 3;
var igst = 4;
var unitOfMeasurements = [];

var item = new entities.Item(code, name, hsnCode, cgst, sgst, igst, unitOfMeasurements);
var m = new managers.ItemManager();
m.update(item)
.then(() => {
console.log(`Item: against code ${code} updated with ${name}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'update' end here

if(testWhat  == "getAll") {

var m = new managers.ItemManager();

const filters = {
search: "",
page: 2,
limit: 2,
is_deleted: 'N'
}

m.getAll(filters)
.then((items) => {
const { data, total_records } = items;
if(data.length == 0) {
console.log("No record found");
return;
}
console.log(`Total Records: ${total_records}`);
var i = 0;
while(i < data.length) {
console.log(data[i]);
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
var m = new managers.ItemManager();

m.getByCode(code)
.then((item) => {
console.log(item);
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
var m = new managers.ItemManager();

m.remove(code)
.then(() => {
console.log(`Item: with code ${code} removed`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'remove' end here