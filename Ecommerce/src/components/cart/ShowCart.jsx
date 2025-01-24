import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { MdShoppingCart } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bagActions } from '../../store/bagSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ShowCart() {
  const [state, setState] = React.useState({ right: false });
  const [openDialog, setOpenDialog] = React.useState(false);
  const [itemToRemove, setItemToRemove] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const pashShopOwnerId = localStorage.getItem('id');
  const address = localStorage.getItem('address');
  const panShopOwner = localStorage.getItem('panShopOwner');
  const panShopOwnerState = localStorage.getItem('state');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bag = useSelector((store) => store.bag) || { totalQuantity: 0, data: [] };

  const toggleDrawer = (anchor, open) => (event) => {
    // Prevent closing the drawer when interacting with cart items
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleDelete = async () => {
    dispatch(bagActions.removeFromBag({ productId: itemToRemove._id }));
    setOpenDialog(false);
  };

  const handleIncrease = (item) => {
    dispatch(bagActions.increaseQuantity({ _id: item._id }));
  };

  const handleDecrease = (item) => {
    dispatch(bagActions.decreaseQuantity({ _id: item._id }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (bag.data.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Your cart is empty. Please add items before proceeding.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const postData = {
      products: bag.data.map(({ title, image, _id, quantity, price, description }) => ({
        productName: title,
        image,
        productId: _id,
        quantity,
        price: price,
      })),
      otp: orderNumber,
      panShopOwnerName: panShopOwner,
      panShopOwneraddress: address,
      panShopOwner_id: pashShopOwnerId,
      panShopOwnerstate: panShopOwnerState,
      orderNumber,
    };

    setIsLoading(true);
    try {
        
      await axios.post(`${BASE_URL}/api/panshop/order`, postData);

      setState({ right: false });
      Swal.fire({
        title: `Your Order OTP ${orderNumber}`,
        text: `Order placed successfully! `,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      dispatch(bagActions.clearBag());
     
    } catch (error) {
      console.error('Error placing order:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to place order. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const confirmDelete = (item) => {
    setItemToRemove(item);
    setOpenDialog(true);
  };

  const totalPrice = bag.data.reduce((total, item) => total + item.quantity * item.price, 0);

  const list = (anchor) => (
    <>
      <Box sx={{ width: 400 }} role="presentation" onKeyDown={toggleDrawer(anchor, false)}>
        <Typography variant="h4" gutterBottom className="px-5 text-center bg-[#010317] text-white p-4">
          My Cart
        </Typography>
        {bag.data.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {bag.data.map((item, index) => (
                <ListItem key={index} disablePadding className="px-5 my-4">
                  <Avatar alt={item.name} src={`${BASE_URL}/uploads/${item.image}`} sx={{ width: 56, height: 56, marginRight: 2 }} />
                  <ListItemText primary={item.name} secondary={`Price: ₹${item.price}`} />
                  <div className="flex items-center gap-2">
                    <IconButton onClick={() => handleDecrease(item)} color="primary">
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton onClick={() => handleIncrease(item)} color="primary">
                      <AddIcon />
                    </IconButton>
                  </div>
                  <IconButton aria-label="delete" onClick={() => confirmDelete(item)} sx={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ textAlign: 'right', padding: '10px' }}>
              Total: ₹{totalPrice.toFixed(2)}
            </Typography>
          </>
        )}
      </Box>
      <div className="flex justify-center fixed bottom-0 w-[400px]">
        <Button
          variant="contained"
          onClick={handleCheckout}
          disabled={bag.data.length === 0 || isLoading}
          sx={{
            borderRadius: 0,
            backgroundColor: 'error.main',
            color: 'white',
            width: '40%',
            height: '50px',
            '&:hover': { backgroundColor: 'error.dark' },
          }}
        >
          {isLoading ? 'Processing...' : 'Order Now'}
        </Button>
      </div>
    </>
  );

  return (
    <div>
      <Button onClick={toggleDrawer('right', true)}>
        <MdShoppingCart className="text-white text-2xl" />
        {bag.totalQuantity > 0 && (
          <span className="absolute h-7 w-7 -right-0 -top-5 bg-red-600 rounded-full text-white flex items-center justify-center">
            {bag.totalQuantity}
          </span>
        )}
      </Button>

      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer('right', false)}
        onOpen={toggleDrawer('right', true)}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
      >
        {list('right')}
      </SwipeableDrawer>

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
        <DialogTitle id="confirm-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to remove {itemToRemove?.name} from the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
