import { Row, Col, Card, Table, Button, Avatar, Typography, Skeleton } from "antd";

import { FileAddOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

// Images
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../utils/axios";
import { useSelector } from "react-redux";

const { Title } = Typography;

// table code start
const columns = [
  {
    title: "CLIENT",
    dataIndex: "name",
    key: "name",
  },
  {
    title: <div style={{ textAlign: "center" }}>{"LIMITE DE CARTES"}</div>,
    key: "cards_limit",
    dataIndex: "cards_limit",
  },
  {
    title: "DATE DE CRÉATION",
    key: "created_at",
    dataIndex: "created_at",
  },
  {
    title: "Action",
    key: "id",
    dataIndex: "id",
  },
];

function SubAccounts() {
  const [spinner, setSpinner] = useState(true);
  const [cardsData, setCardsData] = useState([]);
  const user = useSelector((state) => state);

  const deleteAccount = async (id) => {
    try {
      setSpinner(true);
      const response = await apiPost("/auth/subaccount/delete", { id: id });
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "supprimé",
        });
        getCardsData();
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

  const getCardsData = async () => {
    try {
      setSpinner(true);
      const response = await apiGet("/auth/subaccounts");

      if (response.success) {
        const data = response.subaccounts.map((card, index) => {
          return {
            key: index,
            name: (
              <>
                <Avatar.Group>
                  <div className="avatar-info">
                    <Title level={5}>{card.name}</Title>
                    <p>{card.email}</p>
                  </div>
                </Avatar.Group>
              </>
            ),
            cards_limit: (
              <div className="author-info" style={{ textAlign: "center", margin: "auto" }}>
                <Title level={5}>{card.cards_limit}</Title>
              </div>
            ),
            created_at: <>{new Date(card.created_at).toGMTString()}</>,
            id: (
              <div className="ant-employed" style={{ gap: "10px" }}>
                {user.role === "admin" && (
                  <Button
                    onClick={() => {
                      deleteAccount(card.id);
                    }}
                  >
                    supprimer
                  </Button>
                )}
              </div>
            ),
          };
        });

        setCardsData(data);
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

  useEffect(() => {
    getCardsData();
  }, []);

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="La table des sous-comptes"
              extra={
                <NavLink to="/dashboard/subaccounts/create">
                  <Button
                    type="primary"
                    shape="round"
                    icon={<FileAddOutlined />}
                    size={"large"}
                    style={{ margin: "5px" }}
                  >
                    Ajouter
                  </Button>
                </NavLink>
              }
            >
              {spinner ? (
                <Skeleton />
              ) : (
                <div className="table-responsive">
                  <Table columns={columns} dataSource={cardsData} pagination={false} className="ant-border-space" />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default SubAccounts;
