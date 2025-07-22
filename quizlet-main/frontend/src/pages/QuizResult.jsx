import React, { useState, useEffect } from "react";
import { Progress, Button, Row, Col, Card, Typography, Tag } from "antd";
import { useLocation } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const QuizResult = () => {
  const location = useLocation();
  const { lesson, answers, duration } = location.state || {};
  const [corectAnswer, setCorrectAnswer] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [percent, setPercent] = useState(0);
  const [quote, setQuote] = useState("");
  console.log(lesson, answers);

  const quotes = [
    { min: 0, max: 30, text: "Please try again!" },
    { min: 31, max: 50, text: "Not bad, but there's room for improvement." },
    { min: 51, max: 70, text: "Good job! Keep it up." },
    { min: 71, max: 90, text: "Great work! You're almost there." },
    { min: 91, max: 100, text: "Excellent! You're a star!" },
  ];

  const getQuote = (percent) => {
    const quote = quotes.find((q) => percent >= q.min && percent <= q.max);
    return quote ? quote.text : "Good effort!";
  };

  const handleCalculateScore = (lessonQuestions, userAnswers) => {
    try {
      let correctCount = 0;
      const totalQuestions = lessonQuestions.length;
      lessonQuestions.forEach((question) => {
        const userAnswer = userAnswers.find(
          (answer) => answer.id === question.id
        );
        let actualAnswer;
        let isCorrect = false;
        if (question.type === "text" || question.type === "multiple") {
          actualAnswer = userAnswer.choices;
        } else {
          actualAnswer = userAnswer.choices[0];
        }
        if (question.type === "text" || question.type === "single") {
          isCorrect = userAnswer && actualAnswer === question.answer;
        } else {
          isCorrect =
            userAnswer && hasCommonElements(actualAnswer, question.answer);
        }
        if (isCorrect) {
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

  const getColorForPercent = (percent) => {
    if (percent <= 30) {
      return "#ff4d4f"; // red
    } else if (percent <= 60) {
      return "#ffec3d"; // yellow
    } else if (percent <= 90) {
      return "#bae637"; // light green
    } else {
      return "#52c41a"; // green
    }
  };
  const convertToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const convertToHHMMSS = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const getRemainingTime = (start, end) => {
    const startSeconds = convertToSeconds(start);
    const endSeconds = convertToSeconds(end);
    const remainingSeconds = startSeconds - endSeconds;
    return convertToHHMMSS(remainingSeconds);
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const result = handleCalculateScore(lesson.questions, answers);
    setPercent(result.percent);
    setQuote(getQuote(result.percent));
    setCorrectAnswer(result.correctCount);
    setWrongAnswer(result.wrongCount);
  }, [answers, lesson]);

  return (
    <div className="py-16 px-4">
      <Card style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header Section */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Luyện thi công chức 2024</Title>
            <Text>Ngân hàng câu hỏi luyện thi công chức 2024</Text>
          </Col>
          <Col span={24}>
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{ fontSize: "14px", padding: "5px 10px" }}
            >
              Hoàn thành
            </Tag>
          </Col>
          <Col span={24}>
            <Text>
              <strong>Opened:</strong> Thursday, 18 November 2021, 12:00 PM
            </Text>
            <br />
            <Text>
              <strong>Closed:</strong> Sunday, 21 November 2021, 10:59 PM
            </Text>
          </Col>
        </Row>

        {/* Quiz Result Section */}
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Title level={4}>
              Thời gian hoàn thành: {getRemainingTime(lesson?.duration, duration)}
            </Title>
            <Progress
              type="circle"
              percent={percent}
              format={(percent) => `${percent}%`}
              size={80}
              strokeColor={getColorForPercent(percent)}
              trailColor={getColorForPercent(percent)}
            />
            <Title level={5}>{quote}</Title>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Text strong>Đúng</Text>
            <Title level={2} style={{ color: "green" }}>
              {corectAnswer}
            </Title>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Text strong>Sai</Text>
            <Title level={2} style={{ color: "red" }}>
              {wrongAnswer}
            </Title>
          </Col>
          <Col span={24}>
            <Button type="default" block onClick={handleBackClick}>
              Làm lại bài thi!
            </Button>
          </Col>
        </Row>

        {/* Questions Section */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          {lesson?.questions.map((question, questionIndex) => {
            const userAnswer = answers.find(
              (answer) => answer.id === question.id
            );
            let actualAnswer;
            let isCorrect = false;
            if (question.type === "text" || question.type === "multiple") {
              actualAnswer = userAnswer.choices;
            } else if (question.type === "single") {
              actualAnswer = userAnswer.choices[0];
            }
            if (question.type === "text" || question.type === "single") {
              isCorrect = userAnswer && actualAnswer === question.answer;
            } else {
              isCorrect =
                userAnswer &&
                hasCommonElements(actualAnswer, question.answer);
            }

            const isAnswered = !!userAnswer;
            return (
              <Card key={questionIndex} style={{ width: "100%" }}>
                <Title
                  level={5}
                  style={{
                    color: isAnswered
                      ? isCorrect
                        ? "green"
                        : "red"
                      : "red",
                  }}
                >
                  {question?.title}
                </Title>
                {question?.options.map((option, optionIndex) => {
                  const isUserChoice =
                    userAnswer && userAnswer.choices.includes(option.label);
                  const isCorrectAnswer = option.label === question.answer[0];

                  let color = "inherit";
                  if (isUserChoice) {
                    color = isCorrect ? "green" : "red";
                  } else if (isCorrectAnswer) {
                    color = "green";
                  }

                  return (
                    <Card.Grid
                      key={optionIndex}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px",
                      }}
                    >
                      <Text style={{ color: color }}>{option?.label}</Text>
                    </Card.Grid>
                  );
                })}
              </Card>
            );
          })}
        </Row>
      </Card>
    </div>
  );
};

function hasCommonElements(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return true;
    }
  }
  return false;
}

export default QuizResult;
