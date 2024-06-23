import React from 'react';
import { 
FormControl, Input, InputAdornment, Box, Typography, styled, Paper, 
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, 
SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton, Button, TextField, Grid, Select, MenuItem,
Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormLabel
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { 
Search as SearchIcon, Save as SaveIcon, Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { Formik, Form as FormikForm } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { CustomerSchema } from '../schema';
import { buildQueryString } from '../utils';

const columns = [
{ id: 'sno', label: 'S.No' },
{ id: 'code', label: 'Code' },
{ id: 'name', label: 'Name' },
{ id: 'address', label: 'Address' },
{ id: 'action', label: 'Action' }
];

const PageBox = styled('div')(({ theme }) => ({

'.header-wrap': {
display: 'flex',
justifyContent: 'space-between',
alignItem: 'center',
marginBottom: '15px',
'& .MuiFormControl-root': {
width: '300px',
'& .MuiInputBase-root': {
'borderRadius': '10px',
'textTransform': 'capitalize',
}
},
'& .heading': {
fontSize: '24px',
fontWeight: 500
}
},
'& .record_not_found': {
'minHeight': '200px',
'display': 'flex',
'alignItems': 'center',
'justifyContent': 'center',
'fontWeight': '700',
'fontSize': '30px',
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

const getCustomers = (filters) => {

let dataToSend = {
page: filters.page + 1,
limit: filters.limit,
search: filters.search,
is_deleted: 'N'
}
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

const getStates = () => {

return new Promise((resolve, reject) => {
fetch('/getStates')
.then(res => {
if(!res.ok) {
throw Error('Unable to fetch states, please try after sometime');
}
return res.json();
})
.then(states => resolve(states))
.catch(err => reject(err.message))
});

}

const addCustomer = (customer) => {

return new Promise((resolve, reject) => {
fetch('/addCustomer', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: customer
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const updateCustomer = (customer) => {

return new Promise((resolve, reject) => {
fetch('/updateCustomer', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: customer
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const removeCustomer = (id) => {

return new Promise((resolve, reject) => {
fetch(`/removeCustomer?code=${id}`)
.then(res => {
if(!res.ok) {
throw Error('Unable to delete customer, please try after sometime');
}
return res.json();
})
.then(data => resolve(data))
.catch(err => reject(err.message))
});

}

const OPENING_BALANCE_TYPE = [
{ label: 'Debit Balance', value: 'DR' },
{ label: 'Credit Balance', value: 'CR' }
];

const CustomerPage = (props) => {

const [customer, setCustomer] = React.useState(null);
const [openAddCustomerDialog, setOpenAddCustomerDialog] = React.useState(false);
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
search: '',
page: 0,
limit: 5
});
const [deleteCustomerId, setDeleteCustomerId] = React.useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

React.useEffect(() => {

getCustomers(filters).then(
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

},[filters])

React.useEffect(() => {

getStates().then(
(data) => {
props.dispatch({
type: 'GET_STATES',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);

const handleChangePage = (event, newPage) => {
setFilters({...filters, page: newPage});
};

const handleChangeRowsPerPage = (event) => {
setFilters({...filters, page:0, limit: event.target.value});
};

const onSearch = (evt) => {
const searchVal = evt.target.value;
setFilters({
...filters,
page: 0,
search: searchVal
});
}

const onSuccess = (msg, values, isNew) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: msg });
setOpenAddCustomerDialog(false);

if(isNew) {
props.dispatch({
type: 'ADD_CUSTOMER',
payload: values
});
}
else {
props.dispatch({
type: 'UPDATE_CUSTOMER',
payload: values
});
}

}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const handleDeleteCustomer = (id) => {
setDeleteCustomerId(id);
setOpenDeleteDialog(true);
}

const onDelete = () => {
removeCustomer(deleteCustomerId).then(
(data) => {

if(data.success) {
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: 'Delete Removed' });
setOpenDeleteDialog(false);

setFilters({
...filters,
page: 0
});

props.dispatch({
type: 'DELETE_CUSTOMER',
payload: {code: deleteCustomerId}
});

}
else {
setOpenAlertBox(true);
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
<PageBox>

{
openAddCustomerDialog && <CreateOrEditCustomer
isOpen={openAddCustomerDialog}
onClose={() => setOpenAddCustomerDialog(false)}
states={props.states.data}
onSuccess={onSuccess}
onError={onError}
customer={customer}
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

<Box className='header-wrap'>

<Typography component='div' className='heading'>
CUSTOMERS
</Typography>

<Box>
<FormControl variant="standard">
<Input
id="search-box"
placeholder="Search Customers"
onInput={onSearch}
startAdornment={
<InputAdornment position="start">
<SearchIcon />
</InputAdornment>
}
/>
</FormControl>
</Box>

</Box>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
<TableContainer sx={{ maxHeight: 440 }}>
<Table stickyHeader aria-label="sticky table">
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
props.customers.data.length > 0 ? (
props.customers.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.code} </StyledTableCell>
<StyledTableCell> {row.name} </StyledTableCell>
<StyledTableCell> {row.address} </StyledTableCell>
<StyledTableCell>
<IconButton 
onClick={() => {
setOpenAddCustomerDialog(true);
setCustomer(row);
}}
><EditIcon/></IconButton>
<IconButton onClick={() => handleDeleteCustomer(row.code)}><DeleteIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={5}>
<div className='record_not_found'>No Customer Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
{
props.customers.total_records > 0 && ( <TablePagination
rowsPerPageOptions={[5, 10, 15]}
component="div"
count={props.customers.total_records}
rowsPerPage={filters.limit}
page={filters.page}
onPageChange={handleChangePage}
onRowsPerPageChange={handleChangeRowsPerPage}
/>
)}
</Paper>

<Box sx={{ height: 0, transform: 'translateZ(0px)', flexGrow: 1 }}>
<SpeedDial
ariaLabel="SpeedDial basic example"
sx={{ position: 'absolute', bottom: 40, right: 10 }}
icon={<SpeedDialIcon openIcon={<AddIcon />} />}
onClick={() => {
setOpenAddCustomerDialog(true)
setCustomer(null);
}}
>
</SpeedDial>
</Box>

</PageBox>
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
'& .MuiSelect-select': {
'padding': '10px',
'backgroundColor': '#F8F8F8',
},
}));

const CreateOrEditCustomer = ({ isOpen, onClose, customer, states, onSuccess, onError }) => {

const isEdit = Boolean(customer);
const handleSubmit = (values, actions) => {

if(isEdit) {
updateCustomer(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Customer Updated', data.data);
}
else {
onError(data.error);
}
},
(err) => {
console.log(err)
}
)
}
else {
addCustomer(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Customer Added', data.data, true);
}
else {
onError(data.error);
}
},
(err) => {
onError(err);
}
)
}

}

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }}>
{isEdit ? 'Edit' : 'Add New'} Customer
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
code: customer?.code || 0,
name: customer?.name || '',
address: customer?.address || '',
reg_title_1: customer?.reg_title_1 || '',
reg_value_1: customer?.reg_value_1 || '',
reg_title_2: customer?.reg_title_2 || '',
reg_value_2: customer?.reg_value_2 || '',
reg_title_3: customer?.reg_title_3 || '',
reg_value_3: customer?.reg_value_3 || '',
contact_1: customer?.contact_1 || '',
contact_2: customer?.contact_2 || '',
contact_3: customer?.contact_3 || '',
state_code: customer?.state_code || '',
opening_balance: customer?.opening_balance || 0,
opening_balance_type: customer?.opening_balance_type || 'DR',
}}
onSubmit={handleSubmit}
validationSchema={CustomerSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<Grid container>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="name"
name="name"
label="Name"
type="text"
value={values.name}
onChange={handleChange}
variant="standard"
error={Boolean(touched.name && errors.name)}
helperText={touched.name && errors.name}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="address"
name="address"
label="Address"
type="text"
value={values.address}
onChange={handleChange}
variant="standard"
error={Boolean(touched.address && errors.address)}
helperText={touched.address && errors.address}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="reg_title_1"
name="reg_title_1"
label="Document 1 Name"
type="text"
value={values.reg_title_1}
onChange={handleChange}
variant="standard"
error={Boolean(touched.reg_title_1 && errors.reg_title_1)}
helperText={touched.reg_title_1 && errors.reg_title_1}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="reg_value_1"
name="reg_value_1"
label="Document 1 Value"
type="text"
value={values.reg_value_1}
onChange={handleChange}
variant="standard"
error={Boolean(touched.reg_value_1 && errors.reg_value_1)}
helperText={touched.reg_value_1 && errors.reg_value_1}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="reg_title_2"
name="reg_title_2"
label="Document 2 Name"
type="text"
value={values.reg_title_2}
onChange={handleChange}
variant="standard"
error={Boolean(touched.reg_title_2 && errors.reg_title_2)}
helperText={touched.reg_title_2 && errors.reg_title_2}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="reg_value_2"
name="reg_value_2"
label="Document 2 Value"
type="text"
value={values.reg_value_2}
onChange={handleChange}
variant="standard"
error={Boolean(touched.reg_value_2 && errors.reg_value_2)}
helperText={touched.reg_value_2 && errors.reg_value_2}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="reg_title_3"
name="reg_title_3"
label="Document 3 Name"
type="text"
value={values.reg_title_3}
onChange={handleChange}
variant="standard"
error={Boolean(touched.reg_title_3 && errors.reg_title_3)}
helperText={touched.reg_title_3 && errors.reg_title_3}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="reg_value_3"
name="reg_value_3"
label="Document 3 Value"
type="text"
value={values.reg_value_3}
onChange={handleChange}
variant="standard"
error={Boolean(touched.reg_value_3 && errors.reg_value_3)}
helperText={touched.reg_value_3 && errors.reg_value_3}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="contact_1"
name="contact_1"
label="Contact 1"
type="text"
value={values.contact_1}
onChange={handleChange}
variant="standard"
error={Boolean(touched.contact_1 && errors.contact_1)}
helperText={touched.contact_1 && errors.contact_1}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="contact_2"
name="contact_2"
label="Contact 2"
type="text"
value={values.contact_2}
onChange={handleChange}
variant="standard"
error={Boolean(touched.contact_2 && errors.contact_2)}
helperText={touched.contact_2 && errors.contact_2}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="contact_3"
name="contact_3"
label="Contact 3"
type="text"
value={values.contact_3}
onChange={handleChange}
variant="standard"
error={Boolean(touched.contact_3 && errors.contact_3)}
helperText={touched.contact_3 && errors.contact_3}
/>
</FormControl>
</Grid>
<Grid item xs={12} md={6}>
<FormControl fullWidth>
<Select
displayEmpty
onChange={handleChange}
value={values.state_code}
id='state_code'
name='state_code'
error={Boolean(touched.state_code && errors?.state_code)}
renderValue={
values.state_code !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select State</span>
}
>
{
states.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>
{Boolean(touched.state_code && errors.state_code) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.state_code}
</Typography>
) : (
''
)}
</FormControl>
</Grid>

{
!isEdit && (
<>
<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="opening_balance"
name="opening_balance"
label="Opening Balance"
type="text"
value={values.opening_balance}
onChange={handleChange}
variant="standard"
error={Boolean(touched.opening_balance && errors.opening_balance)}
helperText={touched.opening_balance && errors.opening_balance}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl fullWidth>
<Select
displayEmpty
onChange={handleChange}
value={values.opening_balance_type}
id='opening_balance_type'
name='opening_balance_type'
error={Boolean(touched.opening_balance_type && errors?.opening_balance_type)}
>
{
OPENING_BALANCE_TYPE.map((option, index) => (
<MenuItem value={option.value}>{option.label}</MenuItem>
))
}
</Select>
{Boolean(touched.state_code && errors.state_code) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.state_code}
</Typography>
) : (
''
)}
</FormControl>
</Grid>
</>
)}

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
<Typography variant='strong' fontWeight='600' color='red'>Are you sure you want to delete this customer ?</Typography>
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
customers: state.customers,
states: state.states
}
}


export default connect(mapStateToProps)(CustomerPage);