import MainContainer from "@/components/MainContainer";
import SidebarMenu from "@/components/SidebarMenu";
import { withAuth } from "@/helper/withAuth";
import React from "react";
import { Divider, Grid, Header, Image, Label, Table } from "semantic-ui-react";

const Index = () => {
  return (
    <div>
      <MainContainer>
        <Grid padded>
          <SidebarMenu />
          <Grid.Column
            computer={16}
            mobile={16}
            tablet={16}
            style={{
              minHeight: "900px",
              marginLeft: "4px",
              marginRight: "4px",
            }}
          >
            <Grid padded>
              <Grid.Row>
                <Header dividing size="huge" as="h1">
                  Dashboard 
                </Header>
              </Grid.Row>
              <Divider section hidden />
            </Grid>
          </Grid.Column>
        </Grid>
      </MainContainer>
    </div>
  );
};

export default withAuth(Index);
