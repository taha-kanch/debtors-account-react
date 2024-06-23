const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];

if(testWhat  == "getAll") {

var m = new managers.StateManager();

m.getAll()
.then((states) => {
if(states.length == 0) {
console.log("No record found");
return;
}
var i = 0;
while(i < states.length) {
console.log(states[i]);
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
var m = new managers.StateManager();

m.getByCode(code)
.then((state) => {
console.log(state);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByCode' end here

if(testWhat  == "getByAlphaCode") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var alphaCode = process.argv[3];
var m = new managers.StateManager();

m.getByAlphaCode(alphaCode)
.then((state) => {
console.log(state);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByAlphaCode' end here