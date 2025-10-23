import { defineStore } from 'pinia'

export interface User {
  id: string
  name: string
  account: string
  email: string
  department: string
  phone: string
  password: string
  status: string
}

export interface DepartmentOption {
  value: string
  label: string
  children?: DepartmentOption[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    departmentOptions: [
      {
        value: '技术部',
        label: '技术部',
        children: [
          { value: '前端一组', label: '前端一组' },
          { value: '前端二组', label: '前端二组' },
          { value: '后端组', label: '后端组' },
          { value: '测试组', label: '测试组' },
          { value: '运维组', label: '运维组' },
        ],
      },
      {
        value: '产品部',
        label: '产品部',
        children: [{ value: '这是产品部的小组', label: '这是产品部的小组' }],
      },
      {
        value: '人事部',
        label: '人事部',
        children: [
          {
            value: '这是一个名字很长长长长长的小组',
            label: '这是一个名字很长长长长长的小组',
          },
        ],
      },
    ] as DepartmentOption[],
  }),
  actions: {
    initUsers() {
      try {
        const storedUsers = sessionStorage.getItem('pinia_users')
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          this.users = parsedUsers.map((user: any) => ({
            ...user,
            department:
              typeof user.department === 'string'
                ? user.department
                : Array.isArray(user.department)
                  ? user.department[user.department.length - 1]
                  : '',
          }))
        }
      } catch (error) {
        console.error('Failed to load users from sessionStorage:', error)
        this.users = []
        sessionStorage.removeItem('pinia_users')
      }
    },
    persistUsers() {
      try {
        sessionStorage.setItem('pinia_users', JSON.stringify(this.users))
      } catch (error) {
        console.error('Failed to persist users to sessionStorage:', error)
      }
    },
    addUser(newUser: User) {
      const userToAdd = {
        ...newUser,
        department: Array.isArray(newUser.department)
          ? newUser.department[newUser.department.length - 1]
          : newUser.department,
      }
      this.users.push(userToAdd)
      this.persistUsers()
    },
    updateUser(updatedUser: User) {
      const index = this.users.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        const userToUpdate = {
          ...updatedUser,
          department: Array.isArray(updatedUser.department)
            ? updatedUser.department[updatedUser.department.length - 1]
            : updatedUser.department,
        }
        this.users[index] = userToUpdate
        this.persistUsers()
      }
    },
    deleteUserById(id: string) {
      this.users = this.users.filter((u) => u.id !== id)
      this.persistUsers()
    },
    batchDeleteUsers(ids: string[]) {
      this.users = this.users.filter((u) => !ids.includes(u.id))
      this.persistUsers()
    },
    getUserById(id: string) {
      return this.users.find((u) => u.id === id) || null
    },
  },
})
