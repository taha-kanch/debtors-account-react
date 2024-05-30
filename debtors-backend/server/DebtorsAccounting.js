const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const managers = require('datalayer/managers');

app.use(express.static('public'));

const urlEncodedBodyParser = bodyParser.urlencoded({ extended: false });
app.use(urlEncodedBodyParser);
app.use(bodyParser.json());

app.get("/", function(request, response) {
response.redirect('/index.html');
});

app.get('/getItems', async (req, res) => {

const filters = req.query;

new managers
.ItemManager()
.getAll(filters)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getUnitOfMeasurements', async (req, res) => {

new managers
.UnitOfMeasurementManager()
.getAll()
.then(data => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getUnitOfMeasurementsByItemCode', async (req, res) => {

const itemCode = req.query.itemCode;
new managers
.UnitOfMeasurementManager()
.getByItemCode(itemCode)
.then(data => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getItemByCode', async (req, res) => {

const code = req.query.code;
new managers
.ItemManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addItem', async (req, res) => {

const item = req.body;
new managers
.ItemManager().
add(item)
.then(data  => {
res.send({ "success": true, "data": item });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/updateItem', async (req, res) => {

const item = req.body;
new managers
.ItemManager().
update(item)
.then(data  => {
res.send({ "success": true, "data": item });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addUnitOfMeasurement', async (req, res) => {

const uom = req.body;
new managers
.UnitOfMeasurementManager().
add(uom)
.then(data  => {
res.send({ "success": true, "data": uom });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/removeItem', async (req, res) => {

const code = req.query.code;

new managers
.ItemManager().
remove(code)
.then(data  => {
res.send({ "success": true});
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getStates', async (req, res) => {

new managers
.StateManager()
.getAll()
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getStateByCode', async (req, res) => {

const code = req.query.code;
new managers
.StateManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getStateByAlphaCode', async (req, res) => {

const alpha_code = req.query.alpha_code;
new managers
.StateManager()
.getByAlphaCode(alpha_code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getTrader', async (req, res) => {

new managers
.TraderManager()
.get()
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/updateTrader', async (req, res) => {

const trader = req.body;

new managers
.TraderManager()
.update(trader)
.then(data  => {
res.send({ success: true, "data": trader });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addCustomer', async (req, res) => {

const customer = req.body;
new managers
.CustomerManager()
.add(customer)
.then(data => {
res.send({ success: true,  data: customer });
})
.catch(err => {
res.send({ success: false, error: err });
});

});

app.post('/updateCustomer', async (req, res) => {

const customer = req.body;
new managers
.CustomerManager()
.update(customer)
.then(data => {
res.send({ success: true,  data: customer });
})
.catch(err => {
res.send({ success: false, error: err });
});

});

app.get('/getCustomers', async (req, res) => {

const filters = req.query;

new managers
.CustomerManager()
.getAll(filters)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getCustomerByCode', async (req, res) => {

const code = req.query.code;
new managers
.CustomerManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/removeCustomer', async (req, res) => {

const code = req.query.code;

new managers
.CustomerManager().
remove(code)
.then(data  => {
res.send({ "success": true});
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addInvoice', async (req, res) => {

const invoice = req.body;
new managers
.InvoiceManager().
add(invoice)
.then(data  => {
res.send({ "success": true, "data": invoice });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getInvoices', async (req, res) => {

const filters = req.query;

new managers
.InvoiceManager()
.getAll(filters)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getInvoiceByCode', async (req, res) => {

const code = req.query.code;
new managers
.InvoiceManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addReceipt', async (req, res) => {

const receipt = req.body;
new managers
.ReceiptManager()
.add(receipt)
.then(data => {
res.send({ success: true,  data: receipt });
})
.catch(err => {
res.send({ success: false, error: err });
});

});

app.get('/getReceipts', async (req, res) => {

const filters = req.query;

new managers
.ReceiptManager()
.getAll(filters)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getReceiptByCode', async (req, res) => {

const code = req.query.code;
new managers
.ReceiptManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getRemainingBalance', async (req, res) => {

const customer_code = req.query.customer_code;
new managers
.ReceiptManager()
.getRemainingBalance(customer_code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getOutstandingReport', async (req, res) => {

new managers
.CustomerTransactionManager()
.getAll()
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.listen(port, function(error) {
if(error) {
return console.log(`Some problem: ${error}`);
}
console.log(`Server is ready to accept request on port ${port}`);
});