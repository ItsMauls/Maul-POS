import { Grid, Pagination } from "semantic-ui-react";

const CustomPagination = ({
  currentPage,
  pageLimit,
  totalData,
  totalPage,
  handlePaginationChange,
}) => {
  return (
    <Grid style={{ marginTop: "20px" }}>
      <Grid.Row columns={2}>
        <Grid.Column>
          View {(currentPage - 1) * pageLimit + 1}-
          {(currentPage - 1) * pageLimit + pageLimit > totalData
            ? totalData
            : (currentPage - 1) * pageLimit + pageLimit}{" "}
          from {totalData} data
        </Grid.Column>
        <Grid.Column>
          <Pagination
            boundaryRange={0}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={2}
            floated="right"
            defaultActivePage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePaginationChange}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CustomPagination;
