import { Row, Col, Card, Table, Button, Avatar, Typography, Skeleton, Flex } from "antd";

import { FileAddOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale
moment.locale('fr');

// Images
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../utils/axios";

const { Title } = Typography;

// table code start
const columns = [
  {
    title: "CLIENT",
    dataIndex: "name",
    key: "name",
    width: "32%",
  },
  {
    title: "ABONNEMENT",
    dataIndex: "subscription",
    key: "subscription",
  },
  {
    title: "STATUT",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "VISITEURS",
    key: "view_count",
    dataIndex: "view_count",
  },
  {
    title: "DATE DE CRÉATION",
    key: "created_at",
    dataIndex: "created_at"
  },
  {
    title: "Action",
    key: "id",
    dataIndex: "id",
  },
];

function Cards() {
  const [spinner, setSpinner] = useState(true);
  const [cardsData, setCardsData] = useState([]);
  const user = useSelector((state) => state);

  const getStatus = (status) => {
    if (status == "requested") {
      return "active";
    } else if (status == "created") {
      return "créé";
    } else if (status == "disabled") {
      return "désactivé";
    }
  };

  const changeStatus = async (id) => {
    try {
      setSpinner(true);
      const response = await apiPost("/auth/card/update-status", { id: id });
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Demandé pour l'impression",
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

  const disableStatus = async (id) => {
    try {
      setSpinner(true);
      const response = await apiPost("/auth/card/disable", { id: id });
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "désactivé",
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
      const response = await apiGet("/auth/cards");

      if (response.success) {
        if (user.role == "customer" || user.role == "subaccount") {
          response.cards = response.cards.filter((card) => card.customer_id == user.id);
        }
        const data = response.cards.map((card, index) => {
          return {
            key: index,
            name: (
              <>
                <Avatar.Group>
                  <Avatar className="shape-avatar" shape="square" size={40} src={card.profile_pic}></Avatar>
                  <div className="avatar-info">
                    <Title level={5}>{card.name}</Title>
                    <p>{card.email}</p>
                  </div>
                </Avatar.Group>
              </>
            ),
            subscription:
              card.subscription !== "null" ? (
                <>
                  <div className="author-info">
                    <Title level={5}>Offre {card.subscription}</Title>
                  </div>
                </>
              ) : (
                <></>
              ),

            status: (
              <Button type="primary" className="tag-primary">
                {getStatus(card.status)}
              </Button>
            ),
            view_count: (
              <div className="author-info" style={{ textAlign: "center", margin: "auto" }}>
                <Title level={5}>{card.view_count}</Title>
              </div>
            ),
            created_at: `${new Intl.DateTimeFormat('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(card.created_at))}`,
            id: (
              <div className="ant-employed" style={{ gap: "10px" }}>
                <NavLink to={`/dashboard/cards/new/${card.id}`}>Éditer</NavLink>
                <NavLink to={encodeURI(`${import.meta.env.VITE_WEB_URL}/cards/view?${card.id}`)} target="_blank">
                  <Button>Voir</Button>
                </NavLink>
                <Button
                  onClick={() => {
                    changeStatus(card.id);
                  }}
                  disabled={card.status == "requested"}
                >
                  Envoyer à l'impression
                </Button>
                {user.role === "admin" && (
                  <Button
                    onClick={() => {
                      disableStatus(card.id);
                    }}
                    disabled={card.status == "disabled"}
                  >
                    Désactiver la carte
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
              title="Tableau des cartes"
              extra={
                user.role === "admin" ||
                user.role === "subaccount" ||
                cardsData.length === 0 ||
                (user.role === "customer" && user.offer === 1) ? (
                  <>
                    <NavLink to="/dashboard/cards/new">
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

                    <Flex vertical style={{ alignItems: "center" }}>
                      <Button
                        href={`mailto:contact@wefast.fr?subject=demande d'impression par ${user.email}`}
                        type="primary"
                        shape="round"
                        size={"large"}
                        style={{ margin: "5px" }}
                      >
                        Envoyer ma conception à l'impression
                      </Button>
                      <Typography.Text type="warning">8,5 cm * 5,4 cm. Formats acceptés : ai ou pdf.</Typography.Text>
                    </Flex>
                  </>
                ) : (
                  <Flex vertical style={{ alignItems: "center" }}>
                    <Button
                      href={`mailto:contact@wefast.fr?subject=demande d'impression par ${user.email}`}
                      type="primary"
                      shape="round"
                      size={"large"}
                      style={{ margin: "5px" }}
                    >
                      Envoyer ma conception à l'impression
                    </Button>
                    <Typography.Text type="warning">8,5 cm * 5,4 cm. Formats acceptés : ai ou pdf.</Typography.Text>
                  </Flex>
                )
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

export default Cards;
