<template>
  <div>
    <el-card body-style="{padding: 10px}">
      <div
        class="clearfix"
        slot="header"
      >
        <b>基本操作</b>
      </div>
      <el-table
        :data="base"
        style="width: 100%"
      >
        <el-table-column
          label="操作"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="说明"
          prop="description"
        ></el-table-column>
      </el-table>
    </el-card>
    <el-card body-style="{padding: 10px}">
      <div
        class="clearfix"
        slot="header"
      >
        <b>快捷搜索</b>
      </div>
      <p>快捷搜索即对结果类型进行简单过滤, 使用方法为在搜索时加上前缀: 'key:搜索文本'</p>
      <p>
        详细使用见插件主页:
        <a href="https://yuanliao.info/d/595/13">https://yuanliao.info/d/595/13</a>
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      base: [
        {
          name: 'Enter (回车)',
          description: '搜索'
        },
        {
          name: 'Space (空格)',
          description: '预览'
        },
        {
          name: 'Esc',
          description: '退出当前状态'
        },
        {
          name: 'delete',
          description: '删除当前文件'
        },
        {
          name: 'c (键盘C键)',
          description: '复制文件'
        },
        {
          name: '→ (右方向键)',
          description: '默认方式打开'
        },
        {
          name: '鼠标双击',
          description: '默认方式打开'
        },
        {
          name: '鼠标右键',
          description: '快捷菜单'
        }
      ]
    }
  }
}
</script>

<style scoped>
.el-card {
  margin: 10px;
}
</style>