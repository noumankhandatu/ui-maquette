import { useState } from "react";
import { Form, Input, Row, Col, Button, Space } from "antd";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ProCard } from "@ant-design/pro-components";
import { apiPost } from "../utils/axios";

function SubAccountCreate() {
  const [form] = Form.useForm();
  const user = useSelector((state) => state);

  const [spinner, setSpinner] = useState(false);

  const navigate = useNavigate();

  const saveData = async (reqData) => {
    try {
      setSpinner(true);
      const response = await apiPost("/auth/subaccount/create", reqData);
      if (response.success) {
        navigate("/dashboard/cards");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.error,
        });
      }
      setSpinner(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      setSpinner(false);
    }
  };
  const onFinish = (values) => {
    saveData(values);
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} className="mb-24 ">
          <Space direction="vertical" size="large" style={{ display: "flex" }}>
            <Form
              initialValues={{
                name: "",
                email: "",
                password: "",
                cards_limit: "",
              }}
              layout="vertical"
              form={form}
              onFinish={onFinish}
              autoComplete="off"
            >
              <ProCard title="Sous-compte" headerBordered>
                <Row gutter={[24, 0]}>
                  <Col md={6}>
                    <Form.Item
                      label="Nom"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir votre nom !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input style={{ height: 50 }} />
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item
                      label="E-mail"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir votre e-mail !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input style={{ height: 50 }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={6}>
                    <Form.Item
                      label="Mot de passe"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir votre mot de passe !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input.Password style={{ height: 50 }} />
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item
                      label="Limite de cartes"
                      name="cards_limit"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir votre limite de cartes !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input style={{ height: 50 }} />
                    </Form.Item>
                  </Col>
                </Row>
                {user.role == "admin" && (
                  <Button type="primary" htmlType="submit" disabled={spinner}>
                    Enregistrer
                  </Button>
                )}
              </ProCard>
            </Form>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default SubAccountCreate;
