import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import TestCard from "../components/TestCard";

const Home = () => {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get("/api/quiz/home/getAll");
        console.log(response.data.data)
        const formattedData = response.data.data.map((test) => ({
          id: test._id,
          date: new Date(test.startTime).toLocaleDateString("vi-VN"),
          views: Math.floor(Math.random() * 10000),
          comments: Math.floor(Math.random() * 100),
          time: Math.floor(test.duration.split(":")[1]),
          responses: test.ques.length,
          topics: ["#Exam Topic"],
          score: 60, // Assuming 60 for now, replace with real data
          maxScore: 90, // Assuming 90 for now, replace with real data
        }));
        setTestData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTestData();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <Row gutter={[16, 16]}>
        {testData.map((data, index) => (
          <Col key={index} span={6}>
            <TestCard {...data} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
