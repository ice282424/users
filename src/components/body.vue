<template>
  <div class="body-container">
    <div class="main-layout">
      <div>
        <router-view />
        <div class="tree-filter-container">
          <el-input
            v-model="treeSearchValue"
            placeholder="搜索部门名称"
            :prefix-icon="Search"
            clearable
            class="tree-search-input"
            @input="handleTreeSearch"
            style="width: 360px"
          ></el-input>
          <el-tree
            :data="filteredDepartmentTree"
            :props="treeProps"
            :default-expanded-keys="expandedKeys"
            :highlight-current="true"
            :current-node-key="activeDeptId"
            node-key="value"
            @node-click="handleDeptNodeClick"
            class="dept-tree"
          ></el-tree>
        </div>
        <div class="chart-container">
          <div id="deptChart" style="width: 100%; height: 300px"></div>
        </div>
      </div>
      <div class="list-content">
        <div class="action-buttons">
          <el-button type="primary" @click="goToCreateUser">
            <el-icon><Plus /></el-icon>
            新建用户
          </el-button>
          <el-button type="info" :disabled="selectedUsers.length === 0" @click="batchDelete">
            批量删除
          </el-button>
          <div class="search-area">
            <el-input
              v-model="searchValue"
              placeholder="请输入关键词"
              :prefix-icon="Search"
              clearable
              class="composite-input"
              @keyup.enter="search"
            >
              <template #prepend>
                <el-select v-model="searchType" placeholder="分类搜索" class="prepend-select">
                  <el-option label="姓名" value="name"></el-option>
                  <el-option label="账号" value="account"></el-option>
                  <el-option label="邮箱" value="email"></el-option>
                  <el-option label="手机号" value="phone"></el-option>
                </el-select>
              </template>
            </el-input>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </div>
        </div>

        <el-table
          :data="paginatedUsers"
          border
          stripe
          style="width: 100%"
          height="435px"
          :header-cell-style="{
            'background-color': '#fff',
            position: 'sticky',
            top: '0',
            'z-index': 1,
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="60" align="center">
            <template #default="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
          <el-table-column label="部门" show-overflow-tooltip>
            <template #default="scope">
              {{ getDisplayDeptName(scope.row.department) }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机" show-overflow-tooltip></el-table-column>
          <el-table-column prop="password" label="密码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" align="left">
            <template #default="scope">
              <span :class="scope.row.status === '启用' ? 'status-active' : 'status-disabled'">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" link @click="editUser(scope.row)">编辑</el-button>
              <el-button type="primary" link @click="deleteUser(scope.row.id)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="filteredUsers.length === 0" class="empty-state">
          <el-empty description="暂无用户数据"></el-empty>
        </div>

        <div class="pagination-container" v-else>
          <div class="total-count">Total {{ filteredUsers.length }} items</div>
          <Pagination
            :total="filteredUsers.length"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :disabled="filteredUsers.length === 0"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Plus, Search, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '../components/pagination.vue'
import * as echarts from 'echarts'

import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const treeSearchValue = ref('')
const originalDepartmentTree = ref([
  { value: 'all', label: '全部部门', isRoot: true, children: [...userStore.departmentOptions] },
])
const filteredDepartmentTree = ref([...originalDepartmentTree.value])
const expandedKeys = ref(['all'])
const treeProps = ref({ label: 'label', children: 'children', value: 'value' })
const deptFullMap = ref({})
const activeDeptId = ref('all')
const filteredUsers = ref([])
const searchType = ref('name')
const searchValue = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedUsers = ref([])
const cachedPageData = ref({})
let removeRouteHook = null
let deptChartInstance = null

const handleTreeSearch = () => {
  const keyword = treeSearchValue.value.trim().toLowerCase()
  const expandKeys = []
  if (!keyword) {
    filteredDepartmentTree.value = JSON.parse(JSON.stringify(originalDepartmentTree.value))
    expandedKeys.value = []
    return
  }
  const treeCopy = JSON.parse(JSON.stringify(originalDepartmentTree.value))
  const filterTree = (nodes, parentKeys = []) => {
    return nodes.filter((node) => {
      const isMatch = node.label.toLowerCase().includes(keyword)
      const currentKeys = [...parentKeys, node.value]
      if (node.children?.length) node.children = filterTree(node.children, currentKeys)
      const keep = isMatch || node.children?.length > 0
      if (keep) expandKeys.push(...currentKeys)
      return keep
    })
  }
  filteredDepartmentTree.value = filterTree(treeCopy)
  expandedKeys.value = [...new Set(expandKeys)]
}

const initDeptMap = (treeData) => {
  const traverse = (node, parentIds = [], parentPath = '', level = 0) => {
    let fullPath = node.label
    if (level > 1) fullPath = `${parentPath}-${node.label}`
    deptFullMap.value[node.value] = {
      name: node.label,
      fullPath,
      parentIds,
      hasChildren: !!node.children?.length,
      level,
    }
    node.children?.forEach((child) =>
      traverse(child, [...parentIds, node.value], fullPath, level + 1),
    )
  }
  treeData.forEach((root) => traverse(root))
}

const collectAllNodeKeys = (nodes) => {
  let keys = []
  nodes.forEach((node) => {
    keys.push(node.value)
    if (node.children?.length) keys = keys.concat(collectAllNodeKeys(node.children))
  })
  return keys
}

const getTargetDeptIds = (deptValue) => {
  if (deptValue === 'all') {
    return Object.keys(deptFullMap.value).filter((key) => key !== 'all')
  }
  if (!deptFullMap.value[deptValue]) {
    ElMessage.error(`未找到部门:${deptValue}`)
    return []
  }
  return Object.entries(deptFullMap.value)
    .filter(([id, info]) => id === deptValue || info.parentIds.includes(deptValue))
    .map(([id]) => id)
    .filter(Boolean)
}

const applyDeptFilter = (users) => {
  if (activeDeptId.value === 'all') {
    filteredUsers.value = [...users]
    return
  }
  const targetDeptIds = getTargetDeptIds(activeDeptId.value)
  filteredUsers.value = users.filter((user) => targetDeptIds.includes(user.department))
}

const getDisplayDeptName = (deptName) => {
  if (!deptName) return ''
  const deptItem = Object.values(deptFullMap.value).find((item) => item.name === deptName)
  return deptItem?.fullPath || deptName
}

const getDeptUserCount = () => {
  const countMap = {}
  userStore.users.forEach((user) => {
    const dept = user.department
    if (dept) countMap[dept] = (countMap[dept] || 0) + 1
  })
  return Object.entries(countMap).map(([name, value]) => ({ name, value }))
}

//统计总人数
const getTotalUserCount = () => {
  return userStore.users.length
}

const initDeptChart = () => {
  const chartDom = document.getElementById('deptChart')
  if (!chartDom) return

  deptChartInstance = echarts.init(chartDom)

  const totalCount = getTotalUserCount()
  const deptData = getDeptUserCount()
  const truncatedNames = new Map()

  const truncateText = (name) => {
    const maxLength = 8
    if (name.length > maxLength) {
      const truncated = name.slice(0, maxLength) + '...'
      truncatedNames.set(truncated, name)
      return truncated
    }
    return name
  }

  const option = {
    title: {
      text: `总计:${totalCount}人`,
      left: '20%',
      top: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 人',
    },
    legend: {
      right: '0%',
      top: 'center',
      orient: 'vertical',
      textStyle: {
        fontSize: 12,
        width: 80,
        overflow: 'ellipsis',
      },
      itemWidth: 20,
      itemHeight: 12,
      formatter: truncateText,
      tooltip: {
        show: (params) => {
          return truncatedNames.has(params.name)
        },
        trigger: 'item',
        formatter: (params) => {
          return truncatedNames.get(params.name) || params.name
        },
        position: (pos) => [pos[0], pos[1] - 30],
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 12 },
        padding: [6, 10],
        borderRadius: 4,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
        transitionDuration: 0,
      },
    },
    series: [
      {
        name: '部门人数统计',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['30%', '50%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        emphasis: { label: { show: false } },
        sort: null,
        data: deptData,
      },
    ],
  }

  deptChartInstance.setOption(option)
  window.addEventListener('resize', () => deptChartInstance?.resize())
}

const updateDeptChart = () => {
  if (!deptChartInstance) return
  const totalCount = getTotalUserCount()
  deptChartInstance.setOption({
    title: {
      text: `总计:${totalCount}人`,
    },
    series: [{ data: getDeptUserCount() }],
    sort: null,
  })
}

const refreshUserData = () => {
  try {
    const allUsers = [...userStore.users]
    applyDeptFilter(allUsers)
    cachedPageData.value = {}
    search()
    updateDeptChart()
  } catch (err) {
    ElMessage.error('加载失败，请刷新重试')
    console.error('数据加载错误:', err)
  }
}

const handleDeptNodeClick = (data) => {
  activeDeptId.value = data.value
  const allUsers = [...userStore.users]
  applyDeptFilter(allUsers)
  search()
  currentPage.value = 1
  cachedPageData.value = {}
}

const search = () => {
  const keyword = searchValue.value.trim().toLowerCase()
  let filtered = [...filteredUsers.value]
  if (keyword) {
    filtered = filtered.filter((user) => {
      const val = user[searchType.value]
      return val && String(val).toLowerCase().includes(keyword)
    })
  }
  filteredUsers.value = filtered
  if (!filtered.length) ElMessage.info(`未找到符合条件的用户`)
  currentPage.value = 1
  cachedPageData.value = {}
}

const resetSearch = () => {
  searchType.value = 'name'
  searchValue.value = ''
  activeDeptId.value = 'all'
  applyDeptFilter([...userStore.users])
  currentPage.value = 1
  cachedPageData.value = {}
  updateDeptChart()
}

const paginatedUsers = computed(() => {
  const key = `${currentPage.value}-${pageSize.value}`
  if (cachedPageData.value[key]?.timestamp === getUsersTimestamp()) {
    return cachedPageData.value[key].data
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  const data = filteredUsers.value.slice(start, end)
  cachedPageData.value[key] = { data, timestamp: getUsersTimestamp() }
  return data
})

const getUsersTimestamp = () => JSON.stringify(userStore.users)

const editUser = (user) => {
  router.push({ path: '/edit-user', query: { id: user.id } })
}

const deleteUser = (id) => {
  const user = userStore.getUserById(id)
  if (!user) {
    ElMessage.error('用户不存在或已被删除')
    return
  }
  ElMessageBox.confirm(`确定要删除用户【${user.name}】吗？`, '确认删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    icon: Delete,
  })
    .then(() => {
      try {
        userStore.deleteUserById(id)
        filteredUsers.value = filteredUsers.value.filter((u) => u.id !== id)
        adjustPaginationAfterDelete()
        ElMessage.success(`用户【${user.name}】已删除`)
        updateDeptChart()
      } catch (err) {
        ElMessage.error('删除失败，请重试')
        console.error('删除错误:', err)
      }
    })
    .catch(() => ElMessage.info('已取消删除'))
}

const batchDelete = () => {
  if (!selectedUsers.value.length) return
  const names = selectedUsers.value.map((u) => u.name).join('、')
  const count = selectedUsers.value.length
  ElMessageBox.confirm(`确定要删除选中的【${names}】等${count}个用户吗？`, '批量删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    icon: Delete,
  })
    .then(() => {
      try {
        const ids = selectedUsers.value.map((u) => u.id)
        userStore.batchDeleteUsers(ids)
        filteredUsers.value = filteredUsers.value.filter((u) => !ids.includes(u.id))
        adjustPaginationAfterDelete()
        selectedUsers.value = []
        ElMessage.success(`已成功删除${count}个用户`)
        updateDeptChart()
      } catch (err) {
        ElMessage.error('批量删除失败，请重试')
        console.error('批量删除错误:', err)
      }
    })
    .catch(() => ElMessage.info('已取消批量删除'))
}

const adjustPaginationAfterDelete = () => {
  if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
  cachedPageData.value = {}
}

const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  cachedPageData.value = {}
}

const handleCurrentPageChange = (page) => {
  currentPage.value = page
}

const goToCreateUser = () => {
  router.push('/create-user')
}

onMounted(async () => {
  initDeptMap(originalDepartmentTree.value)
  if (userStore.initUsers instanceof Function) {
    // userStore.initUsers()
    await userStore.initUsers()
  }
  const allDeptKeys = collectAllNodeKeys(originalDepartmentTree.value)
  expandedKeys.value = allDeptKeys
  await nextTick()
  refreshUserData()
  initDeptChart()

  removeRouteHook = router.afterEach((_to, from) => {
    if (from.path === '/edit-user' || from.path === '/create-user') {
      refreshUserData()
      updateDeptChart()
    }
  })

  watch(
    () => route.query.update,
    (flag) => {
      if (flag === '1') {
        refreshUserData()
        router.replace({ query: {} })
        updateDeptChart()
      }
    },
  )
})

onUnmounted(() => {
  if (removeRouteHook) removeRouteHook()
  if (deptChartInstance) {
    deptChartInstance.dispose()
    deptChartInstance = null
  }
  window.removeEventListener('resize', () => deptChartInstance?.resize())
})
</script>

<style scoped>
.body-container {
  box-sizing: border-box;
  max-height: 100vh;
  padding: 10px;
  overflow: hidden;
}

.main-layout {
  display: flex;
  gap: 15px;
  overflow: hidden;
}

.tree-filter-container {
  width: 360px;
  height: 200px;
  background-color: #fafafa;
  border-radius: 4px;
  padding: 15px;
  overflow-y: auto;
  flex-shrink: 0;
}

.chart-container {
  width: 360px;
  height: 300px;
  margin-top: 15px;
}

.tree-search-input {
  margin-bottom: 12px;
}

.dept-tree {
  --el-tree-node-content-hover-bg-color: #f0f9ff;
  --el-tree-node-selected-bg-color: #e6f7ff;
  --el-tree-node-indent: 18px;
}

:deep(.el-tree-node__expand-icon) {
  font-size: 14px;
  color: #666;
}

:deep(.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label) {
  color: #1890ff;
  font-weight: 500;
}

:deep(.el-tree-node__children .el-tree-node__label) {
  color: #444;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #fafafa;
  border-radius: 4px;
}

.search-area {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.pagination-container {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.total-count {
  color: #606666;
  font-size: 14px;
}

.status-active {
  color: #10b981;
  font-weight: 500;
}
.status-disabled {
  color: #ef4444;
  font-weight: 500;
}

.el-select {
  width: 90px;
}
.el-input {
  width: 260px;
}

.empty-state {
  margin: 50px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .search-area {
    margin-left: 0;
    width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
