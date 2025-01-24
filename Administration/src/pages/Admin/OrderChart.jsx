import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function OrderChart({ product }) {
  const [totalOrder, setTotalOrder] = useState(Array(12).fill(0)); // Initialize the state for total orders

  useEffect(() => {
    const updatedOrderCounts = Array(12).fill(0); // Array for 12 months, initialized to 0

    product.forEach((orders) => {
      const month = new Date(orders.updatedAt).getMonth(); // Get month from order's updatedAt date
      orders.products.forEach((order) => {
        updatedOrderCounts[month] += order.quantity; // Add the product's quantity to the respective month
      });
    });

    setTotalOrder(updatedOrderCounts); // Update state with the calculated totals
  }, [product]);

  // Chart configuration
  const chartConfig = {
    type: "line",
    height: 260,
    series: [
      {
        name: "Orders",
        data: totalOrder,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#FFFFFF"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#FFFFFF",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <Card className="bg-blue-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-blue-400 p-5 text-white">
          <Square3Stack3DIcon className="h-6 w-6" />
        </div>
        <div>
          <Typography variant="h6" className="text-white">
            Product Order Chart
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="max-w-sm font-normal text-white"
          >
            I gather data from the Panshop, ensuring that the information is accurate and up-to-date for our records.
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
