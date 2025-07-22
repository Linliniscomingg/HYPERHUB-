import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Table, Tag, Button } from 'antd';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For navigation
  const [quizDetail, setQuizDetail] = useState(null);

  // Fake data for history attempts
  const historyData = [
    {
      key: '1',
      attemptNumber: 1,
      status: 'Đã xong',
      score: '90,00',
      submittedAt: 'Sunday, 31 October 2021, 1:36 PM',
    },
    {
      key: '2',
      attemptNumber: 2,
      status: 'Đã xong',
      score: '85,00',
      submittedAt: 'Monday, 01 November 2021, 2:00 PM',
    },
    {
      key: '3',
      attemptNumber: 3,
      status: 'Đã xong',
      score: '88,00',
      submittedAt: 'Tuesday, 02 November 2021, 11:15 AM',
    },
    // Add more attempts as needed
  ];

  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        const response = await axios.get(`/api/quiz/${id}`);
        setQuizDetail(response.data.data);
      } catch (error) {
        console.error('Error fetching quiz detail:', error);
      }
    };

    fetchQuizDetail();
  }, [id]);

  if (!quizDetail) return <div>Loading...</div>;

  const columns = [
    {
      title: 'Lần làm lại',
      dataIndex: 'attemptNumber',
      key: 'attemptNumber',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => <Tag color={status === 'Đã xong' ? 'green' : 'red'}>{status}</Tag>,
    },
    {
      title: 'Điểm / 90,00',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Đã nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
    },
    {
      title: 'Xem lại',
      key: 'action',
      render: () => <Button type="link">Xem lại</Button>,
    },
  ];

  // Navigate to the quiz attempt page
  const handleStartQuiz = () => {
    navigate(`/home/quiz/${id}`);
  };

  return (
    <div style={{ marginTop: 30, padding: 20 }}>
      <Card title={`Bài thu hoạch ${quizDetail.title}`}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p>Opened: {new Date(quizDetail.openedTime).toLocaleString('vi-VN')}</p>
            <p>Closed: {new Date(quizDetail.closedTime).toLocaleString('vi-VN')}</p>
            <p>Số lần làm bài: 3</p>
          </Col>
          <Col span={12}>
            <p>Thời gian làm bài: {quizDetail.duration} phút</p>
            <p>Điểm qua môn: {quizDetail.passMark} trên tổng số {quizDetail.maxMark}</p>
            <Button type="primary" onClick={handleStartQuiz} style={{ marginTop: 10 }}>
              Làm bài
            </Button>
          </Col>
        </Row>
      </Card>

      <Card title="Tổng quan các lần làm bài trước của bạn" style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={historyData}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default QuizDetail;
