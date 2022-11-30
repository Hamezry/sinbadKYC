import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { Sidebar } from './components';
import bgImage from '../src/assets/svgs/bg-pattern.svg';

import {
  Authentication,
  Client,
  Dashboard,
  Transaction,
  UserManagement,
  ApiRequest,
  TrackerDashboard,
  SingleClient,
  Settings,
} from './pages';
import { useAuthCtx } from './context';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthCtx();
  const token = localStorage.getItem('cuddie-access-token');

  console.log({ isAuthenticated }, { token });

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return navigate('auth');
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);
  return (
    <div className='flex bg-white text-[#54565B] text-sm xl:text-base'>
      <Sidebar />

      <div
        className='w-[94%] bg-hero bg-[#F5F5F5]'
        style={{ backgroundImage: `url(${bgImage})` }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='auth' element={<Authentication />} />

          <Route path='client'>
            <Route index element={<Client />} />
            <Route path='single_client' element={<SingleClient />} />
          </Route>

          <Route path='transaction' element={<Transaction />} />
          <Route path='user_management' element={<UserManagement />} />
          <Route path='api_request' element={<ApiRequest />} />
          <Route path='tracker_dashboard' element={<TrackerDashboard />} />
          <Route path='settings' element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
