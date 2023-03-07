// import { useApiTokenCtx } from '../../../../../../context';

import { shortDateFormatter } from '../../../../../../utils';
import DataGrid from '../../../../../../components/data-grid';
import { useQuery } from 'react-query';
import { get_tokens_query } from '../../../../../../queries/api_tokens';
import { Navigate, useLocation } from 'react-router-dom';
import UserAction from '../drop down';
import { Skeleton } from '@mantine/core';
const Table = () => {
  // const { list } = useApiTokenCtx();
  // console.log(list);
  const { pathname } = useLocation();
  const providerId = pathname.split('/')[3];
  const {
    data: list,
    isError,
    isLoading,
  } = useQuery(get_tokens_query(parseInt(providerId, 10)));
  if (isLoading)
    return (
      <Skeleton
        height={500}
        style={{
          borderRadius: '25px',
        }}
      />
    );
  if (isError) return <Navigate to='/login' />;

  // console.log(list, 'apis');
  const ActionComponent = ({ data }: { data: ClientProviderToken }) => (
    <UserAction data={data} />
  );

  return (
    <>
      <div className='bg-white p-3'>
        <DataGrid
          title='Search'
          rows={10}
          dateFilter={{ enabled: true, label: '', accessor: 'createdAt' }}
          data={list!}
          headerFilter={[{ name: 'Status' }]}
          headers={[
            {
              accessor: 'createdAt',
              hidden: false,
              name: 'Date Created',
              sortable: true,
              static: false,
              row: (val) => <span>{shortDateFormatter(val)} </span>,
            },

            {
              accessor: 'apiKey',
              hidden: false,
              name: 'API Key',
              sortable: true,
              static: true,
            },
            {
              accessor: 'noOfRequests',
              hidden: false,
              name: 'No of Requests',
              sortable: true,
              static: false,
            },

            {
              accessor: 'lastUsedAt',
              hidden: false,
              name: 'Last Used',
              sortable: true,
              static: false,
            },

            {
              accessor: 'isActive',
              hidden: false,
              name: 'Status',
              sortable: true,
              static: false,

              row: (val) => {
                if (val === 'Active') {
                  return (
                    <span className=' bg-afexgreen-extralight text-afexgreen-darker rounded-lg p-2'>
                      {val}
                    </span>
                  );
                } else {
                  return (
                    <span className=' bg-afexred-extralight text-afexred-dark rounded-lg p-2'>
                      {val}
                    </span>
                  );
                }
              },
            },
          ]}
          withExport
          withGlobalFilters
          withCheck // enable checkbox
          withActions // enable action column
          ActionComponent={ActionComponent} // action component
          // withNavigation // enable row navigation
          // navigationProps={{ baseRoute: '', accessor: 'id' }} // define navigation
        />
      </div>
    </>
  );
};

export default Table;
