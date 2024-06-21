import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  ExportOutlined,
  HomeOutlined,
  PlusOutlined,
  EditFilled,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Button,
  Typography,
  Checkbox,
  Space,
  Layout,
  Tooltip,
  Row,
  Col,
  Modal,
  Form,
  Input as AntdInput,
  message,
} from "antd";
import QRCode from "react-qr-code";
import { apiGet } from "../utils/axios"; // Adjusted to import apiGet only
import moment from "moment";
import "moment/locale/fr"; // Import French locale
import VCard from "vcard-creator";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const MyContact = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await apiGet("/auth/my-contacts");
      if (response.success && response.contacts) {
        const formattedContacts = response.contacts.map((contact) => {
          const storedNote = localStorage.getItem(`note-${contact.id}`);
          return {
            key: contact.id, // Ensure each row has a unique key
            firstName: contact.firstName,
            phoneNumber: contact.phoneNumber,
            emailAddress: contact.emailAddress,
            enterprise: contact.enterprise,
            date: moment(contact.created_at).format("LL"), // Assuming you have a date field
            notes: storedNote || contact.notes, // Use stored note if available
          };
        });
        setContacts(formattedContacts);
      } else {
        console.error("Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const filteredData = contacts.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.enterprise.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleExportAll = () => {
    // Export all filtered data as CSV
    exportToCSV(filteredData);
  };

  const handleExportSelected = () => {
    // Export only selected rows as CSV
    const selectedData = filteredData.filter((item) => selectedRowKeys.includes(item.key));
    exportToCSV(selectedData);
  };

  const exportToCSV = (data) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleAddNote = (key) => {
    setCurrentContactId(key);
    const storedNote = localStorage.getItem(`note-${key}`);
    setNote(storedNote || "");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentContactId) {
      localStorage.setItem(`note-${currentContactId}`, note);
      setContacts((prevContacts) =>
        prevContacts.map((contact) => (contact.key === currentContactId ? { ...contact, notes: note } : contact)),
      );
      message.success("Note added successfully");
      setIsModalVisible(false);
      setCurrentContactId(null);
      setNote("");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentContactId(null);
    setNote("");
  };

  const handleDownloadVCF = (record) => {
    let [firstname, ...lastname] = record.firstName.split(" ");
    const myVCard = new VCard();
    myVCard
      // add personal data
      .addName(lastname.toString().replaceAll(",", ""), firstname, "", "", "")
      // add work data
      .addCompany(record.enterprise)
      .addEmail(record.emailAddress)
      .addPhoneNumber(record.phoneNumber, "PREF;WORK")
      .addPhoneNumber(record.phoneNumber ?? "", "WORK");

    const element = document.createElement("a");
    const file = new Blob([myVCard.toString()], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${record.firstName}.vcf`;
    document.body.appendChild(element);
    element.click();
  };

  const columns = [
    {
      title: "Contact",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Entreprise",
      dataIndex: "enterprise",
      key: "enterprise",
    },
    {
      title: "Téléphone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <Button
          type="link"
          style={{ color: "#008037" }}
          icon={<PhoneOutlined />}
          onClick={() => (window.location.href = `tel:${text}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Email",
      dataIndex: "emailAddress",
      key: "emailAddress",
      render: (text) => (
        <Button
          style={{ color: "#008037" }}
          type="link"
          icon={<MailOutlined />}
          onClick={() => (window.location.href = `mailto:${text}`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Rencontre",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text, record) => (
        <Space size="middle">
          <Text style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {text}
            </span>
            {text ? (
              <EditFilled style={{ fontSize: 20, marginLeft: 10 }} onClick={() => handleAddNote(record.key)} />
            ) : (
              <PlusOutlined style={{ fontSize: 20, marginLeft: 10 }} onClick={() => handleAddNote(record.key)} />
            )}
          </Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Download VCF">
            <DownloadOutlined style={{ fontSize: 20 }} onClick={() => handleDownloadVCF(record)} />
          </Tooltip>
          <Tooltip title="QR Code">
            <QRCode style={{ fontSize: 20 }} value={record.emailAddress} size={30} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Header style={{ background: "#FAFAFA", paddingTop: 20, height: 90 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              border: "1px solid green",
              borderRadius: 20,
              width: 100,
              textAlign: "center",
              height: 45,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HomeOutlined className="text-black" style={{ fontSize: 15, color: "black" }} />
            <span className="text-black" style={{ marginLeft: 10, color: "black" }}>
              Home
            </span>
          </Link>
          <Title level={2} style={{ color: "#008037", textAlign: "center" }}>
            Mes Contacts
          </Title>
          <div />
        </div>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Input
              suffix={<SearchOutlined style={{ fontSize: 22 }} />}
              placeholder="Search bar to find a person in your database (by surname, first name or company)"
              style={{ width: 400, borderRadius: 100 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>
        <Row justify="space-between" align="middle" style={{ margin: "16px 0" }}>
          <Col>
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRowKeys(filteredData.map((item) => item.key));
                } else {
                  setSelectedRowKeys([]);
                }
              }}
              checked={selectedRowKeys.length === filteredData.length}
            >
              Tout sélectionner
            </Checkbox>
          </Col>
          <Col>
            <Button icon={<ExportOutlined />} onClick={handleExportAll}>
              Export All
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExportSelected}>
              Export Selected
            </Button>
          </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: "max-content" }}
        />

        {/* Modal for adding notes */}
        <Modal title="Ajouter une note" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form layout="vertical">
            <Form.Item label="Note">
              <AntdInput.TextArea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MyContact;
