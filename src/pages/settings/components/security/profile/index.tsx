import React, { useState } from 'react';
import { LockSlash } from 'iconsax-react';
import { useQuery } from 'react-query';
import { get_admin_query } from '../../../../../queries/dash_board';

import { useQueryClient, useMutation } from 'react-query';
import { request_password_reset_setttings } from '../../../../../api';
import { toast } from '../../../../../utils';
import { Modal } from '@mantine/core';
import { BsQuestionCircle } from 'react-icons/bs';

const Profile = () => {
  const { data: user } = useQuery(get_admin_query());
  const [opened, setOpened] = useState(false);

  const queryProvider = useQueryClient();

  const mutation = useMutation({
    mutationFn: request_password_reset_setttings,
    onSuccess: () => {
      queryProvider.invalidateQueries({ queryKey: ['reset-user'] }); // To  invalidate and refetch
      toast(
        'success',
        'Please check your mail',
        'A password reset link will be sent to you shortly'
      );
    },
  });

  return (
    <div className=' bg-white flex flex-col bg-[#ffff] w-full p-6 mtrounded'>
      <p className='text-[#000] text-[18px] font-semibold'> Profile</p>

      <div className='w-full flex justify-between items-center border-b py-3 mt-6'>
        <p>Email</p>
        <span>{user!?.email}</span>
        <LockSlash size='15' color='#8f8e91' variant='Bulk' />
      </div>

      <div className='w-full flex justify-between items-center border-b py-3 mt-6'>
        <p>Password</p>
        <span></span>

        <span
          onClick={() => {
            setOpened((s) => !s);
          }}
          className=' bg-afexpurple-lighter text-afexpurple-regular p-3 rounded-lg cursor-pointer hover:shadow text-base'>
          Reset Password
        </span>
      </div>

      <div className='w-full flex justify-between items-center py-3 mt-6'>
        <p>Role</p>
        <span>{user!?.roles[0]?.name}</span>
        <LockSlash size='15' color='#8f8e91' variant='Bulk' />
      </div>

      <Modal
        size='25%'
        withCloseButton={false}
        centered
        opened={opened}
        onClose={() => setOpened((s) => !s)}>
        {/* Map Component */}
        <div className='flex flex-col mt-0 items-center gap-4 text-center p-8'>
          <BsQuestionCircle color='#E1891C' size={70} />

          <p className='text-[14px] text-gray-400 rounded-md'>
            Are you sure you would like to reset your Password?
          </p>

          <div className='flex w-full px-10 justify-center gap-4'>
            <button
              onClick={() => {
                mutation.mutate(user!?.email);
                console.log(user?.email);
                setOpened((s) => !s);
              }}
              className='w-full bg-[#7738DD] p-4 rounded-lg text-white'>
              yes, please
            </button>
            <button
              onClick={() => {
                setOpened((s) => !s);
              }}
              className='w-full p-4 hover:shadow rounded-lg'>
              no, return
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
