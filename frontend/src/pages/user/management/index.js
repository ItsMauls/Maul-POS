import CustomPagination from "@/components/CustomPagination";
import MainContainer from "@/components/MainContainer";
import SidebarMenu from "@/components/SidebarMenu";
import RefreshToken from "@/helper/refreshToken";
import { withAuth } from "@/helper/withAuth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Header,
  Message,
  Modal,
  Tab,
  Table,
  TableHeader,
} from "semantic-ui-react";

const UserManagement = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [totalPage, setTotalPage] = useState(10);
  const [totalData, setTotalData] = useState(1000);
  const [pageLimit, setPageLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  // fetch data
  const fetchData = async (i, keyword = "") => {
    setCurrentPage(i);
    setLoading(true);

    // fetch data here
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/all?page=${i}&page_size=${pageLimit}&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (res.status === 401) {
      const error = await res.json();
      if (error.message === "TOKEN_EXPIRED") {
        const refreshToken = await RefreshToken();
        if (refreshToken) {
          return fetchData(i, keyword);
        }
      }
    }

    if (res.status === 403) {
      const error = await res.json();
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.data.message);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setTotalData(data.data.meta.total_data);
    setTotalPage(data.data.meta.total_page);
    setPages(data.data.meta.page);
    setPageLimit(data.data.meta.page_size);
    setData(data.data.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    fetchData(1, keyword);
  };

  const handlePaginationChange = (e, { activePage }) => {
    console.log(activePage);
  };

  const handleDelete = async (id) => {

    //confirm delete
    const confirm = window.confirm("Are you sure want to delete this user?");
    if (!confirm) {
      return;
    }

    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/delete?id=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (res.status === 401) {
      const error = await res.json();
      if (error.message === "TOKEN_EXPIRED") {
        const refreshToken = await RefreshToken();
        if (refreshToken) {
          return handleDelete(id);
        }
      }
    }

    if (res.status === 403) {
      const error = await res.json();
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
      return;
    }

    fetchData(currentPage);
  };

  return (
    <div>
      <SidebarMenu />
      <MainContainer>
        <Grid>
          <Card fluid>
            {error && 
            <Message negative onDismiss={()=> setError("")}>
              <Message.Header>Error</Message.Header>
              <p>{error}</p>
            </Message>
            }
            <Card.Content>
              <Grid.Column computer={16} mobile={16} tablet={16}>
                <Header dividing textAlign="center" size="huge" as="h1">
                  {" "}
                  User Management{" "}
                </Header>
                <Button
                  primary
                  onClick={() => {
                    router.push("/user/management/create");
                  }}
                >
                  Add User
                </Button>
                <div className="ui search" style={{ float: "right" }}>
                  <div className="ui icon input">
                    <input
                      className="prompt"
                      type="text"
                      placeholder="Search user..."
                      onChange={handleSearch}
                    />
                    <i className="search icon"></i>
                  </div>
                  <div className="results"></div>
                </div>
              </Grid.Column>
              <Grid.Column computer={16} mobile={16} tablet={16}>
                <Table
                  celled
                  style={{
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    marginTop: "20px",
                  }}
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>No</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Username</Table.HeaderCell>
                      <Table.HeaderCell>Phone Number</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Role</Table.HeaderCell>
                      <Table.HeaderCell style={{ width: "200px" }}>
                        Action
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Array.isArray(data) &&
                      data.map((item, index) => {
                        console.log(item);

                        return (
                          <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.username}</Table.Cell>
                            <Table.Cell>{item.phone_number}</Table.Cell>
                            <Table.Cell>
                              <a href={`mailto:${item.email}`}>{item.email}</a>
                            </Table.Cell>
                            <Table.Cell>{item.role.name}</Table.Cell>
                            <Table.Cell>
                              <Button primary>Edit</Button>
                              <Button negative
                                onClick={() => handleDelete(item.id)}
                              >Delete</Button>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column computer={16} mobile={16} tablet={16}>
                <CustomPagination
                  currentPage={currentPage}
                  pageLimit={pageLimit}
                  totalData={totalData}
                  totalPage={totalPage}
                  handlePaginationChange={handlePaginationChange}
                />
              </Grid.Column>
            </Card.Content>
          </Card>
        </Grid>
      </MainContainer>
    </div>
  );
};
export default withAuth(UserManagement);
