import { useState, useRef, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import VCard from "vcard-creator";
import QRCode from "react-qr-code";

import { Card, Image, Typography, Space, Button, Tooltip, List } from "antd";

import BgProfile from "../assets/images/bg-profile.jpg";
import ProfilAvatar from "../assets/images/profile.png";
import Linkedin from "../assets/images/linkedin.png";
import Instagram from "../assets/images/instagram.png";
import Facebook from "../assets/images/facebook.png";
import Web from "../assets/images/web.png";

import { DownloadOutlined, ShareAltOutlined, QrcodeOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Text } = Typography;

function CardPreview({ values, imageUrls, user, id }) {
  const [front, setFront] = useState(true);

  const [qrurl, setQrurl] = useState(encodeURI(`${import.meta.env.VITE_WEB_URL}/cards/view?${id ?? ""}`));

  const data = [
    {
      title: "Email",
      description: values.email,
    },
    {
      title: "Numéro de téléphone portable",
      description: values.phone,
    },
    {
      title: "Adresse",
      description: values.addressLine1 + ", " + (values.addressLine2 ? values.addressLine2 : ""),
    },
    {
      title: "Ville, Code postal",
      description: values.city + ", " + values.zip,
    },
    {
      title: "Pays",
      description: values.country,
    },
  ];
  if (values.email2) {
    data.push({ title: "Adresse email secondaire", description: values.email2 });
  }
  if (values.telephone) {
    data.push({ title: "Numéro de téléphone", description: values.telephone });
  }

  if (values.address) {
    data.push({
      title: "URL supplémentaire",
      description: (
        <a href={values.address} target="_blank" style={{ color: "rgba(0, 0, 0, 0.45)" }}>
          {values.address}
        </a>
      ),
    });
  }

  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef(null);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("not done");

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("done");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: values.email ?? "",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (text === "done" && typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const handleDownloadVCF = () => {
    let [firstname, ...lastname] = values.name.split(" ");
    const myVCard = new VCard();
    let b64 = "";
    if (imageUrls.profile_pic) {
      b64 = imageUrls.profile_pic.replace(/^data:image.+;base64,/, "");
    }
    myVCard
      // add personal data
      // .addName(values.name)
      .addName(lastname.toString().replaceAll(",", ""), firstname, "", "", "")
      // add work data
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

    const element = document.createElement("a");
    const file = new Blob([myVCard.toString()], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${values.name}.vcf`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      <div className="card-mobile-preview" ref={componentRef}>
        <Card
          title={false}
          style={{
            width: "100%", // Set to 100% on mobile
            maxWidth: "400px", // Limit to a maximum width of 300px
            position: "relative",
            textAlign: "center",
            margin: "auto",
            background: "#fff",
            maxHeight: "85vh",
            overflowY: "auto", // Add scrollability for larger screens
            // border: "14px solid #ccc", // Border style to create a device frame
            border: "16px black solid", // Border style to create a device frame
            borderTopWidth: "30px",
            borderBottomWidth: "40px",
            borderRadius: "10px", // Set a background color
            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)", // Add a box shadow for depth
          }}
        >
          {front ? (
            <>
              <Image
                src={imageUrls?.cover_pic ?? BgProfile} // Replace with the URL of the cover image
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
                  src={imageUrls?.profile_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                  alt="Profile Picture"
                />
              </div>
              <div>
                <Meta
                  title={values?.name}
                  description={[
                    <Space direction="vertical" style={{ rowGap: "0px" }}>
                      <Text type="secondary">{values.job}</Text>
                      <Text>{values.company}</Text>
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
                      style={{ background: "rgb(210 209 209)", color: "#000" }}
                      target="_black"
                      disabled={true}
                    >
                      Échanger <br /> de contact
                    </Button>
                  </Tooltip>
                </Space>
              </div>
              <div style={{ marginTop: "5px" }}>
                <Space>
                  <Tooltip title={values?.web_url}>
                    {imageUrls?.web_pic ? (
                      <Image
                        width={35} // Width of the profile picture
                        src={imageUrls?.web_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                        alt="Web Picture"
                        onClick={() => {
                          window.open(values?.web_url ? values?.web_url : "#");
                        }}
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
                    {imageUrls?.insta_pic ? (
                      <Image
                        width={35} // Width of the profile picture
                        src={imageUrls?.insta_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                        alt="Instagram Logo"
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
                        <img src={Instagram} alt="Instagram Logo" style={{ width: "40px", height: "40px" }} />
                      </Button>
                    )}
                  </Tooltip>
                  <Tooltip title={values.linkedin}>
                    {imageUrls?.linkedin_pic ? (
                      <Image
                        width={35} // Width of the profile picture
                        src={imageUrls?.linkedin_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                        alt="Linkedin logo"
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
                    {imageUrls?.facebook_pic ? (
                      <Image
                        width={35} // Width of the profile picture
                        src={imageUrls?.facebook_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                        alt="Facebook logo"
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
                    dataSource={data}
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
                  src={imageUrls?.profile_pic ?? ProfilAvatar} // Replace with the URL of the profile image
                  alt="Profile Picture"
                />
              </div>

              <div>
                <Meta
                  title={values.name}
                  description={[
                    <Space direction="vertical" style={{ rowGap: "0px" }}>
                      <Text type="secondary">{values.job}</Text>
                      <Text>{values.company}</Text>
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
      {/* {user.role == "admin" && <Button onClick={handlePrint}>Print </Button>} */}
    </>
  );
}

export default CardPreview;
