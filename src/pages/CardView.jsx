import { useState, useEffect } from "react";
import VCard from "vcard-creator";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";

import { Card, Image, Typography, Space, Button, Tooltip, List, Row, Col, Layout, Skeleton, Checkbox } from "antd";

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

import { apiGet, apiPost } from "../utils/axios.js";
import { Link } from "react-router-dom";

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

  const getUserId = () => {
    let urlString = window.location.href;

    // Use URLSearchParams to parse the query string
    let urlParams = new URLSearchParams(urlString);

    // Iterate over all query parameters
    urlParams.forEach((value, key) => {
      console.log(`${key} = ${value}`);
    });
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
    // getUserId()
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

  // states
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [business, setBussiness] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleFormSubmit = async (formValues) => {
    const payload = {
      name: `${firstName} ${surname}`,
      userID: window.location.search.substr(1),
      phone: phoneNumber,
      email: emailAddress,
      enterprise: business,
    };

    if (!firstName || !phoneNumber || !emailAddress || !business)
      return Swal.fire({
        icon: "Feild Error",
        title: "Feild Error",
        text: "Enter all feilds",
      });
    if (!checkboxChecked) {
      return Swal.fire({
        icon: "warning",
        title: "Checkbox Error",
        text: "You must acknowledge before submitting.",
      });
    }
    try {
      console.log("thisi is", window.location.search.substr(1));
      const response = await apiPost("/submit-contact", payload);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Contact information submitted successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error,
        });
      }
    } catch (error) {
      console.log(error, "error");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while submitting the contact information.",
      });
    }
  };
  const modalContent = (
    <>
      <Modal style={{ textAlign: "center" }} visible={modalVisible} onCancel={toggleModal} footer={null}>
        <img src="/Icon échange.png" style={{ height: 100 }} alt="" />

        <Form
          layout="vertical"
          onFinish={(values) => {
            // Handle form submission logic here
            toggleModal(); // Close modal after form submission
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 18 }}>J’envoi mes coordonnées à {values?.name}</span>

          <div style={{ height: 30 }} />
          <span style={{ fontWeight: "bold", fontSize: 18 }}>Nom et prénom</span>
          <Input
            onChange={(e) => setFirstName(e.target.value)}
            style={{
              border: "none",
              borderBottom: "2px solid green",
              outline: "none",
              boxShadow: "none",
              borderRadius: 0,
            }}
          />
          <div style={{ height: 30 }} />
          <span style={{ fontWeight: "bold", fontSize: 18 }}>Téléphone</span>
          <Input
            onChange={(e) => setPhone(e.target.value)}
            style={{
              border: "none",
              borderBottom: "2px solid green",
              outline: "none",
              boxShadow: "none",
              borderRadius: 0,
            }}
          />

          <div style={{ height: 30 }} />
          <span style={{ fontWeight: "bold", fontSize: 18 }}>Email</span>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            style={{
              border: "none",
              borderBottom: "2px solid green",
              outline: "none",
              boxShadow: "none",
              borderRadius: 0,
            }}
          />

          <div style={{ height: 30 }} />
          <span style={{ fontWeight: "bold", fontSize: 18 }}>Entreprise</span>
          <Input
            onChange={(e) => setBussiness(e.target.value)}
            style={{
              border: "none",
              borderBottom: "2px solid green",
              outline: "none",
              boxShadow: "none",
              borderRadius: 0,
            }}
          />
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)} style={{ marginTop: 10 }} />
          <Link
            to={"https://wefast.fr/politique-de-protection-des-donnees/"}
            style={{ fontWeight: "bold", fontSize: 10, marginLeft: 5, color: "#008037" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Je reconnais transmettre mes informations dans le cadre d’un échange de contact. Consultez notre <span style={{textDecoration:"underline"}}>politique
            de confidentialité.</span> 
          </Link>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleFormSubmit}
              style={{ borderRadius: 1000, letterSpacing: 3, marginTop: 10 }}
              type="primary"
              htmlType="submit"
            >
              Envoyer
            </Button>
          </Form.Item>
          <img src="/Logo WE FAST sans fond.png" alt="" style={{ height: 70 }} />
        </Form>
      </Modal>
    </>
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
