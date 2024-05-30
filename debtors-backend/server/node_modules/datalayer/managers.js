const connector = require('./connector');
const entities = require('./entities');

// uom class start 
class UnitOfMeasurementManager {

constructor() {}

async add(unitOfMeasurement) {
if(!unitOfMeasurement.name || unitOfMeasurement.name.length == 0) {
throw 'Name is required';
}

if(!unitOfMeasurement.name.length > 5) {
throw 'Name cannot exceed 5 character';
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select name from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${unitOfMeasurement.name} already exists`;
}
await connection.execute(`Insert into ac_uom (name) values('${unitOfMeasurement.name}')`);
await connection.commit();

resultSet = await connection.execute(`select code from ac_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
unitOfMeasurement.code = resultSet.rows[0][0];
await connection.close();

} // add end

async remove(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from ac_uom where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

resultSet = await connection.execute(`select uom_code from ac_item_uom where uom_code=${code}`);
if(resultSet.rows.lenght > 0) {
await connection.close();
throw `Unit of measurement with code ${code} has been alloted to an item`;
}

await connection.execute(`delete from ac_uom where code=${code}`);
await connection.commit();

await connection.close();

} // remove end

async update(unitOfMeasurement) {

if(!unitOfMeasurement.code) {
throw 'Code is required';
}

if(unitOfMeasurement.code <= 0) {
throw '!Invalid Code';
}

if(!unitOfMeasurement.name) {
throw 'Name is required';
}

if(!unitOfMeasurement.name.length > 5) {
throw 'Name cannot exceed 5 character';
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from ac_uom where code=${unitOfMeasurement.code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${unitOfMeasurememt.code}`;
}

resultSet = await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}') and code<> ${unitOfMeasurement.code}`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${unitOfMeasurement.name} exists`;
}
await connection.execute(`update ac_uom set name='${unitOfMeasurement.name}' where code=${unitOfMeasurement.code}`);
await connection.commit();

await connection.close();

} // update end

async getAll() {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute("select * from ac_uom order by code desc");
let unitOfMeasurements = [];
let unitOfMeasurement;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());
unitOfMeasurements.push(unitOfMeasurement);
i++;
}

resultSet = await connection.execute(`select count(*) as total_records from ac_uom`);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": unitOfMeasurements, "total_records": total_records };

} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from ac_uom where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
let unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());

await connection.close();
return unitOfMeasurement;

} // getByCode end

async getByName(name) {

if(!name) {
throw 'Name is required';
}

if(name.length == 0 || name.length > 5) {
throw `Invalid name ${name}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from ac_uom where lower(name)=lower('${name}')`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid name ${name}`;
}

let row = resultSet.rows[0];
let unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());

await connection.close();
return unitOfMeasurement;

} // getByName end

async getByItemCode(itemCode) {

if(!itemCode) {
throw 'Item Code is required';
}

if(itemCode <= 0) {
throw `Invalid item code ${itemCode}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select uom_code, name as uom_name from ac_item_uom left join ac_uom on ac_item_uom.uom_code = ac_uom.code where item_code = ${itemCode}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${itemCode}`;
}

let unitOfMeasurements = [];
let unitOfMeasurement;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());
unitOfMeasurements.push(unitOfMeasurement);
i++;
}
await connection.close();
return unitOfMeasurements;

} // getByItemCode end

} 
// uom class end

//Item class start
class ItemManager {

constructor() {}

async add(item) {
//basic validation start
if(!item.name || item.name.length == 0) {
throw 'Name is required';
}
if(item.name.length >  25) {
throw `Name cannot exceed 25 characters`;
}
if(!item.hsn_code) {
throw 'HSN code is required';
}
if(item.hsn_code <= 0) {
throw '!Invalid HSN code';
}
if(!item.cgst) {
item.cgst = 0;
}
if(item.cgst < 0) {
throw 'CGST cannot be nagative';
}
if(!item.sgst) {
item.sgst = 0;
}
if(item.sgst < 0) {
throw 'SGST cannot be nagative';
}
if(!item.igst) {
item.igst = 0;
}
if(item.igst < 0) {
throw 'IGST cannot be nagative';
}
if(item.unitOfMeasurements.length == 0) {
throw 'Unit of measurement is required';
}
//basic validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect to database';
}

//Check item name exist start
let resultSet = await connection.execute(`select name from ac_item where lower(name)=lower('${item.name}')`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${item.name} already exists`;
}
//Check item name exist end

//Insert uom start
var unitOfMeasurement;
var i = 0;
while(i < item.unitOfMeasurements.length) {
unitOfMeasurement = item.unitOfMeasurements[i];
if(!unitOfMeasurement.code || unitOfMeasurement.code < 0) {
unitOfMeasurement.code = 0;
}
if(!unitOfMeasurement.name || unitOfMeasurement.name.length == 0) {
await connection.close();
throw `Unit of measurement name required`;
}
if(unitOfMeasurement.name.length > 5) {
await connection.close();
throw `Unit of measurement name cannot exceed 5 characters`;
}

resultSet = await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
if(resultSet.rows.length > 0) {
unitOfMeasurement.code = resultSet.rows[0][0];
}
else {
await connection.execute(`Insert into ac_uom (name) values('${unitOfMeasurement.name}')`);
await connection.commit();
resultSet = await connection.execute(`select code from ac_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
unitOfMeasurement.code = resultSet.rows[0][0];
}

i++;
} //loop end 
//Insert uom end

//Insert item start
await connection.execute(`Insert into ac_item (name, hsn_code) values('${item.name}', ${item.hsn_code})`);
await connection.commit();
resultSet = await connection.execute(`select code from ac_item where lower(name) = lower('${item.name}')`);
item.code = resultSet.rows[0][0];
//Insert item end


//Insert item_tax start
await connection.execute(`Insert into ac_item_tax (item_code, cgst, sgst, igst) values(${item.code}, ${item.cgst}, ${item.sgst}, ${item.igst})`);
await connection.commit();
//Insert item_tax end

//Insert item_uom start
i = 0;
while(i < item.unitOfMeasurements.length) {
unitOfMeasurement = item.unitOfMeasurements[i];
await connection.execute(`Insert into ac_item_uom (item_code, uom_code) values(${item.code}, ${unitOfMeasurement.code})`);
await connection.commit();
i++;
}
//Insert item_uom end

await connection.close();

}

async getAll(filters={ search: '', page: 0, limit: 0, is_deleted: 'N' }) {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

if(!filters.is_deleted || filters.is_deleted.length == 0) {
filters.is_deleted = "'Y', 'N'";
} else {
filters.is_deleted = `'${filters.is_deleted}'`;
}

let resultSet;
if(!filters.page && !filters.limit) {
resultSet = await connection.execute(`select code,name,hsn_code,sgst,cgst,igst,is_deleted from ac_item left join ac_item_tax on item_code=code where lower(name) like lower('${filters.search ?? ""}%') AND is_deleted IN (${filters.is_deleted}) order by code desc`);
}
else {
const offset = (filters.page - 1) * filters.limit;
resultSet = await connection.execute(`select code,name,hsn_code,sgst,cgst,igst,is_deleted from ac_item left join ac_item_tax on item_code=code where lower(name) like lower('${filters.search}%') AND is_deleted IN (${filters.is_deleted}) order by code desc offset ${offset} rows fetch next ${filters.limit} rows only`);
}

let items = [];
let item;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];

let resultSetUOM = await connection.execute(`select uom_code, name from ac_item_uom left join ac_uom on code=uom_code where item_code = ${row[0]}`);
let e = 0;
let unitOfMeasurements = [];
let unitOfMeasurement;
let uom_row;
while(e < resultSetUOM.rows.length) {
uom_row = resultSetUOM.rows[e];
unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(uom_row[0]), uom_row[1]?.trim());
unitOfMeasurements.push(unitOfMeasurement);
e++;
}
item = new entities.Item(parseInt(row[0]), row[1]?.trim(), parseInt(row[2]), parseInt(row[3]), parseInt(row[4]), parseInt(row[5]), unitOfMeasurements, row[6]);
items.push(item);
i++;
}

resultSet = await connection.execute(`select count(*) as total_records from ac_item where lower(name) like lower('${filters.search ?? ""}%') and is_deleted IN (${filters.is_deleted})`);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": items, "total_records": total_records };
} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from ac_item where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
resultSet = await connection.execute(`select cgst, sgst, igst from ac_item_tax where item_code=${code}`);
let tax_row = resultSet.rows[0];

let resultSetUOM = await connection.execute(`select uom_code, name from ac_item_uom left join ac_uom on code=uom_code where item_code = ${row[0]}`);
let e = 0;
let unitOfMeasurements = [];
let unitOfMeasurement;
let uom_row;
while(e < resultSetUOM.rows.length) {
uom_row = resultSetUOM.rows[e];
unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(uom_row[0]), uom_row[1]?.trim());
unitOfMeasurements.push(unitOfMeasurement);
e++;
}

let item = new entities.Item(parseInt(row[0]), row[1]?.trim(), parseInt(row[2]), parseInt(tax_row[0]), parseInt(tax_row[1]), parseInt(tax_row[2]), unitOfMeasurements, row[3]);

await connection.close();
return item;

} // getByCode end

async remove(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from ac_item where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

await connection.execute(`update ac_item set is_deleted='Y' where code=${code}`);
await connection.commit();

await connection.close();

} // remove end

async update(item) {

//basic validation start
if(!item.name || item.name.length == 0) {
throw 'Name is required';
}
if(item.name.length >  25) {
throw `Name cannot exceed 25 characters`;
}
//basic validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect to database';
}

//Check item name exist start
let resultSet = await connection.execute(`select name from ac_item where lower(name)=lower('${item.name}')`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${item.name} already exists`;
}
//Check item name exist end

//Update item start
resultSet = await connection.execute(`select code from ac_item where lower(name)=lower('${item.name}') and code<> ${item.code}`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${item.name} exists`;
}
await connection.execute(`update ac_item set name='${item.name}' where code=${item.code}`);
await connection.commit();
//Update item end

await connection.close();

} // update end

} // Item class end

// state class start
class StateManager {

constructor() {}

async getAll() {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute("select * from ac_state order by name");
let states = [];
let state;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
state = new entities.State(parseInt(row[0]), row[1]?.trim(), row[2]?.trim());
states.push(state);
i++;
}

resultSet = await connection.execute(`select count(*) as total_records from ac_state`);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": states, "total_records": total_records };

} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from ac_state where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
let state = new entities.State(parseInt(row[0]), row[1]?.trim(), row[2]?.trim());

await connection.close();
return state;

} // getByCode end

async getByAlphaCode(alpha_code) {

if(!alpha_code) {
throw 'Alpha code is required';
}

if(alpha_code <= 0) {
throw `Invalid Alpha Code ${alpha_code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}
let resultSet = await connection.execute(`select * from ac_state where alpha_code=${alpha_code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid Alpha Code ${alpha_code}`;
}

let row = resultSet.rows[0];
let state = new entities.State(parseInt(row[0]), row[1]?.trim(), row[2]?.trim());

await connection.close();
return state;

} // getByAlphaCode end 

} // state class end

// trader class start

class TraderManager {

constructor() {}

async get() {

var connection = await connector.getConnection();

var resultSet = await connection.execute(`select * from ac_trader`);
var trader = {};

if(resultSet.rows.length > 0) {
const row = resultSet.rows[0];
trader = new entities.Trader(
parseInt(row[0]), row[1]?.trim(), row[2]?.trim(), row[3]?.trim(), 
row[4]?.trim(), row[5]?.trim(), row[6]?.trim(), row[7]?.trim(), 
row[8]?.trim(), row[9]?.trim(), row[10]?.trim(), row[11]?.trim(), 
row[12]?.trim(), row[13], row[14], row[15]?.trim(), row[16]?.trim(), row[17]?.trim()
);
}

await connection.close();
return trader;

} // get end

async update(trader) {
//basic validation start
if(!trader.code) {
throw 'Code is required';
}
if(trader.code <= 0) {
throw '!Invalid Code';
}
if(!trader.name || trader.name.length == 0) {
throw 'Name is required';
}
if(trader.name.length >  150) {
throw `Name cannot exceed 150 characters`;
}
if(!trader.address || trader.address.length == 0) {
throw 'Address is required';
}
if(trader.address.length >  500) {
throw `Address cannot exceed 500 characters`;
}
if(!trader.gst_num || trader.gst_num.length == 0) {
throw 'GST Number is required';
}
if(trader.gst_num.length >  20) {
throw `GST Number cannot exceed 20 characters`;
}
if(!trader.state_code) {
throw 'State Code is required';
}
if(trader.state_code <= 0) {
throw '!Invalid State Code';
}
if(!trader.bank_account_name || trader.bank_account_name.length == 0) {
throw 'Bank Account Name is required';
}
if(trader.bank_account_name.length >  150) {
throw `Bank Account Name cannot exceed 150 characters`;
}
if(!trader.bank_account_num) {
throw 'Bank Account Number is required';
}
if(trader.bank_account_num <= 0) {
throw `!Invalid Bank Account Number`;
}
if(!trader.bank_account_branch_name || trader.bank_account_branch_name.length == 0) {
throw 'Bank Account Branch Name is required';
}
if(trader.bank_account_branch_name.length >  150) {
throw `Bank Account Branch Name cannot exceed 150 characters`;
}
if(!trader.bank_account_ifsc || trader.bank_account_ifsc.length == 0) {
throw 'Bank Account IFSC is required';
}
if(trader.bank_account_branch_name.length >  20) {
throw `Bank Account ifsc cannot exceed 20 characters`;
}
//basic validation end

var connection = await connector.getConnection();

var resultSet = await connection.execute(`select * from ac_trader where code=${trader.code}`);
if(resultSet.rows.length > 0) {
await connection.execute(`update ac_trader set 
name='${trader.name}', 
address='${trader.address}', 
gst_num='${trader.gst_num}',
reg_title_1='${trader.reg_title_1}',
reg_value_1='${trader.reg_value_1}',
reg_title_2='${trader.reg_title_2}',
reg_value_2='${trader.reg_value_2}',
reg_title_3='${trader.reg_title_3}',
reg_value_3='${trader.reg_value_3}',
contact_1 = '${trader.contact_1}',
contact_2 = '${trader.contact_2}',
contact_3 = '${trader.contact_3}',
state_code = ${trader.state_code} ,
bank_account_name = '${trader.bank_account_name}',
bank_account_num = ${trader.bank_account_num},
bank_account_branch_name = '${trader.bank_account_branch_name}',
bank_account_ifsc = '${trader.bank_account_ifsc}'
where code = ${trader.code}
`);
await connection.commit();

} else {
await connection.execute(`insert into ac_trader 
(code, name, address, gst_num, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code, bank_account_name, bank_account_num, bank_account_branch_name, bank_account_ifsc) 
values (
${trader.code}, '${trader.name}', '${trader.address}', '${trader.gst_num}', 
'${trader.reg_title_1}', '${trader.reg_value_1}', 
'${trader.reg_title_2}', '${trader.reg_value_2}', 
'${trader.reg_title_3}', '${trader.reg_title_3}', 
'${trader.contact_1}', '${trader.contact_2}', '${trader.contact_3}', 
${trader.state_code},
'${trader.bank_account_name}',${trader.bank_account_num},'${trader.bank_account_branch_name}','${trader.bank_account_ifsc}'
)`);
await connection.commit();
}
await connection.close();

} // update end

}
// trader class end

class CustomerManager {

constructor() {}

async add(customer) {
//basic validation start

if(!customer.name || customer.name.length == 0) {
throw 'Name is required';
}
if(customer.name.length >  150) {
throw `Name cannot exceed 150 characters`;
}
if(!customer.address) {
throw 'Address is required';
}
if(customer.address.length >  500) {
throw `Address cannot exceed 500 characters`;
}
if(!customer.state_code) {
throw 'State Code is required';
}
if(customer.state_code <= 0) {
throw '!Invalid State Code';
}
if(customer.opening_balance && customer.opening_balance <= 0) {
throw 'Opening Balance cannot be nagative';
}
if(customer.opening_balance_type && customer.opening_balance_type != 'DR' && customer.opening_balance_type != 'CR') {
throw '!Invalid Opening Balance Type';
}
//basic validation end

var connection = await connector.getConnection();

let resultSet = await connection.execute(`select name from ac_customer where lower(name)=lower('${customer.name}')`);

if(resultSet.rows.length > 0) {
await connection.close();
throw `${customer.name} already exists`;
}
await connection.execute(`insert into ac_customer 
(name, address, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code) 
values (
'${customer.name}', '${customer.address}',
'${customer.reg_title_1}', '${customer.reg_value_1}', 
'${customer.reg_title_2}', '${customer.reg_value_2}', 
'${customer.reg_title_3}', '${customer.reg_title_3}', 
'${customer.contact_1}', '${customer.contact_2}', '${customer.contact_3}', 
${customer.state_code}
)`);
await connection.commit();

resultSet = await connection.execute(`select code from ac_customer where lower(name) = lower('${customer.name}')`);
customer.code = resultSet.rows[0][0];

let opening_balance = 0;
if(customer.opening_balance_type == 'CR') {
opening_balance = customer.opening_balance * -1;
}
if(customer.opening_balance_type == 'DR') {
opening_balance = customer.opening_balance;
}

await connection.execute(`insert into ac_customer_transactions (customer_code,total_sales,total_receipts,opening_balance) values (${customer.code}, 0, 0, ${opening_balance})`);
await connection.commit();

await connection.close();

} // add end

async getAll(filters={ search: '', page: 0, limit: 0, is_deleted: 'N' }) {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

if(!filters.is_deleted || filters.is_deleted.length == 0) {
filters.is_deleted = "'Y', 'N'";
} else {
filters.is_deleted = `'${filters.is_deleted}'`;
}

let resultSet;
if(!filters.page && !filters.limit) {
resultSet = await connection.execute(`select * from ac_customer where lower(name) like lower('${filters.search ?? ""}%') AND is_deleted IN (${filters.is_deleted}) order by code desc`);
}
else {
const offset = (filters.page - 1) * filters.limit;
resultSet = await connection.execute(`select * from ac_customer where lower(name) like lower('${filters.search ?? ""}%') AND is_deleted IN (${filters.is_deleted}) order by code desc offset ${offset} rows fetch next ${filters.limit} rows only`);
}

let customers = [];
let customer;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
customer = new entities.Customer(
parseInt(row[0]), row[1]?.trim(), row[2]?.trim(), 
row[3]?.trim(), row[4]?.trim(), row[5]?.trim(), 
row[6]?.trim(), row[7]?.trim(), row[8]?.trim(), row[9]?.trim(), 
row[10]?.trim(), row[11]?.trim(), row[12]
);
customers.push(customer);
i++;
}

resultSet = await connection.execute(`select count(*) as total_records from ac_customer where lower(name) like lower('${filters.search ?? ""}%') and is_deleted IN (${filters.is_deleted})`);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": customers, "total_records": total_records };

} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from ac_customer where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
let customer = new entities.Customer(
parseInt(row[0]), row[1]?.trim(), row[2]?.trim(), 
row[3]?.trim(), row[4]?.trim(), row[5]?.trim(), 
row[6]?.trim(), row[7]?.trim(), row[8]?.trim(), row[9]?.trim(), 
row[10]?.trim(), row[11]?.trim(), row[12]
);

await connection.close();
return customer;

} // getByCode end

async update(customer) {
//basic validation start
if(!customer.code) {
throw 'Code is required';
}
if(customer.code <= 0) {
throw '!Invalid Code';
}
if(!customer.name || customer.name.length == 0) {
throw 'Name is required';
}
if(customer.name.length >  150) {
throw `Name cannot exceed 150 characters`;
}
if(!customer.address) {
throw 'Address is required';
}
if(customer.address.length >  500) {
throw `Address cannot exceed 500 characters`;
}
if(!customer.state_code) {
throw 'State Code is required';
}
if(customer.state_code <= 0) {
throw '!Invalid State Code';
}
//basic validation end

var connection = await connector.getConnection();

let resultSet = await connection.execute(`select * from ac_customer where code=${customer.code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${unitOfMeasurememt.code}`;
}

resultSet = await connection.execute(`select code from ac_customer  where lower(name)=lower('${customer.name}') and code<> ${customer.code}`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${customer.name} exists`;
}
await connection.execute(`update ac_customer set 
name='${customer.name}', 
address='${customer.address}',
reg_title_1='${customer.reg_title_1}',
reg_value_1='${customer.reg_value_1}',
reg_title_2='${customer.reg_title_2}',
reg_value_2='${customer.reg_value_2}',
reg_title_3='${customer.reg_title_3}',
reg_value_3='${customer.reg_value_3}',
contact_1 = '${customer.contact_1}',
contact_2 = '${customer.contact_2}',
contact_3 = '${customer.contact_3}',
state_code = ${customer.state_code} 
where code = ${customer.code}
`);
await connection.commit();

await connection.close();

} // update end

async remove(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from ac_customer where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

await connection.execute(`update ac_customer set is_deleted='Y' where code=${code}`);
await connection.commit();

await connection.close();

} // remove end 

}
// customer class end

class InvoiceManager {

async add(invoice) {

// basic validation start
if(!invoice.customer_code) {
throw 'Customer code is required';
}
if(invoice.customer_code <= 0) {
throw '!Invalid Customer code';
}
if(!invoice.total_items) {
throw 'Total items is required';
}
if(invoice.total_items < 0) {
throw 'Total items cannot be nagative';
}
if(!invoice.taxable_amt) {
throw 'Taxable amount is required';
}
if(invoice.taxable_amt < 0) {
throw 'Taxable amount cannot be nagative';
}
if(!invoice.igst_amt) {
invoice.igst_amt = 0;
}
if(invoice.igst_amt < 0) {
throw 'IGST amount cannot be nagative';
}
if(!invoice.cgst_amt) {
invoice.cgst_amt = 0;
}
if(invoice.cgst_amt < 0) {
throw 'CGST amount cannot be nagative';
}
if(!invoice.sgst_amt) {
invoice.sgst_amt = 0;
}
if(invoice.sgst_amt < 0) {
throw 'SGST amount cannot be nagative';
}
if(!invoice.total_amt) {
throw 'Total amount is required';
}
if(!invoice.total_amt < 0) {
throw 'Total amount cannot be nagative';
}
if(!invoice.items || invoice.items.length == 0) {
throw 'Items is required';
}
if(!Array.isArray(invoice.items)) {
throw '!Invalid items';
}
if(invoice.additional_charges && !Array.isArray(invoice.additional_charges)) {
throw '!Invalid additional charges';
}
// basic validation end


// items basic validation start
var item;
var i = 0;
while(i < invoice.items.length) {
item = invoice.items[i];
if(!item.item_code || item.item_code < 0) {
throw `Item code is required`;
}
if(!item.price) {
throw 'Price is required';
}
if(item.price < 0) {
throw 'Price cannot be nagative';
}
if(!item.qty) {
throw 'Quantity is required';
}
if(item.qty < 0) {
throw 'Quantity cannot be nagative';
}
if(!item.taxable_amt) {
throw 'Taxable amount is required';
}
if(item.taxable_amt < 0) {
throw 'Taxable amount cannot be nagative';
}
if(!item.igst_amt) {
item.igst_amt = 0;
}
if(item.igst_amt < 0) {
throw 'IGST amount cannot be nagative';
}
if(!item.cgst_amt) {
item.cgst_amt = 0;
}
if(item.cgst_amt < 0) {
throw 'CGST amount cannot be nagative';
}
if(!item.sgst_amt) {
item.sgst_amt = 0;
}
if(item.sgst_amt < 0) {
throw 'SGST amount cannot be nagative';
}
if(!item.total_amt) {
throw 'Total amount is required';
}
if(item.total_amt < 0) {
throw 'Total amount cannot be nagative';
}
if(!item.uom_code) {
throw 'Unit of measurement is required';
}
if(item.uom_code <= 0) {
throw '!Invalid Unit of measurement';
}
i++;
} // loop end
// items basic validation end


// additional_charges basic validation start
var additional_charge;
i = 0;
if(invoice.additional_charges && invoice.additional_charges.length > 0) {
while(i < invoice.additional_charges.length) {
additional_charge = invoice.additional_charges[i];
if(!additional_charge.description || additional_charge.description.length == 0) {
throw 'Description is required';
}
if(additional_charge.description.length >  200) {
throw `Description cannot exceed 200 characters`;
}
if(!additional_charge.taxable_amt) {
throw 'Taxable amount is required';
}
if(additional_charge.taxable_amt < 0) {
throw 'Taxable amount cannot be nagative';
}
if(!additional_charge.igst_amt) {
additional_charge.igst_amt = 0;
}
if(additional_charge.igst_amt < 0) {
throw 'IGST amount cannot be nagative';
}
if(!additional_charge.cgst_amt) {
additional_charge.cgst_amt = 0;
}
if(additional_charge.cgst_amt < 0) {
throw 'CGST amount cannot be nagative';
}
if(!additional_charge.sgst_amt) {
additional_charge.sgst_amt = 0;
}
if(additional_charge.sgst_amt < 0) {
throw 'SGST amount cannot be nagative';
}
if(!additional_charge.total_amt) {
throw 'Total amount is required';
}
if(additional_charge.total_amt < 0) {
throw 'Total amount cannot be nagative';
}

i++;
} // loop end
}
// additional_charges basic validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect to database';
}

//Insert invoice start

await connection.execute(`Insert into ac_invoice (customer_code, total_items, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, invoice_date) values(${invoice.customer_code}, ${invoice.total_items}, ${invoice.taxable_amt}, ${invoice.igst_amt}, ${invoice.cgst_amt}, ${invoice.sgst_amt}, ${invoice.total_amt}, TRUNC(SYSDATE))`);
await connection.commit();
let resultSet = await connection.execute(`select max(code) as invoice_number from ac_invoice`);
invoice.code = resultSet.rows[0][0];

if(!invoice.code || invoice.code < 0) {
throw `Invoice code is required`;
}

//Insert invoice end

//Insert invoice_items start
i = 0;
while(i < invoice.items.length) {
item = invoice.items[i];

await connection.execute(`Insert into ac_invoice_items (item_code, price, qty, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, uom_code, invoice_number) values(${item.item_code}, ${item.price}, ${item.qty}, ${item.taxable_amt}, ${item.igst_amt}, ${item.cgst_amt}, ${item.sgst_amt}, ${item.total_amt}, ${item.uom_code}, ${invoice.code})`);
await connection.commit();
resultSet = await connection.execute(`select max(code) as invoice_item_code from ac_invoice_items`);
item.code = resultSet.rows[0][0];

i++;
} //loop end 
//Insert invoice_items end

//Insert invoice_items_additional_charges start
i = 0;
if(invoice.additional_charges && invoice.additional_charges.length > 0) {
while(i < invoice.additional_charges.length) {
additional_charge = invoice.additional_charges[i];

await connection.execute(`Insert into ac_invoice_additional_charges (description, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, invoice_number) values('${additional_charge.description}', ${additional_charge.taxable_amt}, ${additional_charge.igst_amt}, ${additional_charge.cgst_amt}, ${additional_charge.sgst_amt}, ${additional_charge.total_amt}, ${invoice.code})`);
await connection.commit();
resultSet = await connection.execute(`select max(code) as invoice_item_additional_charge_code from ac_invoice_additional_charges`);
additional_charge.code = resultSet.rows[0][0];

i++;
} //loop end
}
//Insert invoice_items_additional_charges end

await connection.close();

} // add end

async getAll(filters = {}) {
// filters validation start
if(filters.start_date && new Date(filters.start_date) == 'Invalid Date') {
throw 'Invalid Start Date';
}
if(filters.end_date && new Date(filters.end_date) == 'Invalid Date') {
throw 'Invalid End Date';
}
// filters validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}
let resultSet;
if(filters && filters.start_date && filters.end_date) {
resultSet = await connection.execute(`select aci.code as invoice_number, customer_code, total_items, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, invoice_date, acc.name as customer_name from ac_invoice aci left join ac_customer acc on aci.customer_code = acc.code where invoice_date >= TO_DATE('${filters.start_date}', 'YYYY-MM-DD') AND invoice_date <= TO_DATE('${filters.end_date}', 'YYYY-MM-DD') order by invoice_number desc`);
}
else {
resultSet = await connection.execute(`select aci.code as invoice_number, customer_code, total_items, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, invoice_date, acc.name as customer_name from ac_invoice aci left join ac_customer acc on aci.customer_code = acc.code order by invoice_number desc`);
}
let invoices = [];
let invoice;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
invoice = new entities.Invoice(parseInt(row[0]),row[1],row[2],row[3],row[4],row[5],row[6],row[7],null,null,row[8]);
invoice.customer_name = row[9].trim();
invoices.push(invoice);
i++;
}
await connection.close();
return invoices;

} // getAll end

async getByCode(code) {
if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select aci.code as invoice_number, customer_code, total_items, taxable_amt, igst_amt, cgst_amt, sgst_amt, total_amt, invoice_date, acc.name as customer_name from ac_invoice aci left join ac_customer acc on aci.customer_code = acc.code where aci.code = ${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];

resultSet = await connection.execute(`select acit.code as invoice_item_code, item_code, price, qty, taxable_amt, igst_amt, sgst_amt, cgst_amt, total_amt, uom_code, acu.name as uom_name, aci.name as item_name from ac_invoice_items acit left join ac_uom acu on acit.uom_code = acu.code left join ac_item aci on acit.item_code = aci.code where invoice_number=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Item unavailable`;
}

let items = [];
let item;
let itemRow;
let i = 0;
while(i < resultSet.rows.length) {
itemRow = resultSet.rows[i];
item = new entities.InvoiceItem(itemRow[0],itemRow[1],itemRow[2],itemRow[3],itemRow[4],itemRow[5],itemRow[6],itemRow[7],itemRow[8],itemRow[9],code);
item.uom_name = itemRow[10]?.trim();
item.item_name = itemRow[11]?.trim();
items.push(item);
i++;
}

resultSet = await connection.execute(`select code, description, taxable_amt, igst_amt, sgst_amt, cgst_amt, total_amt from ac_invoice_additional_charges where invoice_number=${code}`);

let additionalCharges = [];
let additionalCharge;
let additionalRow;
i = 0;
while(i < resultSet.rows.length) {
additionalRow = resultSet.rows[i];
additionalCharge = new entities.InvoiceAdditionalCharge(additionalRow[0],additionalRow[1]?.trim(),additionalRow[2],additionalRow[3],additionalRow[4],additionalRow[5],additionalRow[6],code);
additionalCharges.push(additionalCharge);
i++;
}

let invoice = new entities.Invoice(parseInt(row[0]),row[1],row[2],row[3],row[4],row[5],row[6],row[7],items,additionalCharges,row[8]);
invoice.customer_name = row[9].trim();

await connection.close();
return invoice;

} // getByCode end


}
// invoice class end

class ReceiptManager {

constructor() {}

async add(receipt) {
//basic validation start

if(!receipt.customer_code) {
throw 'Customer Code is required';
}
if(receipt.customer_code <= 0) {
throw '!Invalid Customer Code';
}
if(!receipt.amount) {
throw 'Amount is required';
}
if(receipt.amount <= 0) {
throw 'Amount cannot be nagative';
}

//basic validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect to database';
}

await connection.execute(`insert into ac_receipt (customer_code, amount, narration, receipt_date) values (${receipt.customer_code}, ${receipt.amount}, '${receipt.narration}', TRUNC(SYSDATE))`);
await connection.commit();
let resultSet = await connection.execute(`select max(code) as receipt_number from ac_receipt`);
receipt.code = resultSet.rows[0][0];

resultSet = await connection.execute(`select name from ac_customer where code = ${receipt.customer_code}`);
receipt.customer_name = resultSet.rows[0][0];
await connection.close();

} // add end

async getAll(filters = {search: ''}) {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select acr.code as receipt_number,customer_code,amount,narration,receipt_date,acc.name as customer_name from ac_receipt acr left join ac_customer acc on acr.customer_code = acc.code where lower(acc.name) like lower('${filters.search}%') order by receipt_number desc`);
let receipts = [];
let receipt;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
receipt = new entities.Receipt(
parseInt(row[0]), row[1], row[2], row[3]?.trim(), row[4]);
receipt.customer_name = row[5].trim();
receipts.push(receipt);
i++;
}
await connection.close();
return receipts;

} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select acr.code as receipt_number,customer_code,amount,narration,receipt_date,acc.name as customer_name from ac_receipt acr left join ac_customer acc on acr.customer_code = acc.code where acr.code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
let receipt = new entities.Receipt(parseInt(row[0]), row[1], row[2], row[3]?.trim(), row[4]);
receipt.customer_name = row[5].trim();

await connection.close();
return receipt;

} // getByCode end

async getRemainingBalance(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from ac_customer where code = ${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

resultSet = await connection.execute(`select sum(amount) as receipt_sum from ac_receipt where customer_code = ${code}`);
const receipt_amount = resultSet.rows[0][0];

resultSet = await connection.execute(`select sum(total_amt) as invoice_sum from ac_invoice where customer_code = ${code}`);
const invoice_amount = resultSet.rows[0][0];

const balance = invoice_amount - receipt_amount;
await connection.close();
return { "customer_code": code, "balance": balance };

}

}
// receipt class end

class CustomerTransactionManager {

constructor() {}

async getAll() {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select acct.code as customer_transaction_code, customer_code, total_sales, total_receipts, opening_balance, name, opening_balance + total_sales - total_receipts as balance from ac_customer_transactions acct left join ac_customer acc on acct.customer_code = acc.code order by acc.name`);
let customers = [];
let customer;
let row;
let i = 0;

while(i < resultSet.rows.length) {
row = resultSet.rows[i];
customer = new entities.CustomerTransaction(row[0], row[1], row[2], row[3], row[4]);
customer.customer_name = row[5].trim();
customer.balance = row[6];
customers.push(customer);
i++;
}

await connection.close();
return customers;

} // getAll end

}

module.exports = { UnitOfMeasurementManager, ItemManager, StateManager, TraderManager, CustomerManager, InvoiceManager, ReceiptManager, CustomerTransactionManager };