const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "add") {

if(process.argv.length < 4) {
console.log('Data to add is missing');
return;
}

var name = process.argv[3];
var k = new entities.UnitOfMeasurement(0, name);
var m = new managers.UnitOfMeasurementManager();

m.add(k)
.then(() => {
console.log(`Unit of measurement: ${name} added with code ${k.code}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'add' end here

if(testWhat  == "remove") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var code = process.argv[3];
var m = new managers.UnitOfMeasurementManager();

m.remove(code)
.then(() => {
console.log(`Unit of measurement: with code ${code} removed`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'remove' end here

if(testWhat  == "update") {

if(process.argv.length < 5) {
console.log('Data to update is missing');
return;
}

var code = process.argv[3];
var name = process.argv[4];
var k = new entities.UnitOfMeasurement(code, name);
var m = new managers.UnitOfMeasurementManager();

m.update(k)
.then(() => {
console.log(`Unit of measurement: against code ${code} updated with ${name}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'update' end here

if(testWhat  == "getAll") {

var m = new managers.UnitOfMeasurementManager();

m.getAll()
.then((unitOfMeasurements) => {
const { data, total_records } = unitOfMeasurements;
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
var m = new managers.UnitOfMeasurementManager();

m.getByCode(code)
.then((unitOfMeasurement) => {
console.log(unitOfMeasurement);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByCode' end here

if(testWhat  == "getByName") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var name = process.argv[3];
var m = new managers.UnitOfMeasurementManager();

m.getByName(name)
.then((unitOfMeasurement) => {
console.log(unitOfMeasurement);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByName' end here

if(testWhat  == "getByItemCode") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var itemCode = process.argv[3];
var m = new managers.UnitOfMeasurementManager();

m.getByItemCode(itemCode)
.then((unitOfMeasurements) => {
if(unitOfMeasurements.length == 0) {
console.log("No record found");
return;
}
var i = 0;
while(i < unitOfMeasurements.length) {
console.log(unitOfMeasurements[i]);
i++;
}
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getAll' end here