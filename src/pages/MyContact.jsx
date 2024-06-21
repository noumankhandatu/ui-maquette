import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  ExportOutlined,
  HomeOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Table, Input, Button, Typography, Checkbox, Space, Layout, Tooltip, Row, Col, Menu } from "antd";
import QRCode from "react-qr-code";
import { apiGet } from "../utils/axios"; // Adjusted to import apiGet only
import moment from "moment";
import "moment/locale/fr"; // Import French locale
moment.locale("fr");
const { Title, Text } = Typography;
const { Header, Content } = Layout;
import VCard from "vcard-creator";
import { Link } from "react-router-dom";

const handleDownloadVCF = (record) => {
  let [firstname, ...lastname] = record.firstName.split(" ");
  const myVCard = new VCard();
  myVCard
    // add personal data
    // .addName(values.name)
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
    render: (text) => <Text>{text}</Text>,
  },
  {
    title: "Ajouter",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        {/* <Button type="primary" shape="round" icon={<DownloadOutlined />} size={"small"}></Button> */}
        <Tooltip title="Download VCF">
          <DownloadOutlined
            style={{ fontSize: 20 }}
            onClick={() => handleDownloadVCF(record)}
            value={record.emailAddress}
          />
        </Tooltip>
        <Tooltip title="Add Note">
          <PlusOutlined style={{ fontSize: 20 }} value={record.emailAddress} />
        </Tooltip>
        <Tooltip title="QR Code">
          <QRCode style={{ fontSize: 20 }} value={record.emailAddress} size={30} />
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
          date: moment(contact.created_at).format("LL"), // Assuming you have a date field
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
          {/* <Col>
            <Text>{filteredData.length} contacts found in the database</Text>
          </Col> */}
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
              Tout selectionner
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
