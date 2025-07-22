import { Button, Flex, Image, Space, Typography, message } from "antd";
import React from "react";
import svgquiz from "../assets/quiz.svg";
import { useParams, useNavigate } from "react-router-dom";
import { useAPI } from "../hooks/api";

const Quiz = ({ handleStartQuiz }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")).account._id;

  return (
    <Flex
      vertical
      className="py-12 px-4 shadow-lg"
      align="center"
      justify="center"
      gap={12}
    >
      <Image src={svgquiz} preview={false} width={400} height={400} />
      <Typography.Title level={1}>Welcome to Quiz</Typography.Title>
      <Typography.Text
        className="text-lg w-2/4 text-center"
        style={{ color: "#64748b" }}
      >
        Engage live or asynchronously with quiz and poll questions that
        participants complete at their own pace.
      </Typography.Text>
      <Button
        onClick={() => handleStartQuiz()}
        className="bg-[#754FFE] font-semibold text-white"
        size="large"
      >
        Start your quiz
      </Button>
    </Flex>
  );
};

export default Quiz;
