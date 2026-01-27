import React from "react";
import { Tabs } from "antd";
import Dashboard from "./Dashboard";
import ProductManager from "./ProductManager";
import OrderManager from "./OrderManager";

const { TabPane } = Tabs;

const Bt2Page: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Dashboard" key="1">
        <Dashboard />
      </TabPane>

      <TabPane tab="Quản lý sản phẩm" key="2">
        <ProductManager />
      </TabPane>

      <TabPane tab="Quản lý đơn hàng" key="3">
        <OrderManager />
      </TabPane>
    </Tabs>
  );
};

export default Bt2Page;
