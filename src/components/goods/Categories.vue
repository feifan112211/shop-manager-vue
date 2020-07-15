/* eslint-disable standard/computed-property-even-spacing */
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        border
        show-index
        index-text="#"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCatDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="addForm.cat_name"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择父级" prop="parentCat">
          <el-cascader
            v-model="addForm.parentCat"
            :options="parentCatList"
            :props="parentProps"
            @change="parentChange"
            clearable
          ></el-cascader
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
          width: 200
        }
      ],
      cateId: '',
      cateInfo: {},
      cateList: [],
      parentCatList: [],
      // 级联选择器配置项
      parentProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      addForm: {
        // 级联选择器的v-model绑定必须是数组
        parentCat: [],
        // 添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        //  分类的等级 默认添加1级分类
        cat_level: 0
      },
      editForm: {},
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符之间', trigger: 'blur' }
        ]
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 打开添加分类对话框
    openAddDialog() {
      //  获取父级分类
      this.getParentCat()
      this.addDialogVisible = true
    },

    async getParentCat() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败!')
      }
      this.parentCatList = res.data
    },
    // 关闭添加分类对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  级联选择器change事件
    parentChange() {
      if (this.addForm.parentCat.length > 0) {
        // eslint-disable-next-line standard/computed-property-even-spacing
        this.addForm.cat_pid = this.addForm.parentCat[
          this.addForm.parentCat.length - 1
        ]
        this.addForm.cat_level = this.addForm.parentCat.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    //  添加分类
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', {
          cat_pid: this.addForm.cat_pid,
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_level
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    //  打开编辑分类对话框
    async editCatDialog(item) {
      this.cateId = item.cat_id
      this.cateInfo = item
      const { data: res } = await this.$http.get('categories/' + this.cateId)
      if (res.meta.status !== 200) {
        return this.$message.error('获取当前分类失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },

    //  关闭编辑分类对话框
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //  编辑分类
    editCate() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}`,
          { cat_name: this.editForm.cat_name }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    //  删除分类
    async deleteCate(id) {
      const conRes = await this.$confirm(
        '此操作将永久删除该用户数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (conRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
