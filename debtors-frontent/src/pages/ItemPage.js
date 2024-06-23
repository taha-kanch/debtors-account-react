import React from 'react';
import { 
FormControl, InputLabel, Input, InputAdornment, Box, Typography, styled, Paper, 
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, 
SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton, Button, TextField, Grid,
Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputBase,
List, ListItem, ListItemButton, ListItemText, ListItemIcon, Checkbox, FormLabel
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { 
Search as SearchIcon, Save as SaveIcon, Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, 
KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon 
} from '@mui/icons-material';
import { Formik, Form as FormikForm } from 'formik';
import CreatableSelect from 'react-select/creatable';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { ItemSchema } from '../schema';
import { buildQueryString } from '../utils';

const columns = [
{ id: 'sno', label: 'S.No' },
{ id: 'code', label: 'Code' },
{ id: 'name', label: 'Name' },
{ id: 'hsn_code', label: 'HSN Code' },
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

const getItems = (filters) => {

let dataToSend = {
page: filters.page + 1,
limit: filters.limit,
search: filters.search,
is_deleted: 'N'
}
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

const getUnitOfMeasurements = () => {

return new Promise((resolve, reject) => {
fetch('/getUnitOfMeasurements')
.then(res => {
if(!res.ok) {
throw Error('Unable to fetch unit of measurements, please try after sometime');
}
return res.json();
})
.then(uom => resolve(uom))
.catch(err => reject(err.message))
});

}

const addItem = (item) => {

return new Promise((resolve, reject) => {
fetch('/addItem', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: item
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const updateItem = (item) => {

return new Promise((resolve, reject) => {
fetch('/updateItem', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: item
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const removeItem = (id) => {

return new Promise((resolve, reject) => {
fetch(`/removeItem?code=${id}`)
.then(res => {
if(!res.ok) {
throw Error('Unable to delete item, please try after sometime');
}
return res.json();
})
.then(data => resolve(data))
.catch(err => reject(err.message))
});

}

const ItemPage = (props) => {

const [item, setItem] = React.useState(null);
const [openAddItemDialog, setOpenAddItemDialog] = React.useState(false);
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
search: '',
page: 0,
limit: 5
});
const [deleteItemId, setDeleteItemId] = React.useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

React.useEffect(() => {

getItems(filters).then(
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

},[filters])

React.useEffect(() => {

getUnitOfMeasurements().then(
(data) => {
props.dispatch({
type: 'GET_UNIT_OF_MEASUREMENTS',
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
setOpenAddItemDialog(false);

if(isNew) {
props.dispatch({
type: 'ADD_ITEM',
payload: values
});
}
else {
props.dispatch({
type: 'UPDATE_ITEM',
payload: values
});
}

}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const onUOMAdd = (units) => {
props.dispatch({
type: 'ADD_UNIT_OF_MEASUREMENTS',
payload: units
});
}

const handleDeleteItem = (id) => {
setOpenDeleteDialog(true);
setDeleteItemId(id);
}

const onDelete = () => {
removeItem(deleteItemId).then(
(data) => {

if(data.success) {
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: 'Item Removed' });
setOpenDeleteDialog(false);

setFilters({
...filters,
page: 0
});

props.dispatch({
type: 'DELETE_ITEM',
payload: {code: deleteItemId}
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
openAddItemDialog && <CreateOrEditItem
isOpen={openAddItemDialog}
onClose={() => setOpenAddItemDialog(false)}
unitOfMeasurements={props.unitOfMeasurements.data}
onSuccess={onSuccess}
onError={onError}
onUOMAdd={onUOMAdd}
item={item}
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
ITEMS
</Typography>

<Box>
<FormControl variant="standard">
<Input
id="search-box"
placeholder="Search Items"
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
props.items.data.length > 0 ? (
props.items.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.code} </StyledTableCell>
<StyledTableCell> {row.name} </StyledTableCell>
<StyledTableCell> {row.hsn_code} </StyledTableCell>
<StyledTableCell>
<IconButton 
onClick={() => {
setOpenAddItemDialog(true);
setItem(row);
}}
><EditIcon/></IconButton>
<IconButton onClick={() => handleDeleteItem(row.code)}><DeleteIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={5}>
<div className='record_not_found'>No Item Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
{
props.items.total_records > 0 && ( <TablePagination
rowsPerPageOptions={[5, 10, 15]}
component="div"
count={props.items.total_records}
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
setOpenAddItemDialog(true)
setItem(null);
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
}));

const CreateOrEditItem = ({ isOpen, onClose, item, unitOfMeasurements, onSuccess, onError, onUOMAdd }) => {

const isEdit = Boolean(item);
const handleSubmit = (values, actions) => {

if(isEdit) {
updateItem(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Item Update', data.data);
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
addItem(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Item Added', data.data, true);
onUOMAdd(data.data.unitOfMeasurements.filter(u => unitOfMeasurements.findIndex(uu => uu.code == u.code) == -1));
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

}

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }}>
{isEdit ? 'Edit' : 'Add New'} Item
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
code: item?.code || 0,
name: item?.name || '', 
hsn_code: item?.hsn_code || '', 
cgst: item?.cgst || '', 
sgst: item?.sgst || '', 
igst: item?.igst || '', 
unitOfMeasurements: item?.unitOfMeasurements || []
}}
onSubmit={handleSubmit}
validationSchema={ItemSchema}
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
id="hsn_code"
name="hsn_code"
label="HSN Code"
type="text"
value={values.hsn_code}
onChange={handleChange}
variant="standard"
error={Boolean(touched.hsn_code && errors.hsn_code)}
helperText={touched.hsn_code && errors.hsn_code}
disabled = {isEdit}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="cgst"
name="cgst"
label="CGST"
type="text"
value={values.cgst}
onChange={handleChange}
variant="standard"
error={Boolean(touched.cgst && errors.cgst)}
helperText={touched.cgst && errors.cgst}
disabled = {isEdit}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="sgst"
name="sgst"
label="SGST"
type="text"
value={values.sgst}
onChange={handleChange}
variant="standard"
error={Boolean(touched.sgst && errors.sgst)}
helperText={touched.sgst && errors.sgst}
disabled = {isEdit}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="igst"
name="igst"
label="IGST"
type="text"
value={values.igst}
onChange={handleChange}
variant="standard"
error={Boolean(touched.igst && errors.igst)}
helperText={touched.igst && errors.igst}
disabled = {isEdit}
/>
</FormControl>
</Grid>

<Grid item xs={12}>
{
isEdit ? (
<Paper sx={{ width: '100%', height: 200, overflow: 'auto' }}>
<FormLabel>Unit Of Measurements</FormLabel>
<List dense component="div" role="list">
{
values?.unitOfMeasurements.map((unit) => (
<ListItem>
<ListItemIcon>
<KeyboardDoubleArrowRightIcon />
</ListItemIcon>
<ListItemText
primary={unit.name}
/>
</ListItem>
))
}
</List>
</Paper>
) : (
<FormControl>
<FormLabel>Select Unit Of Measurements</FormLabel>
<TransferList unitOfMeasurements={unitOfMeasurements} setFieldValue={setFieldValue} selectedOptions={values.unitOfMeasurements || []}/>
{
Boolean(touched.unitOfMeasurements && errors.unitOfMeasurements) ? (
<Typography color='error' style={{ textAlign: 'left' }}>
{errors.unitOfMeasurements}
</Typography>
) : ''
}
</FormControl>
)
}
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
Delete Item
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

function not(a, b) {
return a.filter((value) => b.findIndex(c => c.name == value.name) === -1);
}

function intersection(a, b) {
return a.filter((value) => b.findIndex(c => c.name == value.name) !== -1);
}

const TransferList = ({ unitOfMeasurements = [],  setFieldValue, selectedOptions }) => {
const [checked, setChecked] = React.useState([]);
const [left, setLeft] = React.useState(unitOfMeasurements || []);
const [right, setRight] = React.useState([]);
const [newUnit, setNewUnit] = React.useState(null);
const [newUnitError, setNewUnitError] = React.useState(false);

const leftChecked = intersection(checked, left);
const rightChecked = intersection(checked, right);

React.useEffect(() => {
setFieldValue('unitOfMeasurements', right)
},[right]);

const handleToggle = (value) => () => {
const currentIndex = checked.findIndex(c => c.name == value.name);
const newChecked = [...checked];

if (currentIndex === -1) {
newChecked.push(value);
} else {
newChecked.splice(currentIndex, 1);
}

setChecked(newChecked);
};

const handleAllRight = () => {
setRight(right.concat(left));
setLeft([]);
};

const handleCheckedRight = () => {
setRight(right.concat(leftChecked));
setLeft(not(left, leftChecked));
setChecked(not(checked, leftChecked));
};

const handleCheckedLeft = () => {
setLeft(left.concat(rightChecked));
setRight(not(right, rightChecked));
setChecked(not(checked, rightChecked));
};

const handleAllLeft = () => {
setLeft(left.concat(right));
setRight([]);
};

const handleSubmit = () => {
if(!newUnit) {
setNewUnitError(true);
return;
}
setLeft([...left, {code: 0, name: newUnit}]);
setNewUnit("");
}

const customList = (units) => (
<Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
<List dense component="div" role="list">
{units.map((unit) => {
const labelId = `transfer-list-item-${unit.name}-label`;

return (
<ListItemButton
key={unit.name}
role="listitem"
onClick={handleToggle(unit)}
>
<ListItemIcon>
<Checkbox
checked={checked.findIndex(c => c.name == unit.name) !== -1}
tabIndex={-1}
disableRipple
inputProps={{
'aria-labelledby': labelId,
}}
/>
</ListItemIcon>
<ListItemText id={labelId} primary={unit.name} />
</ListItemButton>
);
})}
</List>
</Paper>
);

return (
<Grid container spacing={2} justifyContent="center" alignItems="center">
<Grid item>{customList(left)}</Grid>
<Grid item>
<Grid container direction="column" alignItems="center">
<Button
sx={{ my: 0.5 }}
variant="outlined"
size="small"
onClick={handleAllRight}
disabled={left.length === 0}
aria-label="move all right"
>
≫
</Button>
<Button
sx={{ my: 0.5 }}
variant="outlined"
size="small"
onClick={handleCheckedRight}
disabled={leftChecked.length === 0}
aria-label="move selected right"
>
&gt;
</Button>
<Button
sx={{ my: 0.5 }}
variant="outlined"
size="small"
onClick={handleCheckedLeft}
disabled={rightChecked.length === 0}
aria-label="move selected left"
>
&lt;
</Button>
<Button
sx={{ my: 0.5 }}
variant="outlined"
size="small"
onClick={handleAllLeft}
disabled={right.length === 0}
aria-label="move all left"
>
≪
</Button>
</Grid>
</Grid>
<Grid item>{customList(right)}</Grid>

<Grid item>
<FormControl variant="standard">
<Input
id="unit"
name='unit'
value={newUnit}
placeholder="Add New Unit"
onChange={(evt) => { 
if(evt.target.value.length > 0) {
setNewUnitError(false);
}
setNewUnit(evt.target.value)
}}
error={Boolean(newUnitError)}
endAdornment={
<InputAdornment position="end">
<IconButton type='button' onClick={handleSubmit}>
<AddIcon />
</IconButton>
</InputAdornment>
}
/>
</FormControl>
</Grid>

</Grid>
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
items: state.items,
unitOfMeasurements: state.unitOfMeasurements
}
}


export default connect(mapStateToProps)(ItemPage);