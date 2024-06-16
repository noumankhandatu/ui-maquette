import React, { useState } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input, Image } from "antd";
import Swal from "sweetalert2";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

const { Title } = Typography;
const { Content } = Layout;

import { apiPost } from "../utils/axios";

import { setUser } from "../redux/slices/userSlice";

const ConnexionAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [spinner, setSpinner] = useState(false);

  const onFinish = async (values) => {
    try {
      setSpinner(true);

      const data = await apiPost(`/admin-login`, values);

      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.userDetails));

        navigate({ pathname: "/dashboard/cards" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
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

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col md={{ span: 6, offset: 0 }}>
              <Title style={{ textAlign: "center" }}>
                <Image
                  src="/logo.jpeg" // Remplacez par l'URL de l'image de profil
                  alt="logo"
                  preview={false}
                  width={"70%"}
                />
              </Title>
              <Title className="mb-15">Connexion</Title>
              <Title className="font-regular text-muted" level={5}>
                Entrez votre email et mot de passe pour vous connecter
              </Title>
              <Form onFinish={onFinish} layout="vertical" className="row-col">
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez saisir votre email !",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Mot de passe"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez saisir votre mot de passe !",
                    },
                  ]}
                >
                  <Input placeholder="Mot de passe" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: "100%" }} disabled={spinner}>
                    SE CONNECTER
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default ConnexionAdmin;
