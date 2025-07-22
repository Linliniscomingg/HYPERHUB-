import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Progress,
  Row,
  Typography,
  Popconfirm,
} from "antd";
import React, { useEffect, useState, useContext } from "react";
import Question from "./Question";
import { ViewContext } from "../context/View";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Questions = ({ lesson, quizId }) => {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [duration, setDuration] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const viewContext = useContext(ViewContext);
  const navigate = useNavigate();

  useEffect(() => {
    let newListAnswers = lesson?.questions.map((question) => ({
      id: question.id,
      choices: [],
    }));
    setAnswers(newListAnswers);
    setQuiz(lesson);
  }, [lesson]);

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz?.questions?.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleCalculateScore = (lessonQuestions, userAnswers) => {
    try {
      let correctCount = 0;
      const totalQuestions = lessonQuestions.length;

      lessonQuestions.forEach((question) => {
        const userAnswer = userAnswers.find(
          (answer) => answer.id === question.id
        );
        if (
          userAnswer &&
          (userAnswer.choices[0] === question.answer[0] ||
            userAnswer.choices[0] === question.answer)
        ) {
          correctCount++;
        }
      });

      return {
        correctCount: correctCount,
        wrongCount: totalQuestions - correctCount,
        percent: Math.round((correctCount / totalQuestions) * 100),
      };
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const result = handleCalculateScore(lesson.questions, answers);
      const correctCount = result.correctCount;

      let endTime = localStorage.getItem(`${userId}_${quizId}_time`);
      if (endTime) {
        localStorage.removeItem(`${userId}_${quizId}_time`);
      }

      navigate(`/home/quiz_result`, { state: { lesson, answers, duration } });
      setOpen(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log(error);
      viewContext.handleError(error.toString());
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleGetTime = () => {
    let endTime = localStorage.getItem(`${userId}_${quizId}_time`);
    let now = new Date().getTime();
    let time = endTime - now;
    if (time <= 0) {
      localStorage.removeItem(`${userId}_${quizId}_time`);
      return;
    }

    let hours = Math.floor(time / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    setDuration(formattedTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 shadow-lg text-base">
      <Row gutter={[12, 12]}>
        <Col xs={24} md={16}>
          <div className="flex justify-between items-center">
            <Typography.Title level={3}>{quiz?.title}</Typography.Title>
          </div>
          <Divider />
          <div className="flex justify-between items-center mb-2">
            <p>Exam process: </p>
            <p>
              Question {currentQuestion} out of {quiz?.questions?.length}{" "}
            </p>
          </div>
          <Progress
            percent={(currentQuestion / quiz?.questions.length) * 100}
          />
          {quiz && (
            <Question
              question={quiz?.questions[currentQuestion - 1]}
              answers={answers}
              current={currentQuestion}
              setAnswers={setAnswers}
            />
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={handlePrev}
              className="bg-[#754FFE] text-white px-8"
              size="large"
            >
              Prev
            </Button>

            {currentQuestion < quiz?.questions?.length && (
              <Button
                onClick={handleNext}
                className="bg-[#754FFE] text-white px-8"
                size="large"
              >
                Next
              </Button>
            )}

            {currentQuestion === quiz?.questions?.length && (
              <Popconfirm
                title="Bạn có chắc chắn nộp bài không?"
                description=""
                open={open}
                onConfirm={handleOk}
                okButtonProps={{
                  loading: confirmLoading,
                  className: 'bg-blue-500'
                }}
                onCancel={handleCancel}
              >
                <Button
                  onClick={showPopconfirm}
                  className="bg-[#754FFE] text-white px-8"
                  size="large"
                >
                  Submit
                </Button>
              </Popconfirm>
            )}
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="border p-4">
            <div className="flex justify-between items-center mb-4">
              <Typography.Title level={5}>Thời gian làm bài: </Typography.Title>
              <div className="flex justify-center items-center gap-6 text-red-500">
                <ClockCircleOutlined />
                <p>{duration}</p>
              </div>
            </div>
            <div className="flex flex-wrap">
              <ul className="flex flex-wrap gap-2">
                {quiz?.questions?.map((q, index) => {
                  return (
                    <li
                      key={index}
                      className={`inline-block min-w-[32px] h-[32px] leading-[30px] text-center bg-transparent border rounded-md cursor-pointer ${
                        currentQuestion === index + 1
                          ? "bg-[#1677ff] text-white"
                          : ""
                      }`}
                      onClick={() => setCurrentQuestion(index + 1)}
                    >
                      {index + 1}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Questions;
