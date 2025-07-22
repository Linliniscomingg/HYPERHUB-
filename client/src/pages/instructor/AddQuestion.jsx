import React, { Fragment, useEffect, useState, useContext } from "react";
import Bread from "../../components/Bread";
import { Button, Col, Form, Input, Modal, Row, Upload, Select, Space } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Spring from "../../components/Spring";
import { createQuestions } from "../../api/quiz";
import { useAPI } from "../../hooks/api";
import { ViewContext } from "../../context/View";
import Loader from "../../components/Loader";

const AddQuestion = () => {
  const breadcrumb = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Quiz",
    },
  ];
  const userId = JSON.parse(localStorage.getItem("user"))?.account?._id;
  const viewContext = useContext(ViewContext);
  const [formQuiz] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const categoryResponseApi = useAPI(`/api/category`, null).data;

  useEffect(() => {
    if (categoryResponseApi) {
      setCategories(
        categoryResponseApi.map((category) => ({
          _id: category._id,
          title: category.title,
          description: category.description,
          subCategory: category.subCategory,
        }))
      );
    }
  }, [categoryResponseApi]);

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      const questions = json.map((row) => ({
        title: row["Question"],
        category: categories.find((cat) => cat.title === row["Category"])?._id,
        subcategory: categories
          .find((cat) => cat.title === row["Category"])
          ?.subCategory.find((sub) => sub.title === row["Subcategory"])?._id,
        type: row["Type"],
        level: row["Level"],
        options: row["Options"]?.split(",") || [],
        answer: row["Answer"]?.split(",") || [],
      }));

      formQuiz.setFieldsValue({ questions });
      setIsModalVisible(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFinish = (data) => {
    console.log(data);
    setIsLoading(true);
    createQuestions(data, userId)
      .then((res) => {
        if (res === true) {
          viewContext.handleSuccess("Create questions successfully!");
          formQuiz.resetFields();
          formQuiz.setFieldsValue({ questions: [] });
        } else if (res === false) {
          viewContext.handleError("Create question failed");
        } else {
          viewContext.handleError(res.error);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        viewContext.handleError(err);
      });
  };

  const handleValuesChange = (_, allValues) => {
    const updatedSelectedCategories = {};
    allValues.questions?.forEach((question, index) => {
      if (question?.category) {
        updatedSelectedCategories[index] =
          categories.find((cat) => cat._id === question.category)
            ?.subCategory || [];
      }
    });
    setSelectedCategories(updatedSelectedCategories);
  };

  return (
    <Spring>
      <Bread title="Add a new quiz" items={breadcrumb} />
      <div>
        <Form
          form={formQuiz}
          layout="vertical"
          onValuesChange={handleValuesChange}
          onFinish={handleFinish}
        >
          <Row gutter={24} justify={"center"}>
            <Col span={16}>
              <Row className="shadow-lg border rounded-lg bg-white p-6">
                <Col span={24} className="text-center mb-4">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setIsModalVisible(true)}
                    icon={<UploadOutlined />}
                  >
                    Upload Excel
                  </Button>
                </Col>

                {/* Questions Form List */}
                <Form.List name={"questions"}>
                  {(fields, { add, remove }) => (
                    <Row gutter={[12, 12]} className="w-full">
                      {fields.map((field, index) => (
                        <Fragment key={index}>
                          <Col span={24}>
                            <Form.Item
                              label={`Question ${index + 1}`}
                              name={[field.name, "title"]}
                              fieldKey={[field.fieldKey, "title"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Question is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter your question" />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Category"
                              name={[field.name, "category"]}
                              fieldKey={[field.fieldKey, "category"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Category is required",
                                },
                              ]}
                            >
                              <Select placeholder="Select category">
                                {categories.map((category) => (
                                  <Select.Option
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.title}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Subcategory"
                              name={[field.name, "subcategory"]}
                              fieldKey={[field.fieldKey, "subcategory"]}
                            >
                              <Select placeholder="Select subcategory">
                                {selectedCategories[index]?.map(
                                  (subcategory) => (
                                    <Select.Option
                                      key={subcategory._id}
                                      value={subcategory._id}
                                    >
                                      {subcategory.title}
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Level"
                              name={[field.name, "level"]}
                              fieldKey={[field.fieldKey, "level"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Level is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter level" />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Type"
                              name={[field.name, "type"]}
                              fieldKey={[field.fieldKey, "type"]}
                              rules={[
                                { required: true, message: "Type is required" },
                              ]}
                            >
                              <Input placeholder="Enter type" />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Options"
                              name={[field.name, "options"]}
                              fieldKey={[field.fieldKey, "options"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Options are required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter options, separated by commas" />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label="Answer"
                              name={[field.name, "answer"]}
                              fieldKey={[field.fieldKey, "answer"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Answer is required",
                                },
                              ]}
                            >
                              <Input placeholder="Enter answer, separated by commas" />
                            </Form.Item>
                          </Col>

                          <Col span={24}>
                            <Space>
                              <Button
                                type="dashed"
                                onClick={() => remove(field.name)}
                                icon={<PlusOutlined />}
                              >
                                Remove Question
                              </Button>
                            </Space>
                          </Col>
                        </Fragment>
                      ))}
                    </Row>
                  )}
                </Form.List>

                <Col span={24} className="text-center mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Upload Excel or CSV"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Upload
          beforeUpload={() => false}
          onChange={handleUpload}
          accept=".xlsx, .xls, .csv"
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Modal>
    </Spring>
  );
};

export default AddQuestion;
