<template>
  <div class="edit-user-container">
    <h2 class="page-title">编辑用户</h2>

    <el-button @click="goBack" class="back-btn">返回</el-button>

    <div class="form-wrapper">
      <el-form :model="userForm" :rules="rules" ref="formRef" label-width="120px" class="edit-form">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="邮件" prop="email">
          <el-input v-model="userForm.email" clearable placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="phone">
          <el-input v-model="userForm.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="账户" prop="account">
          <el-input v-model="userForm.account" clearable placeholder="请输入账户"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="department">
          <el-cascader
            v-model="userForm.department"
            :options="userStore.departmentOptions"
            placeholder="请选择所属部门"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择用户状态" clearable>
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="userForm.password"
            show-password
            clearable
            placeholder="若不修改密码，请留空"
          ></el-input>
        </el-form-item>

        <el-form-item class="btn-group">
          <el-button type="primary" @click="submitEdit">确认更新</el-button>
          <el-button @click="resetAndGoBack">取消编辑</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore, type User } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const formRef = ref<any>(null)
const userStore = useUserStore()

const userForm = ref<Omit<User, 'department'> & { department: string[] }>({
  id: '',
  name: '',
  email: '',
  phone: '',
  account: '',
  department: [],
  status: '',
  password: '',
})

const rules = ref({
  name: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'change' },
    // { type: 'email', message: '邮箱格式错误', trigger: 'change' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    // { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'change' },
  ],
  account: [{ required: true, message: '账户不能为空', trigger: 'change' }],
  department: [
    { required: true, message: '请选择所属部门', trigger: 'change' },
    { type: 'array', min: 1, message: '部门不能为空', trigger: 'change' },
  ],
  status: [{ required: true, message: '请选择用户状态', trigger: 'change' }],
  password: [{ required: false, message: '密码不能为空', trigger: 'change' }],
})

onMounted(() => {
  const userId = String(route.query.id)
  if (!userId) {
    router.push('/')
    return
  }

  const targetUser = userStore.getUserById(userId)
  if (targetUser) {
    const { password, ...rest } = targetUser
    userForm.value = {
      ...rest,
      password: '',
      department: convertShortDeptToCascaderArray(rest.department),
    }
  } else {
    ElMessage.error('该用户不存在')
    router.push('/')
  }
})

const convertShortDeptToCascaderArray = (shortDeptName: string): string[] => {
  const findDeptPath = (
    options: any[],
    targetName: string,
    currentPath: string[] = [],
  ): string[] => {
    for (const option of options) {
      const newPath = [...currentPath, option.value]
      // 匹配到目标短名称，返回完整路径
      if (option.value === targetName) {
        return newPath
      }
      // 有子部门则继续递归
      if (option.children && option.children.length > 0) {
        const matchedPath = findDeptPath(option.children, targetName, newPath)
        if (matchedPath.length > 0) {
          return matchedPath
        }
      }
    }
    return [] // 未匹配到返回空数组（异常情况）
  }

  return findDeptPath(userStore.departmentOptions, shortDeptName)
}

const submitEdit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return

    const originalUser = userStore.getUserById(userForm.value.id)
    if (!originalUser) {
      ElMessage.error('用户不存在')
      return
    }

    const departmentShortName = userForm.value.department[userForm.value.department.length - 1]

    userStore.updateUser({
      ...userForm.value,
      department: departmentShortName,
      password: userForm.value.password || originalUser.password,
    })

    ElMessage.success('用户信息更新成功')
    router.push({
      path: '/',
      query: { update: '1' },
    })
  })
}

const resetAndGoBack = () => {
  formRef.value.resetFields()
  router.push('/')
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.edit-user-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.back-btn {
  margin-bottom: 20px;
}

.form-wrapper {
  position: relative;
  min-height: 450px;
}

.edit-form {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
  box-shadow: none;
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 20px;
  padding-bottom: 60px;
}

.el-form-item {
  width: calc(33.333% - 20px);
  margin: 0;
}

.btn-group {
  position: absolute;
  bottom: 190px;
  right: 60px;
  width: auto;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
}

.el-form-item :deep(.el-input),
.el-form-item :deep(.el-select),
.el-form-item :deep(.el-cascader) {
  width: 100%;
}

.el-form-item :deep(.el-cascader .el-cascader__wrapper) {
  width: 100%;
}

@media (max-width: 768px) {
  .el-form-item {
    width: 100%;
  }

  .btn-group {
    bottom: 25px;
    right: 15px;
  }
}
</style>
