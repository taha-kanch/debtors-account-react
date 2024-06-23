import React from 'react';
import { 
FormControl, Input, InputAdornment, Box, Typography, styled, Paper, 
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, 
IconButton, Button, TextField, Grid, Select, MenuItem
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
{ id: 'customer', label: 'Customer' },
{ id: 'dr_balance', label: 'DR Balance' },
{ id: 'cr_balance', label: 'CR Balance' }
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

const getOutstandingReport = (filters) => {

let dataToSend = {
page: filters.page + 1,
limit: filters.limit,
search: filters.search
}
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/getOutstandingReport${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`).then(res => {
if(!res.ok) {
throw Error('Unable to fetch outstanding report, please try after sometime');
}
return res.json();
})
.then(report => resolve(report))
.catch(err => reject(err.message))
});

}

const BalanceReportPage = (props) => {

const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
search: ''
});

React.useEffect(() => {

getOutstandingReport(filters).then(
(data) => {
props.dispatch({
type: 'GET_OUTSTANDING_REPORT',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[filters])

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

const getTotalDebit =  () => {

if(props.outstandingReport.data.length > 0) {
return props.outstandingReport.data.reduce((accum, row) => {
if(row.balance > 0) {
return accum + row.balance;
}
return accum;
}, 0);
}
return 0;

}

const getTotalCredit =  () => {

if(props.outstandingReport.data.length > 0) {
return props.outstandingReport.data.reduce((accum, row) => {
if(row.balance < 0) {
return accum + (-1 * row.balance);
}
return accum;
}, 0);
}
return 0;

}

return (
<PageBox>

<AlertMessage
isOpen={openAlertBox}
onClose={() => setOpenAlertBox(false)}
alertProps={alertBoxProps}
/>

<Box className='header-wrap'>

<Typography component='div' className='heading'>
OUTSTANDING REPORT
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
props.outstandingReport.data.length > 0 ? (
props.outstandingReport.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.customer_name} </StyledTableCell>
<StyledTableCell> &#8377;{row.balance > 0 ? row.balance : 0 } </StyledTableCell>
<StyledTableCell> &#8377;{row.balance < 0 ? (row.balance * (-1)) : 0 } </StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={4}>
<div className='record_not_found'>No Customers Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
{
props.outstandingReport.data.length > 0 && (
<StyledTableRow>
<StyledTableCell colSpan={2} align='center'><b>Total</b></StyledTableCell>
<StyledTableCell><b>&#8377;{getTotalDebit()}</b></StyledTableCell>
<StyledTableCell><b>&#8377;{getTotalCredit()}</b></StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
</Paper>

</PageBox>
);

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
outstandingReport: state.outstandingReport
}
}


export default connect(mapStateToProps)(BalanceReportPage);