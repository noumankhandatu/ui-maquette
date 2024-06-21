import React, { useEffect, useState } from "react";
import { SearchOutlined, DownloadOutlined, PhoneOutlined, MailOutlined, ExportOutlined } from "@ant-design/icons";
import { Table, Input, Button, Typography, Checkbox, Space, Layout, Tooltip, Row, Col } from "antd";
import QRCode from "react-qr-code";
import { apiGet } from "../utils/axios"; // Adjusted to import apiGet only

const { Title, Text } = Typography;
const { Header, Content } = Layout;

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
      <Button type="link" icon={<PhoneOutlined />} onClick={() => (window.location.href = `tel:${text}`)}>
        {text}
      </Button>
    ),
  },
  {
    title: "Email",
    dataIndex: "emailAddress",
    key: "emailAddress",
    render: (text) => (
      <Button type="link" icon={<MailOutlined />} onClick={() => (window.location.href = `mailto:${text}`)}>
        {text}
      </Button>
    ),
  },
  // {
  //   title: "Rencontre",
  //   dataIndex: "date",
  //   key: "date",
  // },
  // {
  //   title: "Notes",
  //   dataIndex: "notes",
  //   key: "notes",
  //   render: (text) => <Text>{text}</Text>,
  // },
  // {
  //   title: "Ajouter",
  //   key: "action",
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <Tooltip title="QR Code">
  //         <QRCode value={record.emailAddress} size={32} />
  //       </Tooltip>
  //     </Space>
  //   ),
  // },
];

const MyContact = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
      <Header style={{ background: "#FAFAFA", paddingTop: 20, height: 90 }}>
        <Title level={2} style={{ color: "#008037", textAlign: "center" }}>
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
            <Text>{filteredData.length} contacts found in the database</Text>
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
              Select all
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
      </Content>
    </Layout>
  );
};

export default MyContact;
