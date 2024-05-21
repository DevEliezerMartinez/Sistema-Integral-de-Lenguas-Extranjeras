import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

import Headeer from '../../components/Estudiantes/Header'
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Cursos archivados', '1', <PieChartOutlined />),
  getItem('Cursos disponibles', '2', <DesktopOutlined />),
  getItem('Modulo actual', '3', <DesktopOutlined />),
 
 
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (

    <>
    <Headeer/>
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      
    </Layout>

    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full shadow-lg">
      <div className="flex justify-around items-center h-16 px-4">
        <button className="flex flex-col items-center text-white focus:text-blue-200">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2 4 4 4-4 4 4 4-4 2 2" />
          </svg>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-white focus:text-blue-200">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5A7 7 0 105 10a7 7 0 0012 0z" />
          </svg>
          <span className="text-xs">Search</span>
        </button>
        <button className="flex flex-col items-center text-white focus:text-blue-200">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 19.121A5 5 0 0116.243 7.88M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs">Profile</span>
        </button>
        <button className="flex flex-col items-center text-white focus:text-blue-200">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
    </>
  );
};
export default App;