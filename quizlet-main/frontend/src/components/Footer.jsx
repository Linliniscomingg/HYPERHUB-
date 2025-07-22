import React, { useState, useEffect } from "react";
import logo from "../assets/logo-white.png";
import { Col, Flex, Input, List, Row, Typography, Form } from "antd";
import { useAPI } from "../hooks/api";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <footer className="bg-black">
      <div className="container max-w-screen-xl w-full mx-auto py-12 text-[#ffffffa4]">
        <Row>
          <Col span={10}>
            <div className="logo w-[177px] h-[44px] mb-24">
              <img src={logo} alt="logo" className="w-full h-full" />
            </div>
            <p>
              Study any topic, anytime. explore thousands of <br /> courses for
              the lowest price ever!
            </p>
          </Col>

          <Col span={6}></Col>
          <Col span={4}></Col>
        </Row>
        <Row>
          <Flex vertical gap={12}>
            <Typography.Text className="font-semibold text-2xl text-white">
              Subscribe to our newsletter
            </Typography.Text>
          </Flex>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
