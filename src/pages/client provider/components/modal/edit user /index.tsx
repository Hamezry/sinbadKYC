import React from 'react';
import { Drawer, Group } from '@mantine/core';
import UserInfo from './user info';

const AddUser = ({ show, close }: ModalControllerType) => {
  return (
    <>
      <Drawer
        className=' overflow-y-auto'
        position='right'
        opened={show}
        onClose={close}
        title='Add User'
        padding='xl'
        size='38%'>
        {/* Map Component */}

        <UserInfo />
      </Drawer>

      <Group position='right'></Group>
    </>
  );
};

export default AddUser;
