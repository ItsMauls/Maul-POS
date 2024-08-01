import CustomPagination from "@/components/CustomPagination";
import MainContainer from "@/components/MainContainer";
import SidebarMenu from "@/components/SidebarMenu";
import React, { useState } from "react";
import { Button, Card, Grid, Header, Table } from "semantic-ui-react";
const PurchaseRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [kurasiList, setKurasiList] = useState([]);
  const [totalPage, setTotalPage] = useState(10);
  const [totalData, setTotalData] = useState(1000);
  const [pageLimit, setPageLimit] = useState(10);

  const handlePaginationChange = (e, { activePage }) => {
    console.log(activePage);
  };

  return (
    <div>
      <SidebarMenu />
      <MainContainer>
        <Grid>
          <Card fluid>
            <Card.Content>
              <Grid.Column computer={16} mobile={16} tablet={16}>
                <Header dividing textAlign="center" size="huge" as="h1">
                  Purchase Request
                </Header>
                <Button
                  primary
                  onClick={() => {
                    console.log("click");
                  }}
                >
                  Add Purchase Request
                </Button>
                <div className="ui search" style={{ float: "right" }}>
                  <div className="ui icon input">
                    <input
                      className="prompt"
                      type="text"
                      placeholder="Search user..."
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
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Item</Table.HeaderCell>
                      <Table.HeaderCell>Qty</Table.HeaderCell>
                      <Table.HeaderCell>Supplier</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell style={{ width: "200px" }}>
                        Action
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>Betadin</Table.Cell>
                      <Table.Cell>100</Table.Cell>
                      <Table.Cell>Tempo</Table.Cell>
                      <Table.Cell>
                        <a href="mailto:test@gmail.com">test@gmail.com</a>
                      </Table.Cell>
                      <Table.Cell>
                        <Button primary>Edit</Button>
                        <Button negative>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>Betadin</Table.Cell>
                      <Table.Cell>100</Table.Cell>
                      <Table.Cell>Tempo</Table.Cell>
                      <Table.Cell>
                        <a href="mailto:test@gmail.com">test@gmail.com</a>
                      </Table.Cell>
                      <Table.Cell>
                        <Button primary>Edit</Button>
                        <Button negative>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>Betadin</Table.Cell>
                      <Table.Cell>100</Table.Cell>
                      <Table.Cell>Tempo</Table.Cell>
                      <Table.Cell>
                        <a href="mailto:test@gmail.com">test@gmail.com</a>
                      </Table.Cell>
                      <Table.Cell>
                        <Button primary>Edit</Button>
                        <Button negative>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>Betadin</Table.Cell>
                      <Table.Cell>100</Table.Cell>
                      <Table.Cell>Tempo</Table.Cell>
                      <Table.Cell>
                        <a href="mailto:test@gmail.com">test@gmail.com</a>
                      </Table.Cell>
                      <Table.Cell>
                        <Button primary>Edit</Button>
                        <Button negative>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
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

export default PurchaseRequest;
