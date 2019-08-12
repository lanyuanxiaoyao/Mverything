<template>
  <div id="finder">
    <vxe-table
      :context-menu="{body: {options: menus}}"
      :height="tableHeight"
      :keyboard-config="{isArrow: true}"
      :loading="loading"
      :optimization="{scrollY: {gt: 1000, oSize: 10, rSize: 100}}"
      :show-header="false"
      @cell-context-menu="cellClickEvent"
      @cell-dblclick="cellDClickEvent"
      @context-menu-click="menuClickEvent"
      @current-change="currentChangeEvent"
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
          <span class="name">{{ row.name }}</span>
          <span class="path">— {{ row.path }}</span>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div id="footer">
      <el-row
        align="middle"
        type="flex"
      >
        <el-col
          :span="4"
          style="padding-left: 15px"
        >
          <el-button
            @click="settingDrawer.open = true"
            class="setting-button"
            icon="el-icon-s-tools"
            type="text"
          >设置</el-button>
          <el-button
            @click="tipDrawer.open = true"
            class="tip-button"
            icon="el-icon-info"
            type="text"
          >提示</el-button>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="15">
          <el-radio-group
            @change="sortChangeEvent"
            class="radio-group"
            size="mini"
            v-model="sort.field"
          >
            <el-radio-button label="name">名称</el-radio-button>
            <el-radio-button label="size">大小</el-radio-button>
            <el-radio-button label="createDate">创建时间</el-radio-button>
            <el-radio-button label="updateDate">更新时间</el-radio-button>
          </el-radio-group>
          <span class="gap"></span>
          <el-radio-group
            @change="sortChangeEvent"
            class="radio-group"
            size="mini"
            v-model="sort.type"
          >
            <el-radio-button label="1">
              <i class="el-icon-sort-down"></i>
            </el-radio-button>
            <el-radio-button label="-1">
              <i class="el-icon-sort-up"></i>
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="4">
          <div id="total">共搜索到 {{ tableData.length }} 条</div>
        </el-col>
      </el-row>
    </div>
    <!-- 设置界面 -->
    <el-drawer
      :before-close="settingDrawerCloseEvent"
      :direction="settingDrawer.direction"
      :show-close="false"
      :size="'350px'"
      :visible.sync="settingDrawer.open"
    >
      <div
        class="clearfix"
        slot="title"
      >
        <span class="drawer-header">设置 Settings</span>
      </div>
      <Settings ref="settings" />
    </el-drawer>

    <!-- 提示界面 -->
    <el-drawer
      :direction="tipDrawer.direction"
      :show-close="false"
      :size="'350px'"
      :visible.sync="tipDrawer.open"
    >
      <div
        class="clearfix"
        slot="title"
      >
        <span class="drawer-header">提示 Tips</span>
      </div>
      <Tips />
    </el-drawer>

    <!-- 详情界面 -->
    <el-drawer
      :direction="detailDrawer.direction"
      :modal="false"
      :size="'400px'"
      :visible.sync="detailDrawer.open"
      @open="detailDrawerOpenEvent"
    >
      <div
        class="clearfix"
        slot="title"
      >
        <span class="drawer-header">文件详情 Detail</span>
      </div>
      <div id="detail">
        <div id="detail">
          <el-card body-style="{padding: 2px}">
            <el-table
              :data="item.files"
              :max-height="400"
              @row-dblclick="detailFolderTableDbClickEvent"
              empty-text="文件夹为空"
              size="mini"
              stripe
              v-if="item.preview === 'folder'"
            >
              <el-table-column
                label="文件名"
                prop="name"
              ></el-table-column>
            </el-table>
            <img
              :src="item.path"
              v-else-if="item.preview === 'picture'"
              width="100%"
            />
            <div v-else-if="item.preview === 'text'">
              <el-alert
                show-icon
                style="margin-bottom: 5px"
                title="仅提供部分文本内容预览"
                type="warning"
              ></el-alert>
              <el-input
                :autosize="{ minRows: 1, maxRows: 20 }"
                readonly
                resize="none"
                type="textarea"
                v-model="item.text"
              ></el-input>
            </div>
            <span v-else>暂无预览</span>
          </el-card>
          <el-card body-style="{padding: 5px}">
            <el-form
              :show-message="false"
              label-position="left"
              label-width="70px"
              size="mini"
            >
              <el-form-item label="文件名">
                <div class="wrap">
                  {{ item.name }}
                  <el-button
                    @click="copyToClipBoard(item.name)"
                    type="text"
                  >复制</el-button>
                </div>
              </el-form-item>
              <el-form-item label="路径">
                <div class="wrap">
                  {{ item.path }}
                  <el-button
                    @click="copyToClipBoard(item.path)"
                    type="text"
                  >复制</el-button>
                </div>
              </el-form-item>
              <el-form-item
                label="大小"
                v-show="item.size"
              >
                <span v-if="item.size > 1000000000">{{ numberFix(item.size / 1000000000, 2) }} GB</span>
                <span v-else-if="item.size > 1000000">{{ numberFix(item.size / 1000000, 2) }} MB</span>
                <span v-else-if="item.size > 1000">{{ numberFix(item.size / 1000, 2) }} KB</span>
                <span v-else-if="item.size > 0">{{ item.size }} B</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item
                label="子文件数"
                v-show="item.count"
              >{{ item.count }}</el-form-item>
              <el-form-item label="类型">
                <el-tooltip
                  :enterable="false"
                  placement="top"
                >
                  <div slot="content">{{ item.type }}</div>
                  <span>{{ item.kind }}</span>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  disabled
                  type="datetime"
                  v-model="item.createDate"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="更新时间">
                <el-date-picker
                  disabled
                  type="datetime"
                  v-model="item.updateDate"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Handler from './handler'
import Constant from './constant'
import Tools from './tools'
import IconvLite from 'iconv-lite'
import CharDetect from 'chardet'

import { mapGetters } from 'vuex'

import Tips from './components/Tips'
import Settings from './components/Setting'

export default {
  name: 'finder',
  components: {
    Settings,
    Tips
  },
  data() {
    return {
      tableData: [],
      tableHeight: 550,
      currentPosition: 0,
      loading: false,
      query: '',
      settingDrawer: {
        open: false,
        direction: 'ltr'
      },
      tipDrawer: {
        open: false,
        direction: 'ltr'
      },
      detailDrawer: {
        open: false,
        direction: 'rtl'
      },
      item: {},
      tempDir: '',
      homeDir: '/',
      rootDir: '/',
      sort: {
        field: 'name',
        type: -1
      },
      menus: [
        [
          {
            code: 'detail',
            name: '显示详情'
          }
        ],
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
      ]
    }
  },
  computed: mapGetters({
    settings: 'settings'
  }),
  mounted() {
    utools.onPluginEnter(({ code, type, payload }) => {
      // 初始化
      this.initial(code, type, payload)
      utools.setSubInput(({ text }) => {
        // 把输入更新到变量中
        this.query = text
      }, 'Enter 搜索, Space 预览, → 打开')
    })
    utools.onPluginOut(() => {
      this.tempDir = ''
    })
    // 绑定键盘事件
    document.addEventListener('keydown', this.keyDownEvent)
  },
  destroyed() {
    // 解绑键盘事件
    document.removeEventListener('keydown', this.keyDownEvent)
  },
  methods: {
    initial(code, type, payload) {
      const h = this.$createElement
      if (type === 'files') {
        this.$notify({
          title: '当前搜索路径',
          message: h(
            'code',
            { style: 'word-break: break-all' },
            payload[0].path
          )
        })
        this.tempDir = payload[0].path
      } else if (type === 'window') {
        window.getCurrentFinderPath(result => {
          result = result.trim()
          var lastChar = result.charAt(result.length - 1)
          if (lastChar === '/') {
            result = result.substring(0, result.length - 1)
          }
          this.$notify({
            title: '当前搜索路径',
            message: h('code', { style: 'word-break: break-all' }, result)
          })
          this.tempDir = result
        })
      }
      // 初始化找到用户目录
      this.homeDir = utools.getPath('home')
      // 把上次搜索的关键字设置到输入框中
      utools.setSubInputValue(this.query)
    },
    // 重置
    reset() {
      // 清空结果表格
      this.tableData = []
      this.$refs.xTable.loadData(this.tableData)
      // 关闭加载进度条
      this.loading = false
    },
    // 搜索
    search(query) {
      // 打开加载中进度条
      this.loading = true
      // 初始化当前高亮的位置
      this.currentPosition = 0

      // 如果搜索的关键字为空
      if (query === '') {
        this.$message.info('搜索词为空')
        this.reset()
        return
      }

      var highFilter = ''
      if (query.length > 2) {
        var first = query.charAt(0)
        var second = query.charAt(1)
        if (first === ' ') {
          highFilter = 'F'
          if (second === ' ') {
            highFilter = 'f'
          }
        }
      }
      query = query.trim()

      // 处理条件搜索关键字
      var keyIndex = query.indexOf(this.settings.data.searchKey)
      var keyWord = ''
      if (keyIndex > 0) {
        keyWord = query.substring(0, keyIndex)
        query = query.substring(keyIndex + 1, query.length)
      }

      // 如果搜索的关键字还是为空
      if (query.trim() === '') {
        this.$message.info('搜索词为空')
        this.reset()
        return
      }

      // 判断当前配置中设置的搜索起始目录
      var dir =
        this.tempDir === ''
          ? this.settings.data.searchRoot === 'user'
            ? this.homeDir
            : this.rootDir
          : this.tempDir
      // 判断当前配置设置的搜索模式
      var isOnlyName = !this.settings.data.isFindFileContent
      // 搜索
      window.find(query.trim(), isOnlyName, dir, result => {
        if (this.$refs.xTable) {
          // 处理搜索结果
          this.tableData = Handler.handle(
            result,
            highFilter,
            keyWord,
            Tools.generateListToMap(this.settings.data.keyList, 'key', 'regex')
          )
          this.tableData = Handler.sort(
            this.tableData,
            this.sort.field,
            this.sort.type
          )
          // 加载搜索结果
          this.$refs.xTable.loadData(this.tableData)
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
      if (size < 1) {
        utools.setExpendHeight(1)
        this.tableHeight = 0
        this.footerPosition = 0
        return
      }
      // 如果结果条数超过8条就设定为最大高度, 否则计算实际高度
      var height = size > 8 ? 550 : size * 65
      this.tableHeight = height
      this.footerPosition = height
      utools.setExpendHeight(height + 40)
    },
    copyToClipBoard(text) {
      window.writeToClipboard(text)
    },
    // 键盘事件
    keyDownEvent(event) {
      // 获取当前按下的键
      var keyCode = window.event ? event.keyCode : event.which
      // 回车
      if (keyCode === 13) {
        // 开启加载中进度条
        this.loading = true
        // 执行搜索
        this.search(this.query)
        window.focus()
      }
      // 空格键
      else if (keyCode === 32) {
        if (this.tableData.length === 0) {
          return
        }
        this.detailDrawer.open = !this.detailDrawer.open
      }
      // 左方向键
      else if (keyCode === 37) {
        if (this.detailDrawer.open) {
          this.detailDrawer.open = false
          return
        }
      }
      // 右方向键
      else if (keyCode === 39) {
        // 获取当前高亮的结果
        var row = this.$refs.xTable.getCurrentRow()
        // 使用默认方式打开
        window.openDirectly(row.path)
      }
      // ESC 键
      else if (keyCode === 27) {
        var isFocused = window.isfocus()
        if (isFocused) {
          if (this.detailDrawer.open) {
            this.detailDrawer.open = false
          }
          utools.setSubInputValue(this.query)
          event.stopPropagation()
        }
      }
    },
    // 表格快捷菜单点击事件
    menuClickEvent({ menu, row }) {
      var code = menu.code
      var path = row.path
      var name = row.name
      switch (code) {
        case 'detail':
          this.detailDrawer.item = row
          this.detailDrawer.open = true
          break
        case 'open':
          window.openDirectly(path)
          break
        case 'openInFinder':
          window.openInFinder(path)
          break
        case 'copyFilePath':
          this.copyToClipBoard(path)
          break
        case 'copyFileName':
          this.copyToClipBoard(name)
          break
      }
    },
    currentChangeEvent({ row }) {
      this.loadData(row)
    },
    sortChangeEvent(value) {
      this.loading = true
      this.tableData = Handler.sort(
        this.tableData,
        this.sort.field,
        this.sort.type
      )
      // 加载搜索结果
      this.$refs.xTable.loadData(this.tableData)
      // 设置第一条结果的高亮
      this.$refs.xTable.setCurrentRow(this.tableData[0])
      // 滚动到表格顶部
      this.$refs.xTable.scrollTo(this.tableData[0])
      this.loading = false
    },
    // 行单击事件
    cellClickEvent({ row }) {
      this.$refs.xTable.setCurrentRow(row)
    },
    // 行双击事件
    cellDClickEvent({ row }) {
      // 直接打开
      window.openDirectly(row.path)
    },
    // 抽屉关闭事件
    settingDrawerCloseEvent(done) {
      var result = this.$refs.settings.save()
      if (result) {
        this.$message.success('配置保存成功')
        done()
      } else {
        this.$message.error('配置保存失败')
      }
    },
    loadData(item) {
      console.log('load detail:', item)
      if (item.path === this.item.path) {
        return
      }
      this.item = item
      if (this.item.type === 'public.folder') {
        this.item.preview = 'folder'
        window.readFileList(this.item.path, data => {
          this.item.files = data
        })
        return
      }
      var extension = Tools.getExtension(this.item.name)
      this.item.preview = Constant.typeMap()[extension]
      if (
        this.item.type === 'public.plain-text' ||
        (this.item.preview && this.item.preview === 'text')
      ) {
        window.readTextFile(this.item.path, data => {
          var encode = CharDetect.detect(data)
          this.item.text = IconvLite.decode(data, encode)
        })
      }
    },
    numberFix(number, fixed) {
      return number.toFixed(fixed)
    },
    detailFolderTableDbClickEvent(row, column, event) {
      window.openDirectly(this.item.path + '/' + row.name)
    },
    detailDrawerOpenEvent() {
      var item = this.$refs.xTable.getCurrentRow()
      this.loadData(item)
    }
  }
}
</script>

<style scoped>
.vxe-table:focus {
  outline: none;
}
.vxe-table::before,
.vxe-table::after {
  height: 0px;
}
.icon {
  width: 33px;
  height: 33px;
  padding-right: 10px;
}
.name {
  color: #000000c4;
  cursor: default;
  user-select: none;
}
.path {
  color: #a0a0a0;
  cursor: default;
  user-select: none;
}
#footer {
  height: 40px;
}
.setting-form {
  padding-left: 20px;
}
#setting .el-card,
#detail .el-card {
  margin: 10px;
}
.gap {
  padding-left: 2px;
  padding-right: 2px;
}
.drawer-header {
  font-size: 1.5em;
}
.wrap {
  word-break: break-all;
}
</style>
<style>
.el-drawer.ltr,
.el-drawer.rtl {
  overflow-y: auto;
}
</style>

