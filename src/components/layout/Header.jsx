import { useState, useEffect } from "react";

import { Row, Col, Breadcrumb, Badge, Dropdown, Button, List, Avatar, Input, Drawer, Typography, Switch } from "antd";

import { NavLink, Link } from "react-router-dom";
import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";

const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #1890ff;
  }
  .ant-btn-success {
    background-color: #52c41a;
  }
  .ant-btn-yellow {
    background-color: #fadb14;
  }
  .ant-btn-black {
    background-color: #262626;
    color: #fff;
    border: 0px;
    border-radius: 5px;
  }
  .ant-switch-active {
    background-color: #1890ff;
  }
`;

const toggler = [
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" key={0}>
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

function Header({ placement, name, subName, onPress, handleSidenavColor, handleSidenavType, handleFixedNavbar }) {
  // const { Title, Text } = Typography;

  // const [visible, setVisible] = useState(false);
  // const [sidenavType, setSidenavType] = useState("transparent");

  useEffect(() => window.scrollTo(0, 0));

  // const showDrawer = () => setVisible(true);
  // const hideDrawer = () => setVisible(false);

  return (
    <>
      {/* <div className="setting-drwer" onClick={showDrawer}>
        {setting}
      </div> */}
      <Row gutter={[24, 0]}>
        {/* <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item key={"/"}>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }} key={name}>
              {name}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span className="ant-page-header-heading-title" style={{ textTransform: "capitalize" }}>
              {subName.replace("/", "")}
            </span>
          </div>
        </Col> */}

        <Col span={24} md={18} className="header-control">
          <Button type="link" className="sidebar-toggler" onClick={() => onPress()}>
            {toggler}
          </Button>

          <Link to="/log-out" className="btn-sign-in">
            <LogoutOutlined />
          </Link>
          {/* <Input className="header-search" placeholder="Type here..." prefix={<SearchOutlined />} /> */}
        </Col>
      </Row>
    </>
  );
}

export default Header;
