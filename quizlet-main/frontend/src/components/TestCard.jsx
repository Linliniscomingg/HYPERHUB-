import React from 'react';
import { Card, Row, Col, Tag, Button } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const TestCard = ({ id, date, views, comments, time, responses, topic, score, maxScore }) => (
  <Card style={{ width: 300, marginBottom: 20 }}>
    <Row justify="space-between">
      <Tag color="blue">{date}</Tag>
      <div>
        <span><ClockCircleOutlined /> {time} phút</span>
        <br />
        <span><EyeOutlined /> {views} lượt xem</span>
      </div>
    </Row>
    <div style={{ marginTop: 10 }}>
      <Row justify="space-between">
        <span>6 lần làm bài</span>
        <span><FileTextOutlined /> {comments} nhận xét</span>
      </Row>
      <Row justify="space-between" style={{ marginTop: 10 }}>
        <span>Điểm qua môn: {score}/{maxScore}</span>
        <span>Điểm cao nhất {maxScore}</span>
      </Row>
    </div>
    <Row style={{ marginTop: 10 }}>
      {/* {topics.map(topic => (
        <Tag color="blue" key={topic}>{topic}</Tag>
      ))} */}
      <Tag color="blue" key={topic}>{topic}</Tag>
    </Row>
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <Link to={`/home/quiz_detail/${id}`}>Chi tiết</Link>
    </div>
  </Card>
);

export default TestCard;
