<template>
  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="localCurrentPage"
      v-model:page-size="localPageSize"
      :page-sizes="[5, 10, 20, 30]"
      :size="props.size"
      :disabled="props.disabled"
      layout="sizes, prev, pager, next, jumper"
      :total="props.total"
      :locale="paginationLocale"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, toRefs } from 'vue'
import type { ComponentSize } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const props = defineProps<{
  total: number
  currentPage: number
  pageSize: number
  size?: ComponentSize
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', val: number): void
  (e: 'update:pageSize', val: number): void
}>()

const paginationLocale = {
  ...zhCn,
  el: {
    ...zhCn.el,
    pagination: {
      ...zhCn.el.pagination,
      goto: '跳至',
      sizes: '条/页',
    },
  },
}

const { currentPage: propCurrentPage, pageSize: propPageSize } = toRefs(props)
const localCurrentPage = ref(propCurrentPage.value)
const localPageSize = ref(propPageSize.value)

watch(
  [propCurrentPage, propPageSize],
  ([newCurrentPage, newPageSize]) => {
    localCurrentPage.value = newCurrentPage
    localPageSize.value = newPageSize
  },
  { immediate: true },
)

const handleSizeChange = (newSize: number) => {
  localPageSize.value = newSize
  emit('update:pageSize', newSize)
  if (localCurrentPage.value !== 1) {
    localCurrentPage.value = 1
    emit('update:currentPage', 1)
  }
}

const handleCurrentChange = (newPage: number) => {
  localCurrentPage.value = newPage
  emit('update:currentPage', newPage)
}
</script>

<style scoped>
.demo-pagination-block {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 0;
}
</style>
