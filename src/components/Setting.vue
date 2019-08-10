<template>
  <div>
    <el-card
          body-style="{padding: 5px}"
          header="基本设置"
        >
          <el-form
            class="setting-form"
            label-position="top"
            ref="settingForm"
          >
            <el-form-item label="是否搜索文件内容">
              <el-switch v-model="settings.data.isFindFileContent"></el-switch>
            </el-form-item>
            <el-form-item label="搜索范围">
              <el-select v-model="settings.data.searchRoot">
                <el-option
                  label="~/ (用户目录)"
                  value="user"
                ></el-option>
                <el-option
                  label="/ (根目录)"
                  value="root"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card body-style="{padding: 5px}">
          <div
            class="clearfix"
            slot="header"
          >
            <span>快捷搜索</span>
            <el-button
              @click="addKeySearch"
              style="float: right; padding: 3px 0"
              type="text"
            >添加</el-button>
          </div>
          <el-table
            :data="settings.data.keyList"
            size="small"
            style="width: 100%"
          >
            <el-table-column
              label="关键词"
              prop="key"
              width="70"
            >
              <template slot-scope="scope">
                <code>{{ scope.row.key }}</code>
              </template>
            </el-table-column>
            <el-table-column
              label="正则表达式"
              prop="regex"
            >
              <template slot-scope="scope">
                <code>{{ scope.row.regex }}</code>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="50"
            >
              <template slot-scope="scope">
                <el-button
                  @click="removeKeySearch(scope.row)"
                  size="small"
                  type="text"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    console.log(this.settings)
  },
  computed: mapGetters({
    settings: 'settings'
  }),
  methods: {
    saveSettings() {
      // 判断设置中的_rev是否为空
      if (this.settings._rev === "") {
        // 新增配置到数据库
        var result = utools.db.put({
          _id: this.settings._id,
          data: this.settings.data
        });
        console.log(result)
        if (!result.ok) {
          this.$message.error("配置保存失败");
          return;
        }
        console.log(result)
        // 更新_rev
        this.$store.commit('updateSettingsRev', result._rev)
        console.log(this.settings)
      } else {
        // 更新数据库中的配置
        var result = utools.db.put(this.settings);
        if (!result.ok) {
          this.$message.error("配置保存失败");
          return;
        }
        console.log(result)
        // 更新_rev
        this.$store.commit('updateSettingsRev', result._rev)
        console.log(this.settings)
      }
    }
  }
}
</script>

<style scoped>
.el-card {
  margin: 10px;
}
</style>