const { Grid } = require("semantic-ui-react");

const MainContainer = ({ children, type = "normal", marginTop = "40px" , marginLeft = "0px", marginRight = "0px"}) => {
    console.log(type);
    return (
    <Grid style={{ 
      marginTop: marginTop,
      marginLeft: marginLeft,
      marginRight: marginRight
      }}>
      <Grid.Column
        computer={type === "normal" ? 2 : type === "wide" ? 1 : 0}
        only="computer"
      ></Grid.Column>
      <Grid.Column
        computer={type === "normal" ? 13 : type === "wide" ? 14 : 16}
        mobile={16}
        tablet={16}
      >
        {children}
      </Grid.Column>
      <Grid.Column
        computer={type === "normal" ? 1 : type === "wide" ? 1 : 0}
        only="computer"
      ></Grid.Column>
    </Grid>
  );
};

export default MainContainer;
