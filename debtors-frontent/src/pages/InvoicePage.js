import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { buildQueryString, formatDate } from '../utils';
import { CircularProgress } from '@mui/material';
import '../css/vendors/bootstrap/dist/css/bootstrap.min.css';
import '../css/vendors/font-awesome/css/font-awesome.min.css';
import '../css/build/css/custom.min.css';

const getInvoiceByCode = (code) => {

let dataToSend = {
code: code
}
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/getInvoiceByCode${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`)
.then((res) => {
if(!res.ok) {
throw Error('Unable to fetch invoice detail, please try after some time');
}
return res.json();
})
.then(invoice => resolve(invoice))
.catch(err => reject(err.message))
});

}

const InvoicePage  = (props) => {

const { id } = useParams()
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });

React.useEffect(() => {

if(id) {
getInvoiceByCode(id).then(
(data) => {
props.dispatch({
type: 'GET_INVOICE_DETAIL',
payload: data.data
});

}, 
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);
}

},[id]);

return (
<React.Fragment>
{
Object.keys(props.invoiceDetail.data).length > 0 ? ( 
<div class="x_panel">
<div class="x_content">

<section class="content invoice">
<div class="row">
<div class="  invoice-header">
<h1>
<i class="fa fa-globe"></i> Invoice.
<small class="pull-right">Date: {formatDate(props.invoiceDetail.data.invoiceDate)}</small>
</h1>
</div>
</div>
<div class="row invoice-info">
<div class="col-sm-4 invoice-col">
<b>Invoice #{props.invoiceDetail.data.code}</b>
</div>
</div>

<div class="row">
<div class="  table">
<table class="table table-striped">
<thead>
<tr>
<th>Item</th>
<th>Price</th>
<th>Qty</th>
<th>Unit</th>
<th>Taxable</th>
<th>IGST</th>
<th>SGST</th>
<th>CGST</th>
<th>SubTotal</th>
</tr>
</thead>
<tbody>
{
props.invoiceDetail.data.items.map((item, idx) => (
<tr key={idx}>
<td>{item.item_name}</td>
<td>&#8377;{Number(item.price).toFixed(2)}</td>
<td>{item.qty}</td>
<td>{item.uom_name}</td>
<td>&#8377;{item.taxable_amt.toFixed(2)}</td>
<td>&#8377;{item.igst_amt.toFixed(2)}</td>
<td>&#8377;{item.sgst_amt.toFixed(2)}</td>
<td>&#8377;{item.cgst_amt.toFixed(2)}</td>
<td>&#8377;{item.total_amt.toFixed(2)}</td>
</tr>
))
}
</tbody>
<thead>
<tr>
<th colSpan="8" align="center" >Additional Charges</th>
</tr>
<tr>
<th>Description</th>
<th>Amount</th>
<th>IGST</th>
<th>SGST</th>
<th>CGST</th>
<th>SubTotal</th>
</tr>
</thead>
<tbody>
{
props.invoiceDetail.data.additional_charges.map((charge, idx) => (
<tr key={idx}>
<td>{charge.description}</td>
<td>&#8377;{charge.taxable_amt.toFixed(2)}</td>
<td>&#8377;{charge.igst_amt.toFixed(2)}</td>
<td>&#8377;{charge.sgst_amt.toFixed(2)}</td>
<td>&#8377;{charge.cgst_amt.toFixed(2)}</td>
<td>&#8377;{charge.total_amt.toFixed(2)}</td>
</tr>
))
}
</tbody>
</table>
</div>
</div>

<div class="row">
<div class="col-md-6">
<div class="table-responsive">
<table class="table">
<tbody>
<tr>
<th>SubTotal</th>
<td>&#8377;{props.invoiceDetail.data.taxable_amt.toFixed(2)}</td>
</tr>
<tr>
<th>IGST</th>
<td>&#8377;{props.invoiceDetail.data.igst_amt.toFixed(2)}</td>
</tr>
<tr>
<th>CGST</th>
<td>&#8377;{props.invoiceDetail.data.cgst_amt.toFixed(2)}</td>
</tr>
<tr>
<th>SGST</th>
<td>&#8377;{props.invoiceDetail.data.sgst_amt.toFixed(2)}</td>
</tr>
<tr>
<th>Net Total</th>
<td>&#8377;{props.invoiceDetail.data.total_amt.toFixed(2)}</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div class="row no-print">
<div class="">
<button class="btn btn-success" onClick={() => window.print()}><i class="fa fa-print"></i> Print</button>
</div>
</div>
</section>
</div>
</div>
) : (
<CircularProgress />
)
}
</React.Fragment>
);

}

const mapStateToProps = (state) => {
return {
invoiceDetail: state.invoiceDetail
}
}

export default connect(mapStateToProps)(InvoicePage);