import { useState, useEffect } from "react";
import VCard from "vcard-creator";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";

import { Card, Image, Typography, Space, Button, Tooltip, List, Row, Col, Layout, Skeleton } from "antd";

import BgProfile from "../assets/images/bg-profile.jpg";
import ProfilAvatar from "../assets/images/profile.png";
import Linkedin from "../assets/images/linkedin.png";
import Instagram from "../assets/images/instagram.png";
import Facebook from "../assets/images/facebook.png";
import Web from "../assets/images/web.png";

import { DownloadOutlined, ShareAltOutlined, QrcodeOutlined } from "@ant-design/icons";
// modal code
import { Modal, Form, Input } from "antd";

const { Meta } = Card;
const { Text } = Typography;
const { Content } = Layout;

import { apiGet } from "../utils/axios.js";

const CardView = () => {
  const [spinner, setSpinner] = useState(true);

  const [values, setValues] = useState();

  const [front, setFront] = useState(true);

  const [qrurl, setQrurl] = useState();

  const createVCard = (values) => {
    let [firstname, ...lastname] = values.name.split(" ");
    const myVCard = new VCard();
    let b64 = "";
    if (values.profile_pic) {
      b64 = values.profile_pic.replace(/^data:image.+;base64,/, "");
    }
    myVCard
      .addName(lastname.toString().replaceAll(",", ""), firstname, "", "", "")
      .addCompany(values.company)
      .addJobtitle(values.job)
      .addEmail(values.email)
      .addPhoneNumber(values.phone, "PREF;WORK")
      .addPhoneNumber(values.telephone ?? "", "WORK")
      .addAddress("", "", values.addressLine1, values.addressLine2 ?? "", values.zip, values.city, values.country)
      .addSocial(values.facebook, "Facebook")
      .addSocial(values.instagram, "Instagram")
      .addSocial(values.linkedin, "LinkedIn")
      .addURL(values.web_url)
      .addPhoto(b64);

    return myVCard;
  };

  const handleDownloadVCF = () => {
    const myVCard = createVCard(values);
    const element = document.createElement("a");
    const file = new Blob([myVCard.toString()], { type: "text/vcard;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${values.name}.vcf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCardData = async () => {
    try {
      setSpinner(true);
      const response = await apiGet(`/card/${window.location.search.substr(1)}`);
      if (response.success) {
        const data = {
          ...response.card,
          link: [
            {
              title: "E-mail",
              description: response.card?.email,
            },
            {
              title: "Numéro de téléphone portable",
              description: response.card?.phone,
            },
            {
              title: "Adresse",
              description:
                response.card?.addressLine1 + ", " + (response.card?.addressLine2 ? response.card?.addressLine2 : ""),
            },
            {
              title: "Ville, Code postal",
              description: response.card?.city + ", " + response.card?.zip,
            },
            {
              title: "Pays",
              description: response.card?.country,
            },
            response.card?.email2 ? { title: "E-mail secondaire", description: response.card?.email2 } : {},
            response.card?.telephone
              ? response.card?.telephone != "undefined"
                ? { title: "Numéro de téléphone", description: response.card?.telephone }
                : {}
              : {},
            response.card?.address
              ? response.card?.address != "undefined"
                ? {
                    title: "URL supplémentaire",
                    description: (
                      <a href={response.card?.address} target="_blank" style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                        {response.card?.address}
                      </a>
                    ),
                  }
                : {}
              : {},
          ],
        };
        setQrurl(window.location.href);
        Object.keys(data).forEach((key) => {
          if (data[key] == "null" || data[key] == "undefined") {
            data[key] = null;
          }
        });
        setValues(data);
        setSpinner(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.error,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      setSpinner(false);
    }
  };

  useEffect(() => {
    if (window.location.search.substr(1)) {
      getCardData();
    }
  }, []);

  // modal code
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const modalContent = (
    <Modal title="Échanger de contact" visible={modalVisible} onCancel={toggleModal} footer={null}>
      <Form
        layout="vertical"
        onFinish={(values) => {
          console.log("Form values:", values);
          // Handle form submission logic here
          toggleModal(); // Close modal after form submission
        }}
      >
        <Form.Item
          name="firstName"
          label="Prénom"
          rules={[{ required: true, message: "Veuillez saisir votre prénom" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Nom de famille"
          rules={[{ required: true, message: "Veuillez saisir votre nom de famille" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telephone"
          label="Numéro de téléphone"
          rules={[{ required: true, message: "Veuillez saisir votre numéro de téléphone" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Adresse e-mail"
          rules={[
            { required: true, message: "Veuillez saisir votre adresse e-mail" },
            { type: "email", message: "Adresse e-mail invalide" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="company" label="Entreprise">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Soumettre
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
  return (
    <>
      {/* modal work */}
      {modalContent}
      <Layout className="layout-default">
        <Content className="content-ant">
          <Row gutter={[24, 0]} style={{ margin: 0 }}>
            <Col xs={{ span: 24 }}>
              {spinner ? (
                <Skeleton
                  avatar
                  paragraph={{
                    rows: 4,
                  }}
                />
              ) : (
                <>
                  <div className="card-mobile-preview">
                    <Card
                      title={false}
                      style={{
                        width: "100%", // Set to 100% on mobile
                        maxWidth: "450px", // Limit to a maximum width of 300px
                        position: "relative",
                        textAlign: "center",
                        margin: "auto",
                        background: "#fff",
                        // maxHeight: "80vh",
                        // overflowY: "auto", // Add scrollability for larger screens
                        // border: "14px solid #ccc", // Border style to create a device frame
                        // border: "16px black solid", // Border style to create a device frame
                        // borderTopWidth: "60px",
                        // borderBottomWidth: "60px",
                        borderRadius: "20px", // Set a background color
                        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)", // Add a box shadow for depth
                      }}
                    >
                      {front ? (
                        <>
                          <Image
                            src={values?.cover_pic ?? BgProfile} // Replace with the URL of the cover image
                            alt="Cover Image"
                            style={{ width: "100%", maxHeight: "auto" }}
                          />
                          <div
                            style={{
                              margin: "5px auto",
                              marginTop: "-15%", // Overlap by 5% with the cover image
                              width: "130px", // Reduced width by 5%
                              height: "130px", // Reduced height by 5%
                              borderRadius: "50%",
                              overflow: "hidden",
                              border: "2px solid #ccc",
                            }}
                          >
                            <Image
                              width={"100%"} // Width of the profile picture
                              src={values?.profile_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                              alt="Profile Picture"
                            />
                          </div>
                          <div>
                            <Meta
                              title={values?.name}
                              description={[
                                <Space direction="vertical" style={{ rowGap: "0px" }}>
                                  <Text type="secondary">{values?.job}</Text>
                                  <Text>{values?.company}</Text>
                                </Space>,
                              ]}
                            />
                          </div>

                          <div style={{ marginTop: "10px", padding: "10px" }}>
                            <Space>
                              <Button
                                type="primary"
                                shape="round"
                                icon={<DownloadOutlined />}
                                size={"small"}
                                style={{ background: "#008037" }}
                                onClick={handleDownloadVCF}
                              >
                                Ajouter aux contacts <br /> de contact
                              </Button>

                              <Tooltip title={"Bientôt disponible"}>
                                <Button
                                  type="primary"
                                  shape="round"
                                  icon={<ShareAltOutlined />}
                                  size={"small"}
                                  onClick={toggleModal}
                                  style={{ background: "rgb(210 209 209)", color: "#000" }}
                                >
                                  Échanger <br /> de contact
                                </Button>
                              </Tooltip>
                              {/* <Tooltip title={encodeURI(`${import.meta.env.VITE_WEB_URL}/cards/view?${values?.id}`)}>
                                <Button
                                  type="primary"
                                  shape="round"
                                  icon={<ShareAltOutlined />}
                                  size={"small"}
                                  style={{ background: "rgb(210 209 209)", color: "#000" }}
                                >
                                  Partager
                                </Button>
                              </Tooltip> */}
                            </Space>
                          </div>
                          <div style={{ marginTop: "5px" }}>
                            <Space>
                              <Tooltip title={values?.web_url}>
                                {values?.web_pic ? (
                                  <Image
                                    width={35} // Width of the profile picture
                                    src={values?.web_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                                    alt="Web Picture"
                                    onClick={() => {
                                      window.open(values?.web_url ? values?.web_url : "#");
                                    }}
                                    preview={false}
                                  />
                                ) : (
                                  <Button
                                    type="primary"
                                    href={values.web_url ? values.web_url : "#"}
                                    target="_black"
                                    style={{
                                      background: "transparent",
                                      boxShadow: "none",
                                      border: "none",
                                      padding: "0px",
                                    }}
                                  >
                                    <img src={Web} alt="Web Logo" style={{ width: "40px", height: "40px" }} />
                                  </Button>
                                )}
                              </Tooltip>
                              <Tooltip title={values?.instagram}>
                                {values?.insta_pic ? (
                                  <Image
                                    width={35} // Width of the profile picture
                                    src={values?.insta_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                                    alt="Profile Picture"
                                    onClick={() => {
                                      window.open(values?.instagram ? values?.instagram : "#");
                                    }}
                                  />
                                ) : (
                                  <Button
                                    type="primary"
                                    href={values.instagram ? values.instagram : "#"}
                                    target="_black"
                                    style={{
                                      background: "transparent",
                                      boxShadow: "none",
                                      border: "none",
                                      padding: "0px",
                                    }}
                                  >
                                    <img
                                      src={Instagram}
                                      alt="Instagram Logo"
                                      style={{ width: "40px", height: "40px" }}
                                    />
                                  </Button>
                                )}
                              </Tooltip>
                              <Tooltip title={values?.linkedin}>
                                {values?.linkedin_pic ? (
                                  <Image
                                    width={35} // Width of the profile picture
                                    src={values?.linkedin_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                                    alt="Profile Picture"
                                    onClick={() => {
                                      window.open(values?.linkedin ? values?.linkedin : "#");
                                    }}
                                  />
                                ) : (
                                  <Button
                                    type="primary"
                                    href={values?.linkedin ? values?.linkedin : "#"}
                                    target="_black"
                                    style={{
                                      background: "transparent",
                                      boxShadow: "none",
                                      border: "none",
                                      padding: "0px",
                                    }}
                                  >
                                    <img src={Linkedin} alt="Linkedin Logo" style={{ width: "40px", height: "40px" }} />
                                  </Button>
                                )}
                              </Tooltip>
                              <Tooltip title={values?.facebook}>
                                {values?.facebook_pic ? (
                                  <Image
                                    width={35} // Width of the profile picture
                                    src={values?.facebook_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                                    alt="Facebook Picture"
                                    onClick={() => {
                                      window.open(values?.facebook ? values?.facebook : "#");
                                    }}
                                  />
                                ) : (
                                  <Button
                                    type="primary"
                                    href={values.facebook ? values.facebook : "#"}
                                    target="_black"
                                    style={{
                                      background: "transparent",
                                      boxShadow: "none",
                                      border: "none",
                                      padding: "0px",
                                    }}
                                  >
                                    <img src={Facebook} alt="Facebook Logo" style={{ width: "40px", height: "40px" }} />
                                  </Button>
                                )}
                              </Tooltip>
                            </Space>
                          </div>
                          <div style={{ padding: "10px", textAlign: "left" }}>
                            <Card bordered={false} style={{ padding: "10px" }}>
                              <List
                                size="small"
                                header={false}
                                itemLayout="horizontal"
                                dataSource={values?.link}
                                renderItem={(item, index) => (
                                  <List.Item key={index}>
                                    <List.Item.Meta title={item.title} description={item.description} />
                                  </List.Item>
                                )}
                              />
                            </Card>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              margin: "30px auto",
                              width: "130px",
                              height: "130px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              border: "2px solid #ccc",
                            }}
                          >
                            <Image
                              style={{ width: "100%", height: "auto" }}
                              src={values?.profile_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                              alt="Profile Picture"
                            />
                          </div>

                          <div>
                            <Meta
                              title={values?.name}
                              description={[
                                <Space direction="vertical" style={{ rowGap: "0px" }}>
                                  <Text type="secondary">{values?.job}</Text>
                                  <Text>{values?.company}</Text>
                                </Space>,
                              ]}
                            />
                          </div>

                          <div
                            style={{
                              margin: "30px auto",
                              width: "200px",
                              height: "200px",
                            }}
                          >
                            <QRCode
                              size={256}
                              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                              value={qrurl}
                              viewBox={`0 0 256 256`}
                              fgColor={"#88C032"}
                            />
                          </div>
                        </>
                      )}
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Text>
                          <i>Propulsé par </i>
                          <span style={{ color: "#008037", fontWeight: "bold" }}>WeFast</span>
                        </Text>
                      </div>
                    </Card>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button icon={<QrcodeOutlined />} onClick={() => setFront(!front)} className="qr-code-btn" />
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default CardView;
