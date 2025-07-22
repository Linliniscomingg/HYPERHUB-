import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Typography } from "antd";
import Loader from "../../components/Loader";

const QuizResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = () => {
      // Mock data
      const mockData = [
        {
          studentName: "John Doe",
          score: 85,
          date: "2024-08-08T14:30:00Z",
        },
        {
          studentName: "Jane Smith",
          score: 92,
          date: "2024-08-07T10:00:00Z",
        },
        {
          studentName: "Emily Johnson",
          score: 78,
          date: "2024-08-06T09:15:00Z",
        },
      ];

      setResults(mockData);
      setIsLoading(false);
    };

    fetchResults();
  }, [id]);

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <section>
      <Typography.Title level={3}>Quiz Results</Typography.Title>
      <Table
        columns={columns}
        dataSource={results.map((result, index) => ({
          key: index,
          studentName: result.studentName,
          score: result.score,
          date: new Date(result.date).toLocaleDateString(),
        }))}
      />
    </section>
  );
};

export default QuizResults;
