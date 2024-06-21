import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  ExportOutlined,
  HomeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Table, Input, Button, Typography, Checkbox, Space, Layout, Tooltip, Row, Col, Menu } from "antd";
import QRCode from "react-qr-code";
import { apiGet } from "../utils/axios";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;

const handleDownloadVCard = (record) => {
  const vCardData = `
  BEGIN:VCARD
  VERSION:3.0
  FN:${record.firstName}
  TEL:${record.phoneNumber}
  EMAIL:${record.emailAddress}
  ORG:${record.enterprise}
  NOTE:${record.notes}
  END:VCARD
  `;
  const blob = new Blob([vCardData], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${record.firstName}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
        icon={<PhoneOutlined />}
        onClick={() => (window.location.href = `tel:${text}`)}
        style={{ color: "green" }}
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
        type="link"
        icon={<MailOutlined />}
        onClick={() => (window.location.href = `mailto:${text}`)}
        style={{ color: "green" }}
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
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: "Ajouter",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="QR Code">
          <QRCode value={record.emailAddress} size={32} />
        </Tooltip>
        <Tooltip title="Add Note">
          <Button
            type="link"
            icon={<EditOutlined style={{ color: "black" }} />}
            onClick={() => handleAddNote(record.key)}
          />
        </Tooltip>
        <Tooltip title="Download vCard">
          <Button
            type="link"
            icon={<DownloadOutlined style={{ color: "black" }} />}
            onClick={() => handleDownloadVCard(record)}
          />
        </Tooltip>
      </Space>
    ),
  },
];

const MyContact = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await apiGet("/auth/my-contacts");
      if (response.success && response.contacts) {
        const formattedContacts = response.contacts.map((contact) => ({
          key: contact.id, // Ensure each row has a unique key
          firstName: contact.firstName,
          phoneNumber: contact.phoneNumber,
          emailAddress: contact.emailAddress,
          enterprise: contact.enterprise,
          date: contact.date, // Assuming you have a date field
          notes: contact.notes, // Assuming you have a notes field
        }));
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
    // Implement logic to add a note for a contact
    console.log("Adding note for contact with key:", key);
    // Example: Open a modal or input field to add a note
  };

  return (
    <Layout>
      <Layout className="site-layout">
        <Header
          className="site-layout-background flex"
          style={{ padding: 10, display: "flex", justifyContent: "space-between", marginBottom: 30 }}
        >
          <Menu style={{ backgroundColor: "#fafafa", border: "1px solid transparent" }}>
            <Menu.Item style={{ border: "2px solid #008037", borderRadius: 10 }} icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
          </Menu>
          <Title level={2} style={{ color: "#008037", textAlign: "center" }}>
            Mes Contacts
          </Title>
          <div />
        </Header>
        <Content style={{ padding: "24px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Input
                suffix={<SearchOutlined style={{ fontSize: 22 }} />}
                placeholder="Barre de recherche pour trouver une personne dans votre base de données"
                style={{ width: 400, borderRadius: 100 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col>
              <Text>Aucun contact trouvé dans la base de données</Text>
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
                Exporter Tout
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExportSelected}>
                Exporter Sélectionné
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyContact;
