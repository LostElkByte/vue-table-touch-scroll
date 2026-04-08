<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
import { ElTable, ElTableColumn } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '../styles/common.css'

interface Order {
  id: string
  product: string
  quantity: number
  unitPrice: number
  amount: number
  status: string
  date: string
  warehouse: string
  logistics: string
  remark: string
}

interface Customer {
  id: number
  name: string
  company: string
  level: string
  region: string
  contact: string
  email: string
  totalOrders: number
  totalAmount: number
  orders: Order[]
}

const customers: Customer[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `客户 ${i + 1}`,
  company: ['阿里巴巴', '腾讯', '字节跳动', '美团', '京东', '百度'][i % 6],
  level: ['VIP', '金牌', '银牌', '普通'][i % 4],
  region: ['华东', '华南', '华北', '西南', '东北'][i % 5],
  contact: `联系人 ${i + 1}`,
  email: `contact${i + 1}@company.com`,
  totalOrders: 3 + (i % 5),
  totalAmount: 10000 + i * 2500,
  orders: Array.from({ length: 3 + (i % 5) }, (_, j) => ({
    id: `ORD-${String(i + 1).padStart(3, '0')}-${String(j + 1).padStart(2, '0')}`,
    product: ['笔记本电脑', '显示器', '机械键盘', '无线鼠标', '耳机', '摄像头', '路由器', '硬盘'][j % 8],
    quantity: 1 + (j % 10),
    unitPrice: [6999, 2499, 899, 299, 1599, 499, 399, 899][j % 8],
    amount: (1 + (j % 10)) * [6999, 2499, 899, 299, 1599, 499, 399, 899][j % 8],
    status: ['已发货', '待发货', '已完成', '已取消'][j % 4],
    date: `2024-${String((j % 12) + 1).padStart(2, '0')}-${String((j % 28) + 1).padStart(2, '0')}`,
    warehouse: ['上海仓', '广州仓', '北京仓', '成都仓'][j % 4],
    logistics: ['顺丰速运', '京东物流', '中通快递', '圆通速递'][j % 4],
    remark: j % 3 === 0 ? '加急处理' : j % 3 === 1 ? '正常配送' : '客户自提',
  })),
}))
</script>

<template>
  <div class="example-container">
    <h2>Nested Table（嵌套表格）</h2>
    <p class="description">
      父表和展开行内的子表均使用 v-mobile-table，验证手势仲裁：子表滑动时父表不跟随。
    </p>

    <!-- 父表 -->
    <div
      v-mobile-table="{ preset: 'element-plus' }"
      class="table-wrapper"
    >
      <el-table
        class="dark"
        :data="customers"
        height="500"
        border
        stripe
        size="small"
        row-key="id"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <!-- 子表：展开行内嵌套，同样使用 v-mobile-table -->
            <div
              v-mobile-table="{ preset: 'element-plus' }"
              style="padding: 12px 0;"
            >
              <el-table
                class="dark"
                :data="row.orders"
                border
                size="small"
                row-key="id"
              >
                <el-table-column prop="id" label="订单号" width="100" fixed="left" />
                <el-table-column prop="product" label="产品" width="140" />
                <el-table-column prop="quantity" label="数量" width="80" />
                <el-table-column prop="unitPrice" label="单价" width="100">
                  <template #default="{ row: order }">
                    ¥{{ order.unitPrice.toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" width="120">
                  <template #default="{ row: order }">
                    ¥{{ order.amount.toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column prop="warehouse" label="仓库" width="100" />
                <el-table-column prop="logistics" label="物流" width="120" />
                <el-table-column prop="remark" label="备注" width="120" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60" fixed="left" />
        <el-table-column prop="name" label="客户名" width="100" />
        <el-table-column prop="company" label="公司" width="120" />
        <el-table-column prop="level" label="等级" width="280" />
        <el-table-column prop="region" label="区域" width="80" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="email" label="邮箱" width="120" />
        <el-table-column prop="totalOrders" label="订单数" width="80" />
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
