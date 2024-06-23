import React from 'react';
import { 
FormControl, Input, InputAdornment, Box, Typography, styled, Paper, 
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, 
IconButton, Button, TextField, Grid, Select, MenuItem, FormLabel
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { buildQueryString, formatDate } from '../utils';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useNavigate } from 'react-router-dom';

const columns = [
{ id: 'invoice_number', label: 'Invoice' },
{ id: 'created_date', label: 'Created At' },
{ id: 'customer', label: 'Customer' },
{ id: 'taxable_amt', label: 'Taxable Amt' },
{ id: 'sgst_amt', label: 'SGST Amt' },
{ id: 'cgst_amt', label: 'CGST Amt' },
{ id: 'igst_amt', label: 'IGST Amt' },
{ id: 'total_amt', label: 'Total Amt' },
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

const getInvoices = (filters) => {

let dataToSend = {
start_date: filters.start_date,
end_date: filters.end_date,
page: filters.page + 1,
limit: filters.limit
}

const result = buildQueryString(dataToSend);

return new Promise((resolve, reject) => {
fetch(`/getInvoices${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`).then(res => {
if(!res.ok) {
throw Error('Unable to fetch invoices, please try after sometime');
}
return res.json();
})
.then(invoices => resolve(invoices))
.catch(err => reject(err.message))
});

}

const Report = (props) => {

const navigate = useNavigate();
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
start_date: '',
end_date: '',
page: 0,
limit: 5
});

React.useEffect(() => {

getInvoices(filters).then(
(data) => {
props.dispatch({
type: 'GET_INVOICES',
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

return (
<React.Fragment>
<PageBox>

<Box className='header-wrap'>

<Typography component='div' className='heading'>
INVOICES
</Typography>

<Box sx={{ width: '400px' }}>
<LocalizationProvider dateAdapter={AdapterDayjs}>
<DateRangePicker
format='YYYY-MM-DD'
onChange={([start_date, end_date]) => {
if(start_date && end_date) {
setFilters({ ...filters, "start_date": start_date.format('YYYY-MM-DD'), "end_date": end_date?.format('YYYY-MM-DD') })
}
}}
/>
</LocalizationProvider>
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
props.invoices.data.length > 0 ? (
props.invoices.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {row.code} </StyledTableCell>
<StyledTableCell> {formatDate(row.invoice_date)} </StyledTableCell>
<StyledTableCell> {row.customer_name} </StyledTableCell>
<StyledTableCell> &#8377;{row.taxable_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> &#8377;{row.cgst_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> &#8377;{row.sgst_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> &#8377;{row.igst_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> &#8377;{row.total_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell>
<IconButton 
onClick={() => navigate(`/invoice/${row.code}`)}
><VisibilityIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={9}>
<div className='record_not_found'>No Invoices Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
{
props.invoices.total_records > 0 && ( <TablePagination
rowsPerPageOptions={[5, 10, 15]}
component="div"
count={props.invoices.total_records}
rowsPerPage={filters.limit}
page={filters.page}
onPageChange={handleChangePage}
onRowsPerPageChange={handleChangeRowsPerPage}
/>
)}
</Paper>

</PageBox>

</React.Fragment>
);

}

const mapStateToProps = (state) => {
return {
"invoices": state.invoices
};
}

export default connect(mapStateToProps)(Report);