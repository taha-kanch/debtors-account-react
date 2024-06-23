import React from 'react';
import { 
FormControl, Input, InputAdornment, Box, Typography, styled, Paper, 
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, 
SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton, Button, TextField, Grid, Select, MenuItem,
Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormLabel
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { 
Search as SearchIcon, Save as SaveIcon, Add as AddIcon, Close as CloseIcon, Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Formik, Form as FormikForm } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { ReceiptSchema } from '../schema';
import { buildQueryString, formatDate } from '../utils';

const columns = [
{ id: 'sno', label: 'S.No' },
{ id: 'receiptNumber', label: 'Receipt Number' },
{ id: 'customer', label: 'Customer' },
{ id: 'receipt_date', label: 'Created At' },
{ id: 'action', label: '' }
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

const getCustomers = () => {

let dataToSend = {
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

const getReceipts = (filters) => {

let dataToSend = {
page: filters.page + 1,
limit: filters.limit,
search: filters.search
}
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/getReceipts${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`).then(res => {
if(!res.ok) {
throw Error('Unable to fetch receipts, please try after sometime');
}
return res.json();
})
.then(receipts => resolve(receipts))
.catch(err => reject(err.message))
});

}

const addReceipt = (receipt) => {

return new Promise((resolve, reject) => {
fetch('/addReceipt', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: receipt
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const getRemainingBalance = (customer_code) => {

let dataToSend = {
customer_code
}
const result = buildQueryString(dataToSend);

return new Promise((resolve, reject) => {
fetch(`/getRemainingBalance${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`)
.then(res => {
if (!res.ok) {
throw Error('Unable to fetch remaining balance, please try again');
}
return res.json();
})
.then(res => resolve(res))
.catch(err => reject(err.message));
})

}

const ReceiptsPage = (props) => {

const [receipt, setReceipt] = React.useState(null);
const [openAddReceiptDialog, setOpenAddReceiptDialog] = React.useState(false);
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
search: '',
page: 0,
limit: 5
});

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

},[])

React.useEffect(() => {

getReceipts(filters).then(
(data) => {
props.dispatch({
type: 'GET_RECEIPTS',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[filters]);

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

const onSuccess = (msg, values) => {

setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: msg });
setOpenAddReceiptDialog(false);
props.dispatch({
type: 'ADD_RECEIPT',
payload: values
});

}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const handleViewReceipt = (row) => {
getRemainingBalance(row.customer_code).then(
(data) => {
if(data.success) {
setReceipt({ ...row, ...data.data });
setOpenAddReceiptDialog(true);
}
else {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:data.error });
}
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);
}

return (
<PageBox>

{
openAddReceiptDialog && <CreateAndViewReceipt
isOpen={openAddReceiptDialog}
onClose={() => setOpenAddReceiptDialog(false)}
customers={props.customers.data}
onSuccess={onSuccess}
onError={onError}
receipt={receipt}
/>
}

<AlertMessage
isOpen={openAlertBox}
onClose={() => setOpenAlertBox(false)}
alertProps={alertBoxProps}
/>

<Box className='header-wrap'>

<Typography component='div' className='heading'>
RECEIPTS
</Typography>

<Box>
<FormControl variant="standard">
<Input
id="search-box"
placeholder="Search Receipts"
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
props.receipts.data.length > 0 ? (
props.receipts.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.code} </StyledTableCell>
<StyledTableCell> {row.customer_name} </StyledTableCell>
<StyledTableCell> {formatDate(row.createdAt)} </StyledTableCell>
<StyledTableCell>
<IconButton 
onClick={() => {
handleViewReceipt(row);
}}
><VisibilityIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={5}>
<div className='record_not_found'>No Receipt Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
{
props.receipts.total_records > 0 && ( <TablePagination
rowsPerPageOptions={[5, 10, 15]}
component="div"
count={props.receipts.total_records}
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
setOpenAddReceiptDialog(true)
setReceipt(null);
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
'& .text_label': {
fontSize: '18px',
fontWeight: 'bold'
},
'& .text_value': {
fontSize: '18px',
}
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

const CreateAndViewReceipt = ({ isOpen, onClose, receipt, customers, onSuccess, onError }) => {

const isView = Boolean(receipt);

const handleSubmit = (values, actions) => {

addReceipt(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Receipt Added', data.data);
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

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }}>
{ isView ? 'View' : 'Add New' } Receipt
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
{
!isView ? (
<Formik
initialValues={{
customer_code: receipt?.customer_code || '',
amount: receipt?.amount || '',
narration: receipt?.narration || ''
}}
onSubmit={handleSubmit}
validationSchema={ReceiptSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<Grid container>

<Grid item xs={12}>
<FormControl fullWidth>
<Select
displayEmpty
onChange={handleChange}
value={values.customer_code}
id='customer_code'
name='customer_code'
error={Boolean(touched.customer_code && errors?.customer_code)}
renderValue={
values.customer_code !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select Customer</span>
}
>
{
customers.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>
{Boolean(touched.customer_code && errors.customer_code) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.customer_code}
</Typography>
) : (
''
)}
</FormControl>
</Grid>

<Grid item xs={12}>
<FormControl>
<TextField
id="amount"
name="amount"
label="Amount"
type="text"
value={values.amount}
onChange={handleChange}
variant="standard"
error={Boolean(touched.amount && errors.amount)}
helperText={touched.amount && errors.amount}
/>
</FormControl>
</Grid>

<Grid item xs={12}>
<FormControl fullWidth>
<TextField
id="narration"
name="narration"
label="Narration"
type="text"
value={values.narration}
onChange={handleChange}
variant="standard"
error={Boolean(touched.narration && errors.narration)}
helperText={touched.narration && errors.narration}
/>
</FormControl>
</Grid>

</Grid>

<DialogActions>
<Button type='submit' autoFocus variant='contained'> Add </Button>
</DialogActions>

</FormikForm>

)}
</Formik>
) : (

<Grid container sx={{ width: '400px' }}>

<Grid item xs={12} md={6}>
<Typography variant='p' className='text_label'>Receipt Date</Typography>
</Grid>

<Grid item xs={12} md={6}>
<Typography variant='p' className='text_value'>{formatDate(receipt.receipt_date)}</Typography>
</Grid>

<Grid item xs={12} md={6}>
<Typography variant='p' className='text_label'>Balance</Typography>
</Grid>

<Grid item xs={12} md={6}>
<Typography variant='p' className='text_value'>&#8377;{receipt.balance < 0 ? ((-1) * receipt.balance)+' CR' : (receipt.balance + ' DR') }</Typography>
</Grid>

<Grid item xs={12} md={6}>
<Typography variant='p' className='text_label'>Amount Received</Typography>
</Grid>

<Grid item xs={12} md={6}>
<Typography variant='p' className='text_value'>&#8377;{receipt.amount}</Typography>
</Grid>

</Grid>

)
}


</DialogContent>
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
receipts: state.receipts
}
}


export default connect(mapStateToProps)(ReceiptsPage);