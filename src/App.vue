<template>
  <div class="app-container">
    <header class="app-header">
      <nav class="main-nav">
        <router-link to="/user-management" class="nav-item">用户管理</router-link>
        <router-link to="/data-management" class="nav-item">图表管理</router-link>
      </nav>
    </header>
    <main class="content"><router-view></router-view></main>
  </div>
</template>

<script setup></script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  margin: 0;
}
.app-header {
  background-color: #f5f7fa;
  padding: 0 20px;
}
.main-nav {
  display: flex;
  gap: 2px;
  height: 60px;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  transition: all 0.3s ease;
}
.nav-item:hover {
  background-color: #e4e6eb;
}
.nav-item.router-link-exact-active {
  background-color: #fff;
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
/* .content {
  flex: 1;
  background-color: RGBA(23, 45, 77, 1);
} */
</style>
