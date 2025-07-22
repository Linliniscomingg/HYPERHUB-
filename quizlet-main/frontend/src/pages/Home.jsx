import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import TestCard from "../components/TestCard";

const Home = () => {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get("/exam/getall");
        console.log(response.data);
        const formattedData = response.data.map((test) => ({
          id: test.id,
          date: new Date(test.created_at).toLocaleDateString("vi-VN"),
          views: Math.floor(Math.random() * 10000),
          comments: Math.floor(Math.random() * 100),
          time: Math.floor(test.duration.split(":")[1]),
          responses: 1,
          topic: test.exam_display_name,
          score: test.pass_score,
          maxScore: test.max_score,
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
          <Col
            key={index}
            xs={24} // 1 column on extra-small screens (<576px)
            sm={12} // 2 columns on small screens (≥576px)
            md={8} // 3 columns on medium screens (≥768px)
            lg={6} // 4 columns on large screens (≥992px)
          >
            <TestCard {...data} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
