import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1E40AF",
    color: theme.palette.text.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function OrderStateWise() {
  const [panshopOrder, setPanshopOrder] = React.useState([]);
  const URI = import.meta.env.VITE_API_URL;

  React.useEffect(() => {
    const fetchPanShopData = async () => {
      try {
        const res = await axios.get(`${URI}/api/panshop/order`);
        console.log(res.data);
        const sortedData = res.data.sort((a, b) => b.totalPrice - a.totalPrice);
        const top5Data = sortedData.slice(0, 5);
        setPanshopOrder(top5Data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPanShopData();
  }, []);

  const getTotalQuantity = (products) => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  const getStatusCount = (products, status) => {
    return products.filter((product) => product.status === status).length;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell
              sx={{ backgroundColor: "#1E40AF", color: "white" }}
            >
              State
            </StyledTableCell>
            <StyledTableCell
              align="right"
              sx={{ backgroundColor: "#1E40AF", color: "white" }}
            >
              Product sell
            </StyledTableCell>
            <StyledTableCell
              align="right"
              sx={{ backgroundColor: "#1E40AF", color: "white" }}
            >
              Order
            </StyledTableCell>
            <StyledTableCell
              align="right"
              sx={{ backgroundColor: "#1E40AF", color: "white" }}
            >
              On going Order
            </StyledTableCell>
            <StyledTableCell
              align="right"
              sx={{ backgroundColor: "#1E40AF", color: "white" }}
            >
              Completed Order
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {panshopOrder?.map((data) => (
            <StyledTableRow key={data._id}>
              <StyledTableCell component="th" scope="row">
                {data.panShopOwnerstate}
              </StyledTableCell>
              <StyledTableCell align="right">
              ₹ {data.totalPrice}
              </StyledTableCell>
              <StyledTableCell align="right">
                {getTotalQuantity(data.products)}
              </StyledTableCell>
              <StyledTableCell align="right">
                {getStatusCount(data.products, "pending")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {getStatusCount(data.products, "confirmed") +
                  getStatusCount(data.products, "delivered")}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
