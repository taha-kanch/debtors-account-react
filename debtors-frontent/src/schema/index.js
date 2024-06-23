import * as yup from 'yup';

export const ItemSchema = yup.object().shape({

name: yup.string().required('Name is required'),
hsn_code: yup.number().required('HSN Code is required'),
igst: yup.number().required('IGST is required'),
sgst: yup.number().required('SGST is required'),
cgst: yup.number().required('CGST is required'),
unitOfMeasurements: yup.array().min(1, 'Should contain atleast one unit of measurement').required('Unit Of Measurements is required')

});

export const CustomerSchema = yup.object().shape({

name: yup.string().required('Name is required'),
address: yup.string().required('Address is required'),
reg_title_1: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type name. Use only letters and numbers."),
reg_value_1: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type value. Use only letters and numbers."),
reg_title_2: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type name. Use only letters and numbers."),
reg_value_2: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type value. Use only letters and numbers."),
reg_title_3: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type name. Use only letters and numbers."),
reg_value_3: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type value. Use only letters and numbers."),
contact_1: yup.string().matches(/^(?:\+\d{1,3}\s*)?\d{10}$/, "Please enter a valid phone number. It should consist of 10 digits, optionally preceded by a country code"),
contact_2: yup.string().matches(/^(?:\+\d{1,3}\s*)?\d{10}$/, "Please enter a valid phone number. It should consist of 10 digits, optionally preceded by a country code"),
contact_3: yup.string().matches(/^(?:\+\d{1,3}\s*)?\d{10}$/, "Please enter a valid phone number. It should consist of 10 digits, optionally preceded by a country code"),
state_code: yup.number().required('State is required'),
opening_balance: yup.number().test('Is positive?', 'The number must be greater than 0', (value) => value >= 0),
opening_balance_type: yup.string(),
});

export const TraderSchema = yup.object().shape({
name: yup.string().required('Name is required'),
address: yup.string().required('Address is required'),
gst_num: yup.string().required('GST Number is required').matches(/^[a-zA-Z0-9\s]+$/, "Invalid GST number."),
reg_title_1: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type name. Use only letters and numbers."),
reg_value_1: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type value. Use only letters and numbers."),
reg_title_2: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type name. Use only letters and numbers."),
reg_value_2: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type value. Use only letters and numbers."),
reg_title_3: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type name. Use only letters and numbers."),
reg_value_3: yup.string().matches(/^[a-zA-Z0-9\s]+$/, "Invalid document type value. Use only letters and numbers."),
contact_1: yup.string().matches(/^(?:\+\d{1,3}\s*)?\d{10}$/, "Please enter a valid phone number. It should consist of 10 digits, optionally preceded by a country code"),
contact_2: yup.string().matches(/^(?:\+\d{1,3}\s*)?\d{10}$/, "Please enter a valid phone number. It should consist of 10 digits, optionally preceded by a country code"),
contact_3: yup.string().matches(/^(?:\+\d{1,3}\s*)?\d{10}$/, "Please enter a valid phone number. It should consist of 10 digits, optionally preceded by a country code"),
state_code: yup.number().required('State is required'),
bank_account_name: yup.string().required('Account name is required'),
bank_account_num: yup.string().required('Account number is required'),
bank_account_ifsc: yup.string().required('IFSC is required'),
bank_account_branch_name: yup.string().required('Branch name is required'),
});

export const InvoiceItemSchema = yup.object().shape({
item_code: yup.string().required('Item is required'),
uom_code: yup.string().required('Unit Of Measurement is required'),
price: yup.number('Should be numeric value').required('Price is required'),
qty: yup.number('Should be numeric value').required('Quantity is required')
});

export const ReceiptSchema = yup.object().shape({
customer_code: yup.string().required('Customer is required'),
amount: yup.number('Should be numeric value').required('Amount is required'),
narration: yup.string().max(100, 'Cannot Exceed 100 characters')
});