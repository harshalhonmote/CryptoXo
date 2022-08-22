import millify from "millify";
import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Col, Row, Select, Typography } from "antd";
import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery
} from "../services/cryptoApi";

import {
  CategoryScale, Chart as ChartJS, Filler,
  Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";
import Loader from "./Loader";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
  Filler,
);

// const { Title } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  //console.log(coinId);
  const [timePeriod, setTimeperiod] = useState("7d");
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({
    coinId,
    timePeriod,
  });
  const cryptoDetails = data?.data?.coin;

  const time = ["3h", "24h", "7d", "30d", "1y", "3m", "3y", "5y"];

  if (isFetching) return <Loader/>;

  const coinPrice = [];
  const coinTimestamp = [];
  //console.log(coinHistory);

  for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
    coinPrice.push(coinHistory?.data?.history[i].price);
  }
  // console.log(coinPrice);
  for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
    coinTimestamp.push(
      moment.unix(coinHistory?.data?.history[i].timestamp).format("YYYY-MM-DD")
    );
  }
  // var ctx = document.getElementById('chart').getContext('2d');
  // const gradient = ctx.createLinearGradient(0,0,0,400);
  // gradient.addColorStop(0, "rgba(58,123,213,1)");
  // gradient.addColorStop(1, "rgba(0,210,255,0.3)");
  
  const datal = {
    labels: coinTimestamp.reverse(),
    datasets: [
      {
        label: "Price In USD",
        data: coinPrice,
        fill: true,
        backgroundColor: "#e0ffff",
        borderColor: "#0071bd",
      },
    ],
  };
  const options = {
    scales: {
      y: [{
        display: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    },
  };

  return (
    <>
      <Select
        defaultValue="7d"
        className="select-timeperiod"
        placeholder="Select Timeperiod"
        onChange={(value) => setTimeperiod(value)}
      >
        {time.map((date) => (
          <Option key={date}>{date}</Option>
        ))}
      </Select>
      <Row className="chart-header">
        <Typography.Title level={2} className="chart-title">
          {cryptoDetails?.name} Price Chart{" "}
        </Typography.Title>
        <Col className="price-container">
          <Typography.Title level={5} className="price-change">
            Change: {coinHistory?.data?.change}%
          </Typography.Title>
          <Typography.Title level={5} className="current-price">
            Current {cryptoDetails?.name} Price: ${" "}
            {millify(cryptoDetails?.price)}
          </Typography.Title>
        </Col>
      </Row>
      <Line data={datal} options={options} />
    </>
  );
};

export default CryptoDetails;
