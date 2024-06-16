import { useEffect, useState } from "react";
import { Upload, Image, Form, Input, Row, Col, Button, message, Space } from "antd";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { ProCard } from "@ant-design/pro-components";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import CardPreview from "./CardPreview";
import { apiGet, apiPost, apiPut } from "../utils/axios";
// import Icon from "@ant-design/icons/lib/components/Icon";

function CreateCardNew() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const user = useSelector((state) => state);

  const initialValues = {
    name: "",
    job: "",
    company: "",
    instagram: "",
    insta_pic: null,
    linkedin: "",
    linkedin_pic: null,
    facebook: "",
    facebook_pic: null,
    web_pic: null,
    web_url: "",
    email: "",
    email2: "",
    phone: "",
    telephone: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    zip: "",
    profile_pic: null,
    cover_pic: null,
    subscription: null,
    customer_id: null,
  };

  const [spinner, setSpinner] = useState(false);

  const navigate = useNavigate();

  const values = Form.useWatch([], form);

  const [imageUrls, setImageUrls] = useState({
    profile_pic: null,
    cover_pic: null,
    insta_pic: null,
    facebook_pic: null,
    linkedin_pic: null,
    web_pic: null,
  });

  const [componentDisabled, setComponentDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/HEIC" ||
      file.type === "image/AAE" ||
      file.type === "image/svg+xml";
    if (!isJpgOrPng) {
      message.error("Vous ne pouvez télécharger que des fichiers JPG/PNG/HEIC/AAE !");
    }
    if (file.width > 1024 || file.height > 768) {
      message.error("L'image doit être inférieure à 1k pixels.");
    }
    const isLt5M = file.size / 1024 / 1024 < 1;
    if (!isLt5M) {
      message.error("L'image doit être inférieure à 1 Mo !");
    }
    return isJpgOrPng && isLt5M;
  };

  const handleChangeProfile = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("profile_pic", imageUrl);
      });
    } else if (info.file.status === "error") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("profile_pic", imageUrl);
      });
      // message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleChangeInsta = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("insta_pic", imageUrl);
      });
    } else if (info.file.status === "error") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("insta_pic", imageUrl);
      });
      // message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleChangeLinkedin = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("linkedin_pic", imageUrl);
      });
    } else if (info.file.status === "error") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("linkedin_pic", imageUrl);
      });
      // message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleChangeFacebook = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("facebook_pic", imageUrl);
      });
    } else if (info.file.status === "error") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("facebook_pic", imageUrl);
      });
      // message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleChangeWeb = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("web_pic", imageUrl);
      });
    } else if (info.file.status === "error") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("web_pic", imageUrl);
      });
      // message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleChangeCover = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("cover_pic", imageUrl);
      });
    } else if (info.file.status === "error") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        updateImageUrl("cover_pic", imageUrl);
      });
      // message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadButton = (
    <div className="ant-upload-text font-semibold text-dark">
      {loading ? (
        <LoadingOutlined style={{ width: 20, color: "#000" }} />
      ) : (
        <PlusOutlined style={{ width: 20, color: "#000" }} />
      )}
      <div>Upload</div>
    </div>
  );

  const updateImageUrl = (type, value) => {
    setImageUrls({ ...imageUrls, [type]: value });
  };

  const saveData = async (reqData) => {
    try {
      setSpinner(true);
      let response = null;

      if (id) {
        response = await apiPut("/auth/card/update", { ...reqData, id });
      } else {
        response = await apiPost("/auth/cards/create", reqData);
      }
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
    let reqData = null;
    if (user.role == "admin") {
      reqData = { ...values, ...imageUrls, subscription: null, customer_id: null };
    } else if (user.role == "subaccount") {
      reqData = { ...values, ...imageUrls, subscription: null, customer_id: user.id };
    } else {
      reqData = { ...values, ...imageUrls, subscription: user.offer, customer_id: user.id };
    }
    saveData(reqData);
  };

  const getCardData = async (id) => {
    try {
      setComponentDisabled(true);
      const response = await apiGet(`/auth/card/${id}`);
      if (response.success) {
        Object.keys(response.card).forEach((key) => {
          if (response.card[key] == "null") {
            response.card[key] = null;
          }
        });
        form.setFieldsValue(response.card);
        setImageUrls({
          profile_pic: response.card.profile_pic,
          cover_pic: response.card.cover_pic,
          insta_pic: response.card.insta_pic,
          facebook_pic: response.card.facebook_pic,
          linkedin_pic: response.card.linkedin_pic,
          web_pic: response.card.web_pic,
        });
        setComponentDisabled(false);
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
      setComponentDisabled(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCardData(id);
    }
  }, [id]);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={14} className="mb-24 ">
          <Space direction="vertical" size="large" style={{ display: "flex" }}>
            <Form
              initialValues={initialValues}
              layout="vertical"
              disabled={componentDisabled}
              form={form}
              onFinish={onFinish}
              autoComplete="off"
            >
              <ProCard title="Profil" headerBordered collapsible>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Photo de profil"
                      valuePropName="profile_pic"
                      getValueFromEvent={imageUrls.profile_pic}
                    >
                      <Upload
                        name="profile_pic"
                        listType="picture-card"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        // headers={{
                        //   authorization: "authorization-text",
                        // }}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeProfile}
                      >
                        {imageUrls.profile_pic ? (
                          <div
                            style={{
                              width: "80px",
                              //   justifyContent: "center",
                            }}
                          >
                            <Image
                              src={imageUrls.profile_pic} // Remplacez par l'URL de l'image de profil
                              alt="Photo de profil"
                              preview={false}
                            />
                          </div>
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col md={8}>
                    <Form.Item
                      label="Photo de couverture"
                      valuePropName="cover_pic"
                      getValueFromEvent={imageUrls.cover_pic}
                    >
                      <Upload
                        name="cover_pic"
                        listType="picture-card"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        // headers={{
                        //   authorization: "authorization-text",
                        // }}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeCover}
                      >
                        {imageUrls.cover_pic ? (
                          <div
                            style={{
                              width: "80px",
                            }}
                          >
                            <Image
                              src={imageUrls.cover_pic} // Remplacez par l'URL de l'image de couverture
                              alt="Photo de couverture"
                              preview={false}
                            />
                          </div>
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 0]}>
                  <Col md={16}>
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
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Titre du poste"
                      name="job"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir votre titre de poste !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={8}>
                    <Form.Item
                      label="Société"
                      name="company"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir le nom de votre entreprise !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </ProCard>
              <ProCard title="Réseaux sociaux" headerBordered collapsible defaultCollapsed>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Photo Instagram"
                      valuePropName="insta_pic"
                      getValueFromEvent={imageUrls.insta_pic}
                    >
                      <Upload
                        name="Photo Instagram"
                        listType="picture-card"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        // headers={{
                        //   authorization: "authorization-text",
                        // }}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeInsta}
                      >
                        {imageUrls.insta_pic ? (
                          <div
                            style={{
                              width: "80px",
                            }}
                          >
                            <Image
                              src={imageUrls.insta_pic} // Remplacez par l'URL de l'image de profil
                              alt="Photo Instagram"
                              preview={false}
                            />
                          </div>
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={16}>
                    <Form.Item
                      label="URL Instagram"
                      name="instagram"
                      rules={[
                        {
                          type: "url",
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Photo LinkedIn"
                      valuePropName="linkedin_pic  "
                      getValueFromEvent={imageUrls.linkedin_pic}
                    >
                      <Upload
                        name="Photo LinkedIn"
                        listType="picture-card"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        // headers={{
                        //   authorization: "authorization-text",
                        // }}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeLinkedin}
                      >
                        {imageUrls.linkedin_pic ? (
                          <div
                            style={{
                              width: "80px",
                            }}
                          >
                            <Image
                              src={imageUrls.linkedin_pic} // Remplacez par l'URL de l'image de profil
                              alt="Photo LinkedIn"
                              preview={false}
                            />
                          </div>
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={16}>
                    <Form.Item
                      label="Profil LinkedIn"
                      name="linkedin"
                      rules={[
                        {
                          type: "url",
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Photo Facebook"
                      valuePropName="facebook_pic"
                      getValueFromEvent={imageUrls.facebook_pic}
                    >
                      <Upload
                        name="Photo Facebook"
                        listType="picture-card"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        // headers={{
                        //   authorization: "authorization-text",
                        // }}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeFacebook}
                      >
                        {imageUrls.facebook_pic ? (
                          <div
                            style={{
                              width: "80px",
                            }}
                          >
                            <Image
                              src={imageUrls.facebook_pic} // Remplacez par l'URL de l'image de profil
                              alt="Photo Facebook"
                              preview={false}
                            />
                          </div>
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={16}>
                    <Form.Item
                      label="Profil Facebook"
                      name="facebook"
                      rules={[
                        {
                          type: "url",
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item label="Photo de site Web" valuePropName="web_pic" getValueFromEvent={imageUrls.web_pic}>
                      <Upload
                        name="Photo de site Web"
                        listType="picture-card"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        // headers={{
                        //   authorization: "authorization-text",
                        // }}
                        beforeUpload={beforeUpload}
                        onChange={handleChangeWeb}
                      >
                        {imageUrls.web_pic ? (
                          <div
                            style={{
                              width: "80px",
                            }}
                          >
                            <Image
                              src={imageUrls.web_pic} // Remplacez par l'URL de l'image de profil
                              alt="Photo de site Web"
                              preview={false}
                            />
                          </div>
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={16}>
                    <Form.Item
                      label="URL de site Web"
                      name="web_url"
                      rules={[
                        {
                          type: "url",
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                {/* </Form> */}
              </ProCard>
              <ProCard title="Contact" headerBordered collapsible defaultCollapsed>
                <Row gutter={[24, 0]}>
                  <Col md={16}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre adresse e-mail !",
                          type: "email",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={16}>
                    <Form.Item
                      label="Numéro de téléphone portable"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre numéro de téléphone portable !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={16}>
                    <Form.Item
                      label="Numéro de téléphone fixe"
                      name="telephone"
                      rules={[
                        {
                          message: "Veuillez entrer votre adresse !",
                          type: "string",
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input />
                      {/* <Input.TextArea showCount maxLength={100} /> */}
                    </Form.Item>
                  </Col>
                  <Col md={16}>
                    <Form.Item
                      label="Adresse e-mail secondaire"
                      name="email2"
                      rules={[
                        {
                          warningOnly: true,
                          message: "Veuillez entrer votre adresse e-mail !",
                          type: "email",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={16}>
                    <Form.Item
                      label="URL supplémentaire"
                      name="address"
                      rules={[
                        {
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}></Row>
                {/* </Form> */}
              </ProCard>
              <ProCard title="Adresse" headerBordered collapsible defaultCollapsed>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Adresse ligne 1"
                      name="addressLine1"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre adresse !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={8}>
                    <Form.Item
                      label="Adresse ligne 2"
                      name="addressLine2"
                      rules={[
                        {
                          type: "string",
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={8}>
                    <Form.Item
                      label="Ville"
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre ville !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={8}>
                    <Form.Item
                      label="Code postal"
                      name="zip"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre code postal !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col md={16}>
                    <Form.Item
                      label="Pays"
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre pays !",
                          type: "string",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </ProCard>
              <Button type="primary" htmlType="submit" disabled={spinner}>
                Enregistrer
              </Button>
            </Form>
          </Space>
        </Col>
        <Col span={24} md={10} className="mb-20">
          <CardPreview values={values ?? initialValues} user={user} imageUrls={imageUrls} id={id} />
        </Col>
      </Row>
    </>
  );
}

export default CreateCardNew;
