import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import ItemPage from '../pages/ItemPage';
import CustomerPage from '../pages/CustomerPage';
import TraderProfilePage from '../pages/TraderProfilePage';
import CreateInvoicePage from '../pages/CreateInvoicePage';
import ReportPage from '../pages/ReportPage';
import ReceiptsPage from '../pages/ReceiptsPage';
import BalanceReportPage from '../pages/BalanceReportPage';
import InvoicePage from '../pages/InvoicePage';

let routes = [
{
path: '/',
element: <App/>,
children: [
{
path: '/',
element: <ItemPage/>
},
{
path: '/items',
element: <ItemPage/>
},
{
path: '/customers',
element: <CustomerPage/>
},
{
path: '/profile',
element: <TraderProfilePage/>
},
{
path: '/createInvoice',
element: <CreateInvoicePage/>
},
{
path: '/report',
element: <ReportPage/>
},
{
path: '/receipts',
element: <ReceiptsPage/>
},
{
path: '/balance-report',
element: <BalanceReportPage/>
},
{
path: '/invoice/:id',
element: <InvoicePage/>
}
]
}
];

const router = createBrowserRouter(routes);

export default router;