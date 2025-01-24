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
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "10px",
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

const formatPrice = (amount) => {
  if (amount < 1000) return `₹${amount}`;
  if (amount < 100000) return `₹${(amount / 1000).toFixed(2)}K`;
  if (amount < 10000000) return `₹${(amount / 100000).toFixed(2)}L`;
  return `₹${(amount / 10000000).toFixed(2)}Cr`;
};

export default function OrderDetailsCityTaluka() {
  const [panshopOrder, setPanshopOrder] = React.useState([]);
  const [subDivisionData, setSubDivisionData] = React.useState({
    counts: {},
    spending: {},
    minPrices: {},
    maxPrices: {},
  });

  const URI = import.meta.env.VITE_API_URL;

  React.useEffect(() => {
    const fetchPanShopData = async () => {
      try {
        const res = await axios.get(`${URI}/api/panshop/order`);
        console.log("panShop order details", res);

        const sortedData = res.data.sort((a, b) => b.totalPrice - a.totalPrice);
        const top5Data = sortedData.slice(0, 100); // Adjust number of rows displayed
        setPanshopOrder(top5Data);

        // Calculate data for each subDivision
        const subDivisionCounts = {};
        const spendingTotals = {};
        const minPrices = {};
        const maxPrices = {};

        top5Data.forEach((data) => {
          const subDivision = data.panShopOwner_id?.subDivision;
          const totalPrice = data.totalPrice || 0;

          if (subDivision) {
            // Count the number of orders for each subdivision
            subDivisionCounts[subDivision] =
              (subDivisionCounts[subDivision] || 0) + 1;

            // Calculate total spending
            spendingTotals[subDivision] =
              (spendingTotals[subDivision] || 0) + totalPrice;

            // Calculate min and max prices
            minPrices[subDivision] =
              minPrices[subDivision] === undefined
                ? totalPrice
                : Math.min(minPrices[subDivision], totalPrice);

            maxPrices[subDivision] =
              maxPrices[subDivision] === undefined
                ? totalPrice
                : Math.max(maxPrices[subDivision], totalPrice);
          }
        });

        setSubDivisionData({
          counts: subDivisionCounts,
          spending: spendingTotals,
          minPrices,
          maxPrices,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchPanShopData();
  }, []);

  // Get unique subDivisions
  const uniqueSubDivisions = Object.keys(subDivisionData.counts || {});

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>(State)</StyledTableCell>
            <StyledTableCell align="left"> City(District)</StyledTableCell>
            <StyledTableCell align="left">
              {" "}
              Sub Division (Taluk)
            </StyledTableCell>
            <StyledTableCell align="left"> Order</StyledTableCell>
            <StyledTableCell align="left"> Total Spending</StyledTableCell>

            <StyledTableCell align="left"> Spending Range</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {uniqueSubDivisions.map((subDivision) => {
            const relevantData = panshopOrder.find(
              (data) => data.panShopOwner_id?.subDivision === subDivision
            );

            const totalSpending = subDivisionData.spending[subDivision] || 0;
            const minPrice = subDivisionData.minPrices[subDivision] || 0;
            const maxPrice = subDivisionData.maxPrices[subDivision] || 0;

            return (
              <StyledTableRow key={subDivision}>
                <StyledTableCell component="th" scope="row">
                  {relevantData?.panShopOwner_id?.state}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {relevantData?.panShopOwner_id?.district}
                </StyledTableCell>
                <StyledTableCell align="left">{subDivision}</StyledTableCell>
                <StyledTableCell align="left">
                  {subDivisionData.counts[subDivision] || 0}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {formatPrice(totalSpending)} {/* Use formatting function */}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {formatPrice(minPrice)} - {formatPrice(maxPrice)}{" "}
                  {/* Use formatting function */}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
