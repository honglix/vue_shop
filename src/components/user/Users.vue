<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter.native="getUserList" @input="clearList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="userlist"
        style="width: 100%"
        border
        stripe >
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          label="状态">
          <template v-slot:default="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state" @change="userStateChanged(slotProps.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" width="180px">
          <template v-slot:default="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotProps.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

    <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">

      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名字">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        cb()
      } else {
        cb(new Error('邮箱格式不正确'))
      }
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        cb()
      } else {
        cb(new Error('手机号码格式不正确'))
      }
    }
    return {
      // 获取用户列表参数
    queryInfo: {
      query: '',
      // 当前页数
      pagenum: 1,
      pagesize: 10
    },
    userlist: [],
    total: 0,
    addDialogVisible: false,
    // 控制修改用户对话框的显示与隐藏
    editDialogVisible: false,
    // 查询到的用户对象
    editForm: {},
    addForm: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    // 添加表单验证规则
    addFormRules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '请输入手机', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
      ]
    },
    // 修改表单的校验规则
    editFormRules: {
      email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '请输入手机', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
      ]
    }
  }
},
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    clearList() {
      if (this.queryInfo.query === '') {
        this.getUserList()
      }
    },
    addDialogClosed() {
      this.$refs['addFormRef'].resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) { return }
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        // 重新获取列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      console.log(id)
      const { data: res } = await this.$http.get(`users/` + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户失败')
      this.editForm = res.data
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs['editFormRef'].resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) { return false } 
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新用户失败')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        this.$message.success('更新用户成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
