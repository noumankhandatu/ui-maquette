import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";
// import Footer from "./Footer";

const { Header: AntHeader, Content, Sider } = Layout;

function Main() {
  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  let { pathname } = useLocation();
  const parentName = pathname.split("/")[1];
  pathname = pathname.replace("/dashboard/", "");

  return (
    <Layout className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""} `}>
      {/* Mobile version */}
      <Drawer
        title={false}
        placement={"left"}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        key={"left"}
        width={250}
        className={`drawer-sidebar `}
      >
        <Layout className={`layout-dashboard `}>
          <Sider
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""}`}
            style={{ background: sidenavType }}
          >
            <Sidenav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>

      {/* Laptop version */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""}`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider>

      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                onPress={openDrawer}
                name={parentName}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
            <Header
              onPress={openDrawer}
              name={parentName}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}

        <Content className="content-ant">
          <Outlet />
        </Content>

        {/* <Footer /> */}
      </Layout>
    </Layout>
  );
}

export default Main;
