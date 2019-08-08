<template>
  <div id="finder">
    <vxe-table
      :context-menu="{body: {options: menus}}"
      :height="550"
      :keyboard-config="{isArrow: true}"
      :loading="loading"
      :optimization="{scrollY: {gt: 1000, oSize: 10, rSize: 100}}"
      :show-header="false"
      @cell-context-menu="cellClickEvent"
      @cell-dblclick="cellDClickEvent"
      @context-menu-click="menuClickEvent"
      highlight-current-row
      highlight-hover-row
      ref="xTable"
      resizable
      show-overflow
      tabindex="0"
    >
      <vxe-table-column
        field="kMDItemContentType"
        width="40"
      >
        <template v-slot="{ row }">
          <img
            :src="row.icon"
            class="icon"
          />
        </template>
      </vxe-table-column>
      <vxe-table-column field="path">
        <template v-slot="{ row }">
          <span class="path">{{ row.path }}</span>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div
      :style="'top: ' + footerPosition + 'px;position: absolute;width: 100%'"
      id="footer"
    >
      <el-row
        align="middle"
        type="flex"
      >
        <el-col :span="20">
          <el-button
            @click="drawerOpen = true"
            icon="el-icon-s-tools"
            type="text"
          >设置</el-button>
        </el-col>
        <el-col :span="4">
          <div id="total">共搜索到 {{ tableData.length }} 条</div>
        </el-col>
      </el-row>
    </div>
    <el-drawer
      :before-close="drawerCloseEvent"
      :direction="drawerDirection"
      :size="'250px'"
      :visible.sync="drawerOpen"
      @open="drawerOpenEvent"
      title="设置 Setting"
    >
      <div id="setting">
        <el-form
          label-position="top"
          ref="settingForm"
        >
          <el-form-item label="是否搜索文件内容">
            <el-switch v-model="setting.data.isFindFileContent"></el-switch>
          </el-form-item>
          <el-form-item label="搜索范围">
            <el-select v-model="setting.data.searchRoot">
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
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Handler from './handler'

export default {
  name: 'finder',
  data() {
    return {
      tableData: [],
      currentPosition: 0,
      loading: false,
      menus: [
        [
          {
            code: 'open',
            name: '打开'
          },
          {
            code: 'openInFinder',
            name: '在 finder 中打开'
          }
        ],
        [
          {
            code: 'copyFileName',
            name: '复制文件名'
          },
          {
            code: 'copyFilePath',
            name: '复制文件路径'
          }
        ]
      ],
      query: '',
      drawerOpen: false,
      drawerDirection: 'ltr',
      setting: {
        _id: 'Mverything-setting',
        data: {
          isFindFileContent: false,
          searchRoot: 'user'
        },
        _rev: ''
      },
      homeDir: '/',
      rootDir: '/',
      footerPosition: 0
    }
  },
  mounted() {
    utools.onPluginEnter(({ code, type, payload }) => {
      // 初始化
      this.initial()
      utools.setSubInput(({ text }) => {
        // 把输入更新到变量中
        this.query = text
      }, '文件名搜索')
    })
    // 绑定键盘事件
    document.addEventListener('keydown', this.keyDownEvent)
  },
  destroyed() {
    // 解绑键盘事件
    document.removeEventListener('keydown', this.keyDownEvent)
  },
  methods: {
    initial() {
      // 初始化找到用户目录
      this.homeDir = utools.getPath('home')
      // 获取配置信息
      var setting = utools.db.get(this.setting._id)
      if (setting) {
        this.setting = setting
      }
      // 把上次搜索的关键字设置到输入框中
      utools.setSubInputValue(this.query)
    },
    // 搜索
    search(query) {
      // 打开加载中进度条
      this.loading = true
      // 初始化当前高亮的位置
      this.currentPosition = 0

      // 如果搜索的关键字为空
      if (query === '') {
        // 收回面板
        this.expendPanel(-1)
        // 清空结果表格
        this.$refs.xTable.loadData([])
        // 关闭加载进度条
        this.loading = false
        return
      }

      // 处理条件搜索关键字
      // 获取第二个字符
      var key = query.charAt(1)
      var keyWord = ''
      // 判断第二个字符是否为 :
      if (key && key === ':') {
        // 获取第一个字符
        keyWord = query.charAt(0)
        // 截取 : 后的目标搜索文本
        query = query.substring(2, query.length)
      }

      // 判断当前配置中设置的搜索起始目录
      var dir = this.setting.data.searchRoot === 'user' ? this.homeDir : this.rootDir
      // 判断当前配置设置的搜索模式
      var isOnlyName = !this.setting.data.isFindFileContent
      // 搜索
      window.find(query, isOnlyName, dir, result => {
        if (this.$refs.xTable) {
          // 处理搜索结果
          this.tableData = Handler.handle(result, keyWord)
          // 加载搜索结果
          this.$refs.xTable.loadData(this.tableData)
          // 展开面板
          this.expendPanel(this.tableData.length)
          // 设置第一条结果的高亮
          this.$refs.xTable.setCurrentRow(this.tableData[0])
          // 滚动到表格顶部
          this.$refs.xTable.scrollTo(this.tableData[0])
        }
        // 结束加载中进度条
        this.loading = false
      })
    },
    expendPanel(size) {
      // 如果结果条数为0, 收起面板
      if (size < 0) {
        utools.setExpendHeight(1)
        this.footerPosition = 0
      }
      // 如果结果条数超过8条就设定为最大高度, 否则计算实际高度
      var height = size > 8 ? 590 : size * 65 + 40
      this.footerPosition = height - 40
      utools.setExpendHeight(height)
    },
    // 键盘事件
    keyDownEvent(event) {
      // 获取当前按下的键
      var keyCode = window.event ? event.keyCode : event.which
      // 回车
      if (keyCode === 13) {
        // 开启加载中进度条
        this.loading = true
        // 面板展开到最大
        this.expendPanel(9)
        // 执行搜索
        this.search(this.query.trim())
      }
      // 右方向键
      else if (keyCode === 39) {
        // 获取当前高亮的结果
        var row = this.$refs.xTable.getCurrentRow()
        // 使用默认方式打开
        window.openDirectly(row.path)
      }
    },
    // 表格快捷菜单点击事件
    menuClickEvent({ menu, row }) {
      var code = menu.code
      var path = row.path
      var name = row.name
      switch (code) {
        case 'open':
          window.openDirectly(path)
          break
        case 'openInFinder':
          window.openInFinder(path)
          break
        case 'copyFilePath':
          window.writeToClipboard(path)
          utools.showNotification('复制成功: ' + path, null, true)
          break
        case 'copyFileName':
          window.writeToClipboard(name)
          utools.showNotification('复制成功: ' + name, null, true)
          break
      }
    },
    // 行单击事件
    cellDClickEvent({ row }) {
      // 直接打开
      window.openDirectly(row.path)
    },
    drawerOpenEvent() {
      this.expendPanel(9)
    },
    // 抽屉关闭事件
    drawerCloseEvent(done) {
      // 判断设置中的_rev是否为空
      if (this.setting._rev === '') {
        // 新增配置到数据库
        var result = utools.db.put({
          _id: this.setting._id,
          data: this.setting.data
        })
        if (!result.ok) {
          this.$message.error('配置保存失败')
          return
        }
        // 更新_rev
        this.setting._rev = result.rev
      } else {
        // 更新数据库中的配置
        var result = utools.db.put(this.setting)
        if (!result.ok) {
          this.$message.error('配置保存失败')
          return
        }
        // 更新_rev
        this.setting._rev = result.rev
      }
      this.$message.success('配置保存成功')
      this.expendPanel(this.tableData.length)
      done()
    }
  }
}
</script>

<style scoped>
.icon {
  width: 33px;
  height: 33px;
  padding-right: 10px;
}
.path {
  cursor: default;
  user-select: none;
}
#footer {
  background-color: rgba(184, 184, 184, 0.055);
  height: 40px;
}
#setting {
  padding: 20px;
}
</style>
