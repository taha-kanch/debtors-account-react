export default function debtorsReducer(
state={
items: { data: [], total_records: 0 },
unitOfMeasurements: { data: [], total_records: 0 },
customers: { data: [], total_records: 0 },
states: { data: [], total_records: 0 },
trader: { data: {} },
unitOfMeasurementsByItemCode: { data: [], total_records: 0 },
invoices: { data: [], total_records: 0 },
invoiceDetail: { data: {} },
receipts: { data: [], total_records: 0 },
outstandingReport: { data: [], total_records: 0 }
},
action
) {

if(action.type == 'GET_ITEMS') {
state= { ...state, items: action.payload};
}

if(action.type == 'ADD_ITEM') {
const itemsData = state.items.data;
let total_records = state.items.total_records + 1;
itemsData.unshift(action.payload);
state = {...state, items: { "data": itemsData, "total_records": total_records }};
}

if(action.type == 'DELETE_ITEM') {
const afterRemovingItem  = state.items.data.filter(item => item.code != action.payload.code);
state = { ...state, items: { "data": afterRemovingItem, "total_records": state.items.total_records - 1 } };
}

if(action.type == 'UPDATE_ITEM') {
const idx = state.items.data.findIndex(item => item.code == action.payload.code);
if(idx != -1) state.items.data[idx] = action.payload;
}

if(action.type == 'GET_UNIT_OF_MEASUREMENTS') {
state= { ...state, unitOfMeasurements: action.payload};
}

if(action.type == 'ADD_UNIT_OF_MEASUREMENTS') {
const unitsData = state.unitOfMeasurements.data;
let total_records = state.unitOfMeasurements.total_records;
action.payload.forEach((unit) => {
unitsData.unshift(unit);
total_records++;
});
state = {...state, unitOfMeasurements: { "data": unitsData, "total_records": total_records }};
}

if(action.type == 'GET_CUSTOMERS') {
state= { ...state, customers: action.payload};
}

if(action.type == 'ADD_CUSTOMER') {
const customersData = state.customers.data;
let total_records = state.customers.total_records + 1;
customersData.unshift(action.payload);
state = {...state, customers: { "data": customersData, "total_records": total_records }};
}

if(action.type == 'DELETE_CUSTOMER') {
const afterRemovingCustomer  = state.customers.data.filter(customer => customer.code != action.payload.code);
state = { ...state, customers: { "data": afterRemovingCustomer, "total_records": state.customers.total_records - 1 } };
}

if(action.type == 'UPDATE_CUSTOMER') {
const idx = state.customers.data.findIndex(customer => customer.code == action.payload.code);
if(idx != -1)  state.customers.data[idx] = action.payload;
}

if(action.type == 'GET_STATES') {
state= { ...state, states: action.payload};
}

if(action.type == 'GET_TRADER') {
state = { ...state, trader: action.payload };
}

if(action.type == 'UPDATE_TRADER') {
state =  { ...state, trader: { data: action.payload } };
}

if(action.type == 'GET_UNIT_OF_MEASUREMENTS_BY_ITEM_CODE') {
state = { ...state, unitOfMeasurementsByItemCode: action.payload };
}

if(action.type == 'GET_INVOICES') {
state= { ...state, invoices: action.payload};
}

if(action.type == 'GET_INVOICE_DETAIL') {
state = { ...state, invoiceDetail: action.payload };
}

if(action.type == 'GET_RECEIPTS') {
state= { ...state, receipts: action.payload};
}

if(action.type == 'ADD_RECEIPT') {
const receiptsData = state.receipts.data;
let total_records = state.receipts.total_records + 1;
receiptsData.unshift(action.payload);
state = {...state, receipts: { "data": receiptsData, "total_records": total_records }};
}

if(action.type == 'GET_OUTSTANDING_REPORT') {
state= { ...state, outstandingReport: action.payload};
}

return state;

}