import React, { useState } from 'react';
import { List, Card, Checkbox, Button, Typography, message } from 'antd';

const { Title } = Typography;

// Mockup data
const mockStudents = [
  { id: 1, name: 'Student A' },
  { id: 2, name: 'Student B' },
  { id: 3, name: 'Student C' },
];

const mockQuizzes = [
  { id: 1, title: 'Quiz 1' },
  { id: 2, title: 'Quiz 2' },
  { id: 3, title: 'Quiz 3' },
];

const mockAssignments = {
  1: [1, 3], // Student A has been assigned Quiz 1 and Quiz 3
  2: [],     // Student B has no quizzes assigned
  3: [2],    // Student C has been assigned Quiz 2
};

const DistributeQuiz = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);

  const handleStudentClick = (studentId) => {
    setSelectedStudent(studentId);
    setAssignedQuizzes(mockAssignments[studentId] || []);
  };

  const handleQuizCheck = (quizId) => {
    const updatedAssignments = assignedQuizzes.includes(quizId)
      ? assignedQuizzes.filter(id => id !== quizId)
      : [...assignedQuizzes, quizId];
    setAssignedQuizzes(updatedAssignments);
  };

  const handleSubmit = () => {
    if (selectedStudent !== null) {
      mockAssignments[selectedStudent] = assignedQuizzes;
      message.success(`Assignments updated for Student ${selectedStudent}`);
    } else {
      message.error('Please select a student first!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Distribute Quizzes to Students</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <Title level={4}>Students</Title>
          <List
            bordered
            dataSource={mockStudents}
            renderItem={(student) => (
              <List.Item
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                style={{ cursor: 'pointer', background: selectedStudent === student.id ? '#e6f7ff' : 'white' }}
              >
                {student.name}
              </List.Item>
            )}
          />
        </div>

        <div style={{ flex: 2 }}>
          <Title level={4}>Quizzes</Title>
          {selectedStudent !== null ? (
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={mockQuizzes}
              renderItem={(quiz) => (
                <List.Item>
                  <Card title={quiz.title}>
                    <Checkbox
                      checked={assignedQuizzes.includes(quiz.id)}
                      onChange={() => handleQuizCheck(quiz.id)}
                    >
                      {assignedQuizzes.includes(quiz.id) ? 'Assigned' : 'Assign'}
                    </Checkbox>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <p>Please select a student to view and assign quizzes.</p>
          )}
        </div>
      </div>
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Save Assignments
      </Button>
    </div>
  );
};

export default DistributeQuiz;
