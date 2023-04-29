import { Location } from 'iconsax-react';
import React from 'react';
import { useState } from 'react';

import { Drawer, Group, Tooltip } from '@mantine/core';

// import NigerianMap from './map';
import HeatMap from '../heat_map';
// import AllTransactions from './allTransactions';
import List from './list';

function RightModal() {
  const [opened, setOpened] = useState(false);
  // const [showList, setShowList] = useState(true);
  // const [showAllTransactions, setShowAllTransactions] = useState(false);
  // const [showTitle, setShowTitle] = useState(false);
  // const allLocation = 'Locations Management';
  // const byLocation = 'Transactions by Locations';
  return (
    <>
      <Drawer
        position='right'
        opened={opened}
        onClose={() => setOpened(false)}
        title='Transactions by Locations'
        padding='xl'
        size='50%'
        className='flex overflow-y-auto flex-col gap-5 font-normal'>
        {/* Map Component */}
        {/* <button
          className='absolute left-[4%] top-[1.5%] bg-afexpurple-lighter text-afexpurple-regular hover:bg-afexpurple-lighter p-3 font-normal max-w-md rounded-lg'
          onClick={() => {
            setShowList((o) => !o);
            setShowAllTransactions((o) => !o);
            setShowTitle((o) => !o);
          }}
        >
          Transactions by Location
          {showTitle ? 'Transactions by Location' : 'Locations Management'}
        </button> */}
        {/* <NigerianMap /> */}
        <div className='relative'>
          {/* {showList && <p className='absolute top-[-8%]'>{byLocation}</p>} */}
          {/* {showList && <HeatMap />} */}
          {/* {showList && <List />} */}
          {/* {showAllTransactions && <AllTransactions />} */}
          {/* <p className='absolute top-[-8%]'>Transactions by Locations</p> */}

          <HeatMap />
          <List />
        </div>
      </Drawer>

      <Group position='center'>
        <Tooltip label='Transaction by Location' className='p-3'>
          <button
            onClick={() => setOpened(true)}
            className='flex w-full items-center gap-2 py-2 px-3 hover:bg-afexpurple-regular hover:shadow text-white text-[14px] bg-afexpurple-regular rounded-lg'>
            <Location size='25' color='#FFFFFF' variant='Bold' />
          </button>
        </Tooltip>
      </Group>
    </>
  );
}
export default RightModal;
