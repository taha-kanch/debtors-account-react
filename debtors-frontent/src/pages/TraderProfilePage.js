import React from 'react';
import { 
FormControl, Input, InputAdornment, Box, Typography, styled, Paper,
IconButton, Button, TextField, Grid, Select, MenuItem, FormLabel, CircularProgress
} from '@mui/material';
import { Formik, Form as FormikForm } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { TraderSchema } from '../schema';
import { buildQueryString } from '../utils';

const PageBox = styled('div')(({ theme }) => ({
padding: theme.spacing(1),
'& .MuiPaper-root': {
width: '70%',
alignItems: 'center',
margin: 'auto',
padding: theme.spacing(3),
'& .MuiFormControl-root': {
width: '100%',
padding: '5px',
margin: '1px'
},
'& .MuiButtonBase-root': {
marginLeft: theme.spacing(1),
}
}
}));

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

const updateTrader = (trader) => {

return new Promise((resolve, reject) => {
fetch('/updateTrader', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: trader
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const TraderProfilePage  = (props) => {

const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [loading, setLoading] = React.useState(true);

React.useEffect(() => {

getTrader().then(
(data) => {
props.dispatch({
type: 'GET_TRADER',
payload: data.data
});
setLoading(false);
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);

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

const onSuccess = (msg, values) => {

setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: msg });

props.dispatch({
type: 'UPDATE_TRADER',
payload: values
});

}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const isEdit = Boolean(Object.keys(props.trader.data).length);

const handleSubmit = (values, actions) => {

updateTrader(JSON.stringify(values)).then(
(data) => {
if(data.success) {
const message = isEdit ? 'Profile Updated' : 'Profile Created'
onSuccess(message, data.data);
}
else {
onError(data.error);
}
},
(err) => {
onError(err);
}
);
}

return (
<React.Fragment>

<AlertMessage
isOpen={openAlertBox}
onClose={() => setOpenAlertBox(false)}
alertProps={alertBoxProps}
/>

<PageBox>
<Paper>
<Typography variant='h4'>My Profile</Typography>
{
loading ? (
<CircularProgress />
) : (
<Formik
initialValues={{
code: props.trader.data.code || 1,
name: props.trader.data.name || '',
address: props.trader.data.address || '',
gst_num: props.trader.data.gst_num || '',
reg_title_1: props.trader.data.reg_title_1 || '',
reg_value_1: props.trader.data.reg_value_1 || '',
reg_title_2: props.trader.data.reg_title_2 || '',
reg_value_2: props.trader.data.reg_value_2 || '',
reg_title_3: props.trader.data.reg_title_3 || '',
reg_value_3: props.trader.data.reg_value_3 || '',
contact_1: props.trader.data.contact_1 || '',
contact_2: props.trader.data.contact_2 || '',
contact_3: props.trader.data.contact_3 || '',
state_code: props.trader.data.state_code || '',
bank_account_name: props.trader.data.bank_account_branch_name || '',
bank_account_num: props.trader.data.bank_account_num || '',
bank_account_ifsc: props.trader.data.bank_account_ifsc || '',
bank_account_branch_name: props.trader.data.bank_account_branch_name || '',
}}
onSubmit={handleSubmit}
validationSchema={TraderSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<Grid container>
{console.log(values)}
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
id="gst_num"
name="gst_num"
label="GST Number"
type="text"
value={values.gst_num}
onChange={handleChange}
variant="standard"
error={Boolean(touched.gst_num && errors.gst_num)}
helperText={touched.gst_num && errors.gst_num}
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

<Grid item xs={12}>
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
props.states?.data?.map((option, index) => (
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

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="bank_account_name"
name="bank_account_name"
label="Bank Account Name"
type="text"
value={values.bank_account_name}
onChange={handleChange}
variant="standard"
error={Boolean(touched.bank_account_name && errors.bank_account_name)}
helperText={touched.bank_account_name && errors.bank_account_name}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="bank_account_num"
name="bank_account_num"
label="Account Number"
type="text"
value={values.bank_account_num}
onChange={handleChange}
variant="standard"
error={Boolean(touched.bank_account_num && errors.bank_account_num)}
helperText={touched.bank_account_num && errors.bank_account_num}
/>
</FormControl>
</Grid>


<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="bank_account_ifsc"
name="bank_account_ifsc"
label="IFSC"
type="text"
value={values.bank_account_ifsc}
onChange={handleChange}
variant="standard"
error={Boolean(touched.bank_account_ifsc && errors.bank_account_ifsc)}
helperText={touched.bank_account_ifsc && errors.bank_account_ifsc}
/>
</FormControl>
</Grid>

<Grid item xs={12} md={6}>
<FormControl>
<TextField
id="bank_account_branch_name"
name="bank_account_branch_name"
label="Branch Name"
type="text"
value={values.bank_account_branch_name}
onChange={handleChange}
variant="standard"
error={Boolean(touched.bank_account_branch_name && errors.bank_account_branch_name)}
helperText={touched.bank_account_branch_name && errors.bank_account_branch_name}
/>
</FormControl>
</Grid>

</Grid>

<Button type='submit' autoFocus variant='contained'>
{ isEdit ? 'Update' : 'Add' }
</Button>

</FormikForm>

)}
</Formik>
)
}
</Paper>
</PageBox>
</React.Fragment>
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
trader: state.trader,
states: state.states
}
}

export default connect(mapStateToProps)(TraderProfilePage);