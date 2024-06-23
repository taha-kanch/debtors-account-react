import React from 'react';
import { 
Container, styled, Paper, Typography, Box, IconButton, Fab, TextField,
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
Grid, FormControl, Button, Select, MenuItem
} 
from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Formik, Form as FormikForm } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { InvoiceItemSchema } from '../schema';
import { buildQueryString } from '../utils';
import { 
Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon, Edit as EditIcon
}
from '@mui/icons-material';


const PageBox = styled(Paper)(({ theme }) => ({
'& .heading': {
display: 'flex',
justifyContent: 'center',
fontSize: '24px',
fontWeight: '600',
padding: '5px'
},
'& .record_not_found': {
'minHeight': '100px',
'display': 'flex',
'alignItems': 'center',
'justifyContent': 'center',
'fontWeight': '600',
'fontSize': '24px',
'borderRadius': '5px'
},

}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
backgroundColor: '#1976d2',
color: theme.palette.common.white,
textTransform: 'uppercase'
},
[`&.${tableCellClasses.body}`]: {
fontSize: 14,
},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
backgroundColor: theme.palette.action.hover,
},
// hide last border
'&:last-child td, &:last-child th': {
border: 0,
},
}));

const getTrader = () => {

return new Promise((resolve, reject) => {
fetch('/getTrader')
.then(res => {
if(!res.ok) {
throw Error('Unable to fetch trader, please try after sometime');
}
return res.json();
})
.then(trader => resolve(trader))
.catch(err => reject(err.message))
});

}

const getCustomers = () => {

let dataToSend = {};
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/getCustomers${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`).then(res => {
if(!res.ok) {
throw Error('Unable to fetch customers, please try after sometime');
}
return res.json();
})
.then(customers => resolve(customers))
.catch(err => reject(err.message))
});

}

const getItems = () => {

let dataToSend = {};
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/getItems${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`).then(res => {
if(!res.ok) {
throw Error('Unable to fetch items, please try after sometime');
}
return res.json();
})
.then(items => resolve(items))
.catch(err => reject(err.message))
});

}

const getUnitOfMeasurementsByItemCode = (code) => {

let dataToSend = {
itemCode: code
};
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/getUnitOfMeasurementsByItemCode${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`).then(res => {
if(!res.ok) {
throw Error('Unable to fetch unit of measurements, please try after sometime');
}
return res.json();
})
.then(units => resolve(units))
.catch(err => reject(err.message))
});

}

const addInvoice = (invoice) => {

return new Promise((resolve, reject) => {
fetch('/addInvoice', {
"method": "POST",
"headers": {
"Content-Type": "application/json"
},
"body": JSON.stringify(invoice)
})
.then(res => {
if(!res.ok) {
throw Error('Unable to create invoice, please try after sometime');
}
return res.json();
})
.then(data => resolve(data))
.catch(err => reject(err.message))
});

}

const columns = [
{ id: 'sno', label: 'S.No' },
{ id: 'name', label: 'Item' },
{ id: 'price', label: 'Price' },
{ id: 'qty', label: 'Qty' },
{ id: 'sgst_amt', label: 'SGST' },
{ id: 'cgst_amt', label: 'CGST' },
{ id: 'igst_amt', label: 'IGST' },
{ id: 'total_amt', label: 'Amount' },
{ id: 'action', label: '' },
];

const CreateInvoicePage = (props) => {

const [invoiceItems, setInvoiceItems] = React.useState([]);
const [additionalCharges, setAdditionalCharges] = React.useState([]);
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [deleteItemId, setDeleteItemId] = React.useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
const [openAddItemDialog, setOpenAddItemDialog] = React.useState(false);
const [item, setItem] = React.useState(null);
const [isInterState, setIsInterState] = React.useState(false);
const [customer, setCustomer] = React.useState('');
const [invoiceItemsTotal, setInvoiceItemsTotal] = React.useState(0);
const [subTotal, setSubTotal] = React.useState(0);
const [netTotal, setNetTotal] = React.useState(0);
const [roundOffAmount, setRoundOffAmount] = React.useState(0);

React.useEffect(() => {

getItems().then(
(data) => {
props.dispatch({
type: 'GET_ITEMS',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);

React.useEffect(() => {

getCustomers().then(
(data) => {
props.dispatch({
type: 'GET_CUSTOMERS',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);

React.useEffect(() => {

getTrader().then(
(data) => {
props.dispatch({
type: 'GET_TRADER',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);

React.useEffect(() => {
calculateNetTotal();
},[invoiceItems, additionalCharges]);

const addAdditionalChargesField = () => {
const fields = [...additionalCharges];
fields.push({ id: fields.length + 1, taxable_amt: 0, sgst: 0, sgst_amt: 0, cgst: 0, cgst_amt: 0, igst: 0, igst_amt: 0, total_amt: 0 });
setAdditionalCharges(fields);
}

const removeAdditionalChargesField = (id) => {
const fields = [...additionalCharges];
const idx = fields.findIndex(field => field.id == id);
fields.splice(idx, 1);
setAdditionalCharges(fields);
}

const handleAdditionalFieldChange = (evt, idx) => {
const updatedAdditionalCharges = [...additionalCharges];

const additionalInfo = updatedAdditionalCharges[idx];
additionalInfo[evt.target.name] = evt.target.value;

if(isInterState) {
additionalInfo['igst_amt'] = (parseFloat(additionalInfo['igst']) / 100) * parseFloat(additionalInfo['taxable_amt']);
}
else {
additionalInfo['sgst_amt'] = (parseFloat(additionalInfo.sgst) / 100) * parseFloat(additionalInfo.taxable_amt);
additionalInfo['cgst_amt'] = (parseFloat(additionalInfo.cgst) / 100) * parseFloat(additionalInfo.taxable_amt);
}
additionalInfo['total_amt'] = parseFloat(additionalInfo.taxable_amt) + additionalInfo['cgst_amt'] + additionalInfo['sgst_amt'] + additionalInfo['igst_amt'];
setAdditionalCharges([...updatedAdditionalCharges]);
}

const onDelete = () => {
const updatedInvoiceItems = [...invoiceItems];
const idx = updatedInvoiceItems.findIndex(item => item.code == deleteItemId);
const oldAmount = updatedInvoiceItems[idx].total_amt;
setInvoiceItemsTotal((t) => t - oldAmount);
updatedInvoiceItems.splice(idx, 1);
setInvoiceItems(updatedInvoiceItems);
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: 'Delete Removed' });
setOpenDeleteDialog(false);
}


const onSuccess = (msg, values, isNew) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: msg });
setOpenAddItemDialog(false);
const updatedInvoiceItems = [...invoiceItems];

const { name, sgst, cgst, igst } = props.items.data.find(item => item.code == values.item_code);
let taxable_amt = values.price * values.qty;
let igst_amt = 0, sgst_amt = 0, cgst_amt = 0;
if(isInterState) {
igst_amt = ((igst / 100) * values.price) * values.qty;
}
else {
sgst_amt = ((sgst / 100) * values.price) * values.qty;
cgst_amt = ((cgst / 100) * values.price) * values.qty;
}
  
let total_amt = taxable_amt + cgst_amt + sgst_amt + igst_amt;

if(isNew) {
updatedInvoiceItems.push({ ...values, taxable_amt, name, cgst, cgst_amt, sgst, sgst_amt, igst, igst_amt, total_amt });
setInvoiceItemsTotal((t) => t + total_amt);
}
else {
const idx = updatedInvoiceItems.findIndex(item => item.code == values.code);
const oldAmount = updatedInvoiceItems[idx].total_amt
setInvoiceItemsTotal((t) => t - oldAmount + total_amt)
updatedInvoiceItems[idx] = {...values, taxable_amt, name, cgst, cgst_amt, sgst, sgst_amt, igst, igst_amt, total_amt};
}
setInvoiceItems(updatedInvoiceItems);
}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const handleChangeItem = (itemCode) => {
getUnitOfMeasurementsByItemCode(itemCode).then(
(data) => {
props.dispatch({
type: 'GET_UNIT_OF_MEASUREMENTS_BY_ITEM_CODE',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

}

const handleCustomerChange = (evt) => {
setCustomer(evt.target.value);
const customer = props.customers.data.find(c => c.code == evt.target.value);
setIsInterState(customer.state_code != props.trader.data.state_code);
clearInvoice();
}

const calculateNetTotal = () => {

let total = 0;
const additionalChargesTotal = additionalCharges.reduce((accumulator, row) => accumulator + row.total_amt , 0);
total = parseFloat(invoiceItemsTotal) + parseFloat(additionalChargesTotal);
if((total - Math.round(total)) !== 0 ) {

let roundOff = Math.round(total) - total;
setSubTotal(total);
setRoundOffAmount(roundOff < 0 ? (-1)*roundOff  : roundOff);
setNetTotal(Math.round(total));
}
else {
setSubTotal(total);
setRoundOffAmount(0);
setNetTotal(total);
}
}

const handleDeleteItem = (id) => {
setDeleteItemId(id);
setOpenDeleteDialog(true);
}

const clearInvoice = () => {
setInvoiceItems([]);
setAdditionalCharges([]);
setInvoiceItemsTotal(0);
setSubTotal(0);
setNetTotal(0)
setRoundOffAmount(0);
}


const submitInvoice = () => {

let net_taxable_amt = 0;
let net_igst_amt = 0;
let net_sgst_amt = 0;
let net_cgst_amt = 0;

net_taxable_amt = net_taxable_amt + invoiceItems.reduce((accumulator, row) => accumulator + row.taxable_amt, 0);
net_taxable_amt = net_taxable_amt + additionalCharges.reduce((accumulator, row) => accumulator + Number(row.taxable_amt), 0);

if(isInterState) {
net_igst_amt = net_igst_amt + invoiceItems.reduce((accumulator, row) => accumulator + row.igst_amt, 0);
net_igst_amt = net_igst_amt + additionalCharges.reduce((accumulator, row) => accumulator + Number(row.igst_amt), 0);
}
else {
net_sgst_amt = net_sgst_amt + invoiceItems.reduce((accumulator, row) => accumulator + row.sgst_amt, 0);
net_sgst_amt = net_sgst_amt + additionalCharges.reduce((accumulator, row) => accumulator + Number(row.sgst_amt), 0);

net_cgst_amt = net_cgst_amt + invoiceItems.reduce((accumulator, row) => accumulator + row.cgst_amt, 0);
net_cgst_amt = net_cgst_amt + additionalCharges.reduce((accumulator, row) => accumulator + Number(row.cgst_amt), 0);
}

let invoiceJSON = {
"customer_code": customer,
"total_items": invoiceItems.length,
"taxable_amt": net_taxable_amt,
"igst_amt": net_igst_amt,
"sgst_amt": net_sgst_amt,
"cgst_amt": net_cgst_amt,
"total_amt": netTotal,
items: invoiceItems,
additional_charges: additionalCharges
}

addInvoice(invoiceJSON).then(
(data) => {
setOpenAlertBox(true);
if(data.success) {
setAlertBoxProps({ type:'success', message: 'Invoice Created' });
clearInvoice();
setCustomer('');
}
else {
setAlertBoxProps({ type:'error', message: data.error });
}
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: err });
}
);

}

return (
<React.Fragment>

<PageBox>

{
openAddItemDialog && <AddOrEditItem
isOpen={openAddItemDialog}
onClose={() => setOpenAddItemDialog(false)}
items={props.items.data}
unitOfMeasurements={props.unitOfMeasurementsByItemCode?.data}
onSuccess={onSuccess}
onError={onError}
item={item}
handleChangeItem={handleChangeItem}
/>
}

{
openDeleteDialog && <ConfirmDelete
isOpen={openDeleteDialog}
onClose={() => setOpenDeleteDialog(false)}
onDelete={onDelete}
/>
}

<AlertMessage
isOpen={openAlertBox}
onClose={() => setOpenAlertBox(false)}
alertProps={alertBoxProps}
/>

<Typography component='div' className='heading' >Create Invoice</Typography>

<Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
<Select
sx={{ width: '30%' }}
displayEmpty
onChange={handleCustomerChange}
value={customer}
id='customer'
name='customer'
renderValue={
customer !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select Customer</span>
}
>
{
props.customers.data?.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>

<Fab color="primary" onClick={() => {
if(!customer) {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:'Please select Customer' });
} else {
setOpenAddItemDialog(true);
setItem(null);
}
}}>
<AddIcon />
</Fab>
</Box>

<TableContainer sx={{ maxHeight: 440 }}>
<Table stickyHeader>
<TableHead>
<StyledTableRow>
{columns.map((column) => (
<StyledTableCell
key={column.id}
align={column.align}
style={{ minWidth: column.minWidth }}
>
{column.label}
</StyledTableCell>
))}
</StyledTableRow>
</TableHead>
<TableBody>
{
invoiceItems.length > 0 ? (
<>
{
invoiceItems.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.name} </StyledTableCell>
<StyledTableCell> &#8377;{row.price.toFixed(2)} </StyledTableCell>
<StyledTableCell> {row.qty} </StyledTableCell>
<StyledTableCell> &#8377;{isInterState ? 0 : row.sgst_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> &#8377;{isInterState ? 0 : row.cgst_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> &#8377;{isInterState ? row.igst_amt.toFixed(2) : 0} </StyledTableCell>
<StyledTableCell> &#8377;{row.total_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell>
<IconButton onClick={() => {
setOpenAddItemDialog(true);
setItem(row);
}}><EditIcon/></IconButton>
<IconButton onClick={() => handleDeleteItem(row.code)}><DeleteIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
}
<StyledTableRow>
<StyledTableCell colSpan='7' align='center' sx={{ textTransform: 'uppercase' }} ><b>Additional Charges</b></StyledTableCell>
<StyledTableCell colSpan='1' sx={{ textTransform: 'uppercase' }} ><b>Sub Total</b></StyledTableCell>
<StyledTableCell colSpan='1' sx={{ textTransform: 'uppercase' }} ><b>&#8377;{invoiceItemsTotal.toFixed(2)}</b></StyledTableCell>
</StyledTableRow>

{
additionalCharges.map((charge, idx) => (
<StyledTableRow key={idx}>
<StyledTableCell>  
<TextField
id="description"
name="description"
label="Description"
type="text"
value={charge.description}
onChange={(evt) => handleAdditionalFieldChange(evt, idx)}
variant="standard"
/>
</StyledTableCell>
<StyledTableCell> 
<TextField
id="taxable_amt"
name="taxable_amt"
label="Amount"
type="text"
value={charge.taxable_amt}
onChange={(evt) => handleAdditionalFieldChange(evt, idx)}
variant="standard"
/>
</StyledTableCell>
<StyledTableCell> 
<TextField
id="igst"
name="igst"
label="IGST %"
type="text"
value={charge.igst}
onChange={(evt) => handleAdditionalFieldChange(evt, idx)}
disabled={!isInterState}
variant="standard"
/>
</StyledTableCell>
<StyledTableCell> 
<TextField
id="sgst"
name="sgst"
label="SGST %"
type="text"
value={charge.sgst}
onChange={(evt) => handleAdditionalFieldChange(evt, idx)}
disabled={isInterState}
variant="standard"
/>
</StyledTableCell>
<StyledTableCell> 
<TextField
id="cgst"
name="cgst"
label="CGST %"
type="text"
value={charge.cgst}
onChange={(evt) => handleAdditionalFieldChange(evt, idx)}
disabled={isInterState}
variant="standard"
/>
</StyledTableCell>
<StyledTableCell>
<IconButton onClick={() => removeAdditionalChargesField(charge.id)}>
<DeleteIcon />
</IconButton>
</StyledTableCell>
<StyledTableCell colSpan={'3'} align='center'>
<b>&#8377;{charge.total_amt.toFixed(2)}</b>
</StyledTableCell>
</StyledTableRow>
))
}
<StyledTableRow>
<StyledTableCell colSpan='9' align='center'><IconButton onClick={addAdditionalChargesField}><AddIcon/></IconButton></StyledTableCell>
</StyledTableRow>

<StyledTableRow>
<StyledTableCell colSpan='8' align='right' sx={{ textTransform: 'uppercase' }} ><b>Total</b></StyledTableCell>
<StyledTableCell>&#8377;{subTotal.toFixed(2)}</StyledTableCell>
</StyledTableRow>

<StyledTableRow>
<StyledTableCell colSpan='8' align='right' sx={{ textTransform: 'uppercase' }} ><b>Round Off</b></StyledTableCell>
<StyledTableCell>&#8377;{roundOffAmount.toFixed(2)}</StyledTableCell>
</StyledTableRow>

<StyledTableRow>
<StyledTableCell colSpan='8' align='right' sx={{ textTransform: 'uppercase' }} ><b>Net Total</b></StyledTableCell>
<StyledTableCell>&#8377;{netTotal.toFixed(2)}</StyledTableCell>
</StyledTableRow>

</>
) : (
<StyledTableRow>
<StyledTableCell colSpan={9}>
<div className='record_not_found'>No Item Added</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>

{
invoiceItems.length > 0 && (
<Box sx={{ display: 'flex', justifyContent: 'end', padding: '10px' }}>
<Button variant='contained' onClick={submitInvoice}>Submit Invoice</Button>
</Box>
)
}

</PageBox>

</React.Fragment>
);

}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
'& .MuiDialogContent-root': {
padding: theme.spacing(2),
'& .MuiFormControl-root': {
width: '100%',
padding: '5px',
margin: '1px'
},
},
'& .MuiDialogActions-root': {
padding: theme.spacing(1),
'& .delete-btn': {
backgroundColor: 'red',
color: '#fff'
}
},
}));

const AddOrEditItem = ({ isOpen, onClose, items, unitOfMeasurements, onSuccess, onError, handleChangeItem, item }) => {

const isEdit = Boolean(item);

const handleSubmit = (values, actions) => {
values.price =  Number(values.price);
values.qty = Number(values.qty);
if(isEdit) {
onSuccess('Item Updated', values, false);
}
else {
onSuccess('Item Added', values, true);
}
}

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }}>
{isEdit ? 'Edit' : 'Add'} Item
</DialogTitle>
<IconButton
aria-label="close"
onClick={onClose}
sx={{
position: 'absolute',
right: 8,
top: 8,
color: (theme) => theme.palette.grey[500],
}}
>
<CloseIcon />
</IconButton>
<DialogContent dividers>

<Formik
initialValues={{
item_code: item?.item_code || '',
price: item?.price || 0,
uom_code: item?.uom_code || '',
qty: item?.qty || 0
}}
onSubmit={handleSubmit}
validationSchema={InvoiceItemSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<Grid container>

<Grid item xs={12} md={6}>
<FormControl fullWidth>
<Select
displayEmpty
onChange={(evt) => {
handleChangeItem(evt.target.value)
handleChange(evt);
}}
value={values.item_code}
id='item_code'
name='item_code'
error={Boolean(touched.item_code && errors?.item_code)}
renderValue={
values.item_code !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select Item</span>
}
>
{
items.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>
{Boolean(touched.item_code && errors.item_code) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.item_code}
</Typography>
) : (
''
)}
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="price"
name="price"
label="Price"
type="text"
value={values.price}
onChange={handleChange}
variant="standard"
error={Boolean(touched.price && errors.price)}
helperText={touched.price && errors.price}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl fullWidth>
<Select
displayEmpty
onChange={handleChange}
value={values.uom_code}
id='uom_code'
name='uom_code'
error={Boolean(touched.uom_code && errors?.uom_code)}
disabled={!Boolean(values.item_code)}
renderValue={
values.uom_code !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select Unit Of Measurement</span>
}
>
{
unitOfMeasurements?.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>
{Boolean(touched.uom_code && errors.uom_code) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.uom_code}
</Typography>
) : (
''
)}
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="qty"
name="qty"
label="qty"
type="text"
value={values.qty}
onChange={handleChange}
variant="standard"
error={Boolean(touched.qty && errors.qty)}
helperText={touched.qty && errors.qty}
/>
</FormControl>
</Grid>

</Grid>

<DialogActions>
<Button type='submit' autoFocus variant='contained'>
{ isEdit ? 'Update' : 'Add' }
</Button>
</DialogActions>

</FormikForm>

)}
</Formik>

</DialogContent>
</BootstrapDialog>

</React.Fragment>
)

}

const ConfirmDelete = ({ isOpen, onClose, onDelete }) => {

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
Delete Customer
</DialogTitle>
<DialogContent>
<DialogContentText>
<Typography variant='strong' fontWeight='600' color='red'>Are you sure you want to delete this item ?</Typography>
</DialogContentText>
</DialogContent>
<DialogActions>
<Button type='button' onClick={onClose}> Cancel </Button>
<Button type='button' variant='contained' className='delete-btn' onClick={onDelete} > Delete </Button>
</DialogActions>
</BootstrapDialog>

</React.Fragment>
)

}

const AlertMessage = ({ isOpen, onClose, alertProps }) => {

return (
<Snackbar
open={isOpen}
autoHideDuration={3000} 
onClose={onClose} 
anchorOrigin={{
"vertical": "bottom",
"horizontal":"center"
}}
>
<Alert
onClose={onClose}
severity={alertProps.type}
variant="filled"
sx={{ width: '100%' }}
>
{alertProps.message}
</Alert>
</Snackbar>
)

}


const mapStateToProps = (state) => {
return {
items: state.items,
customers: state.customers,
unitOfMeasurementsByItemCode: state.unitOfMeasurementsByItemCode,
trader: state.trader
};
}

export default connect(mapStateToProps)(CreateInvoicePage);