import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
// import logo from "../../assets/images/logo.png";
import { useSelector } from "react-redux";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/dashboard/", "");
  const user = useSelector((state) => state);

  const dashboard = [
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" key={0}>
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  return (
    <>
      <div className="brand" style={{ textAlign: "center" }}>
        <img src={"/logo.jpeg"} alt="" />
        {/* <span style={{ color: "#008037", fontWeight: "bold" }}>WeFast</span> */}
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/dashboard/cards">
            <span
              className="icon"
              style={{
                background: page === "cards" ? color : "",
              }}
            >
              {dashboard}
            </span>
            <span className="label">Cartes</span>
          </NavLink>
        </Menu.Item>
        {user.role === "admin" && (
          <Menu.Item key="2">
            <NavLink to="/dashboard/subaccounts">
              <span
                className="icon"
                style={{
                  background: page === "subaccount" ? color : "",
                }}
              >
                {dashboard}
              </span>
              <span className="label">Sous-comptes</span>
            </NavLink>
          </Menu.Item>
        )}
      </Menu>
    </>
  );
}

export default Sidenav;
