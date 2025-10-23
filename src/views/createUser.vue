<template>
  <div class="create-user-container">
    <h2 class="page-title">新建用户</h2>
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
          ></el-cascader>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择用户状态">
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
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-group">
          <el-button type="primary" @click="submitForm">确定添加</el-button>
          <el-button @click="goBack">取消添加</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref(null)

const userForm = ref({
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
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮件', trigger: 'change' },
    // { type: 'email', message: '邮箱格式错误', trigger: 'change' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    // { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'change' },
  ],
  account: [{ required: true, message: '请输入账户', trigger: 'change' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
})

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      userStore.addUser({
        ...userForm.value,
        id: Date.now().toString(),
      })
      ElMessage.success('用户添加成功')
      router.push('/')
    }
  })
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.create-user-container {
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
