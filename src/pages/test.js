import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
// ...
const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <PaginationProvider
      pagination={
        paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize
        })
      }
    >
      {
        ({
          paginationProps,
          paginationTableProps
        }) => (
          <div>
            <div>
              <p>Current Page: { paginationProps.page }</p>
              <p>Current SizePerPage: { paginationProps.sizePerPage }</p>
            </div>
            <div>
              <PaginationListStandalone
                { ...paginationProps }
              />
            </div>
            <BootstrapTable
              remote
              keyField="id"
              data={ data }
              columns={ columns }
              onTableChange={ onTableChange }
              { ...paginationTableProps }
            />
          </div>
        )
      }
    </PaginationProvider>
  </div>
);

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: products.slice(0, 10),
      sizePerPage: 10
    };
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      this.setState(() => ({
        page,
        data: products.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage
      }));
    }, 2000);
  }

  render() {
    const { data, sizePerPage, page } = this.state;
    return (
      <RemotePagination
        data={ data }
        page={ page }
        sizePerPage={ sizePerPage }
        totalSize={ products.length }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}