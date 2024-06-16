import React, { useEffect, useState } from "react";
import { SearchOutlined, DownloadOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { Table, Input, Button, Typography, Checkbox, Space, Layout, Tooltip, Row, Col } from "antd";
import QRCode from "react-qr-code";
import axios from "axios";
import { apiGet, apiPost } from "../utils/axios";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const dataSource = [
  // Example data
  {
    key: "1",
    fullName: "John Doe",
    company: "Example Inc.",
    phone: "123-456-7890",
    email: "john@example.com",
    date: "01/01/2023",
    notes: "Met at conference",
  },
  {
    key: "2",
    fullName: "Jane Smith",
    company: "Another Inc.",
    phone: "987-654-3210",
    email: "jane@example.com",
    date: "02/02/2023",
    notes: "Met at meetup",
  },
  // Add more data as needed
];

const columns = [
  {
    title: "Contact",
    dataIndex: "fullName",
    key: "fullName",
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: "Entreprise",
    dataIndex: "company",
    key: "company",
  },
  {
    title: "Téléphone",
    dataIndex: "phone",
    key: "phone",
    render: (text) => (
      <Button type="link" icon={<PhoneOutlined />} onClick={() => (window.location.href = `tel:${text}`)}>
        {text}
      </Button>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => (
      <Button type="link" icon={<MailOutlined />} onClick={() => (window.location.href = `mailto:${text}`)}>
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
        <Tooltip title="Download VCF">
          <Button icon={<DownloadOutlined />} onClick={() => handleDownload(record)} />
        </Tooltip>
        <Tooltip title="QR Code">
          <QRCode value={record.email} size={32} />
        </Tooltip>
      </Space>
    ),
  },
];

const handleDownload = (record) => {
  // Create and download VCF file
};

const MyContact = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const filteredData = dataSource.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.company.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };

      const apiUrl = "http://localhost:3001/my-contacts"; // Corrected API URL

      const res = await axios.get(apiUrl, {
        headers,
      });

      console.log("Contacts fetched successfully:", res.data);
      setContacts(res.data.contacts); // Assuming your API response has a structure like { success: true, contacts: [...] }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header style={{ background: "#FAFAFA", paddingTop: 20, height: 90 }}>
        <Title level={2} style={{ color: "black", textAlign: "center" }}>
          My contact page
        </Title>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Input
              suffix={<SearchOutlined style={{ fontSize: 22 }} />}
              placeholder="Search bar to find a person in your database"
              style={{ width: 400, borderRadius: 100 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Text>{filteredData.length} contacts Number of contacts in the database</Text>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" style={{ margin: "16px 0" }}>
          <Col>
            <Checkbox onChange={() => {}}>Select all</Checkbox> Ability to select all or only one contacts and export
            them in .csv format
          </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Content>
    </Layout>
  );
};

export default MyContact;
