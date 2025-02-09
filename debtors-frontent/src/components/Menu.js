import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CategoryIcon from '@mui/icons-material/Category';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AccountBalanceWallet as AccountBalanceWalletIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
width: drawerWidth,
transition: theme.transitions.create('width', {
easing: theme.transitions.easing.sharp,
duration: theme.transitions.duration.enteringScreen,
}),
overflowX: 'hidden',
});

const closedMixin = (theme) => ({
transition: theme.transitions.create('width', {
easing: theme.transitions.easing.sharp,
duration: theme.transitions.duration.leavingScreen,
}),
overflowX: 'hidden',
width: `calc(${theme.spacing(7)} + 1px)`,
[theme.breakpoints.up('sm')]: {
width: `calc(${theme.spacing(8)} + 1px)`,
},
});

const DrawerHeader = styled('div')(({ theme }) => ({
display: 'flex',
alignItems: 'center',
justifyContent: 'flex-end',
padding: theme.spacing(0, 1),
// necessary for content to be below app bar
...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
zIndex: theme.zIndex.drawer + 1,
transition: theme.transitions.create(['width', 'margin'], {
easing: theme.transitions.easing.sharp,
duration: theme.transitions.duration.leavingScreen,
}),
...(open && {
marginLeft: drawerWidth,
width: `calc(100% - ${drawerWidth}px)`,
transition: theme.transitions.create(['width', 'margin'], {
easing: theme.transitions.easing.sharp,
duration: theme.transitions.duration.enteringScreen,
}),
}),
}));

const menuOption = [
{
label: 'Items',
path: '/items',
getIcons: () => <CategoryIcon />
},
{
label: 'Customers',
path: '/customers',
getIcons: () => <PersonSearchIcon />
},
{
label: 'Report',
path: '/report',
getIcons: () => <SummarizeIcon />
},
{
label: 'Receipts',
path: '/receipts',
getIcons: () => <ReceiptIcon />
},
{
label: 'Balance Report',
path: '/balance-report',
getIcons: () => <AccountBalanceWalletIcon />
}
]

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
({ theme, open }) => ({
width: drawerWidth,
flexShrink: 0,
whiteSpace: 'nowrap',
boxSizing: 'border-box',
...(open && {
...openedMixin(theme),
'& .MuiDrawer-paper': openedMixin(theme),
}),
...(!open && {
...closedMixin(theme),
'& .MuiDrawer-paper': closedMixin(theme),
}),
}),
);

function Menu() {
const theme = useTheme();
const [open, setOpen] = React.useState(false);
const navigate = useNavigate();

const handleDrawerOpen = () => {
setOpen(true);
};

const handleDrawerClose = () => {
setOpen(false);
};

return (
<React.Fragment>
<Box sx={{ display: 'flex' }}>
<CssBaseline />
<AppBar position="fixed" open={open}>
<Toolbar>
<IconButton
color="inherit"
aria-label="open drawer"
onClick={handleDrawerOpen}
edge="start"
sx={{
marginRight: 5,
...(open && { display: 'none' }),
}}
>
<MenuIcon />
</IconButton>
<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
Debtors Account
</Typography>

<Button variant='contained' color='primary' onClick={() => navigate('/createInvoice')}>Create Invoice</Button>

<IconButton
size="large"
aria-haspopup="true"
color="inherit"
onClick={() => navigate('/profile')}
>
<AccountCircleIcon />
</IconButton>

</Toolbar>
</AppBar>
<Drawer variant="permanent" open={open} className='appbar-spacer'>
<DrawerHeader>
<IconButton onClick={handleDrawerClose}>
{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
</IconButton>
</DrawerHeader>
<Divider />

<List>
{
menuOption.map((menu,idx) => (
<>
<ListItem disablePadding sx={{ display: 'block' }} component={Link} to={menu.path} sx={{color: "#000"}}>
<ListItemButton
sx={{
minHeight: 48,
justifyContent: open ? 'initial' : 'center',
px: 2.5,
}}
>
<ListItemIcon
sx={{
minWidth: 0,
mr: open ? 3 : 'auto',
justifyContent: 'center',
}}
>
{menu.getIcons()}
</ListItemIcon>
<ListItemText primary={menu.label} sx={{ opacity: open ? 1 : 0 }} />
</ListItemButton>
</ListItem>
{idx == 1 && <Divider />}
</>
))
}
</List>

</Drawer>

<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
<DrawerHeader />
<Outlet/>        
</Box>
</Box>
</React.Fragment>
);
}

export default Menu;
