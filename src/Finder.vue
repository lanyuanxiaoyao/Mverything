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
          <span class="path"> — {{ row.path }}</span>
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
            @click="settingDrawer.drawerOpen = true"
            class="setting-button"
            icon="el-icon-s-tools"
            type="text"
          >设置</el-button>
          <el-button
            @click="tipDrawer.drawerOpen = true"
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
    <el-drawer
      :before-close="settingDrawerCloseEvent"
      :direction="settingDrawer.drawerDirection"
      :show-close="false"
      :size="'350px'"
      :visible.sync="settingDrawer.drawerOpen"
      @open="settingDrawerOpenEvent"
    >
      <div
        class="clearfix"
        slot="title"
      >
        <span class="drawer-header">设置 Settings</span>
      </div>
      <div id="setting">
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
            :data="setting.data.keyList"
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
    </el-drawer>
    <el-drawer
      :direction="tipDrawer.drawerDirection"
      :show-close="false"
      :size="'350px'"
      :visible.sync="tipDrawer.drawerOpen"
    >
      <div
        class="clearfix"
        slot="title"
      >
        <span class="drawer-header">提示 Tips</span>
      </div>
      <div id="tip">
        <el-card body-style="{padding: 10px}">
          <div
            class="clearfix"
            slot="header"
          >
            <b>基本操作</b>
          </div>
          <el-table
            :data="tips.base"
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
          <el-table
            :data="tips.key"
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
      </div>
    </el-drawer>
    <el-drawer
      :direction="detailDrawer.drawerDirection"
      :show-close="false"
      :size="'350px'"
      :visible.sync="detailDrawer.drawerOpen"
    >
      <div
        class="clearfix"
        slot="title"
      >
        <span class="drawer-header">文件详情 Detail</span>
      </div>
      <div id="detail">
        <el-card body-style="{padding: 2px}">
          <el-table
            :data="detailDrawer.item.files"
            :max-height="400"
            @row-dblclick="detailFolderTableDbClickEvent"
            empty-text="文件夹为空"
            size="mini"
            stripe
            v-if="detailDrawer.item.preview === 'folder'"
          >
            <el-table-column
              label="文件名"
              prop="name"
            ></el-table-column>
          </el-table>
          <img
            :src="detailDrawer.item.path"
            v-else-if="detailDrawer.item.preview === 'picture'"
            width="100%"
          />
          <div v-else-if="detailDrawer.item.preview === 'text'">
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
              v-model="detailDrawer.item.text"
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
                {{ detailDrawer.item.name }}
                <el-button
                  @click="copyToClipBoard(detailDrawer.item.name)"
                  type="text"
                >复制</el-button>
              </div>
            </el-form-item>
            <el-form-item label="路径">
              <div class="wrap">
                {{ detailDrawer.item.path }}
                <el-button
                  @click="copyToClipBoard(detailDrawer.item.path)"
                  type="text"
                >复制</el-button>
              </div>
            </el-form-item>
            <el-form-item
              label="大小"
              v-show="detailDrawer.item.size"
            >
              <span
                v-if="detailDrawer.item.size > 1000000000"
              >{{ numberFix(detailDrawer.item.size / 1000000000, 2) }} GB</span>
              <span
                v-else-if="detailDrawer.item.size > 1000000"
              >{{ numberFix(detailDrawer.item.size / 1000000, 2) }} MB</span>
              <span
                v-else-if="detailDrawer.item.size > 1000"
              >{{ numberFix(detailDrawer.item.size / 1000, 2) }} KB</span>
              <span v-else-if="detailDrawer.item.size > 0">{{ detailDrawer.item.size }} B</span>
              <span v-else>无</span>
            </el-form-item>
            <el-form-item
              label="子文件数"
              v-show="detailDrawer.item.count"
            >{{ detailDrawer.item.count }}</el-form-item>
            <el-form-item label="类型">
              <el-tooltip
                :enterable="false"
                placement="top"
              >
                <div slot="content">{{ detailDrawer.item.type }}</div>
                <span>{{ detailDrawer.item.kind }}</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                disabled
                type="datetime"
                v-model="detailDrawer.item.createDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="更新时间">
              <el-date-picker
                disabled
                type="datetime"
                v-model="detailDrawer.item.updateDate"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-card>
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

export default {
  name: 'finder',
  data() {
    return {
      tableData: [],
      tableHeight: 550,
      currentPosition: 0,
      loading: false,
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
      ],
      query: '',
      settingDrawer: {
        drawerOpen: false,
        drawerDirection: 'ltr'
      },
      tipDrawer: {
        drawerOpen: false,
        drawerDirection: 'ltr'
      },
      detailDrawer: {
        drawerOpen: false,
        drawerDirection: 'rtl',
        item: {}
      },
      setting: {
        _id: 'Mverything-setting',
        data: {
          isFindFileContent: false,
          searchRoot: 'user',
          searchKey: ':',
          keyList: [
            {
              key: 'p',
              regex: 'png|jpg'
            }
          ]
        },
        _rev: ''
      },
      homeDir: '/',
      rootDir: '/',
      sort: {
        field: 'name',
        type: -1
      },
      tips: {
        base: [
          {
            name: 'Enter(回车)',
            description: '搜索'
          },
          {
            name: 'Space (空格)',
            description: '文件详情'
          },
          {
            name: '→ (右方向键双击)',
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
        ],
        key: [
          {
            name: 'f',
            description: '仅搜索文件'
          },
          {
            name: 'F',
            description: '仅搜索文件夹'
          },
          {
            name: 'p',
            description: '仅搜索图片'
          }
        ]
      }
    }
  },
  mounted() {
    utools.onPluginEnter(({ code, type, payload }) => {
      // 初始化
      this.initial()
      utools.setSubInput(({ text }) => {
        // 把输入更新到变量中
        this.query = text
      }, 'Enter 搜索, 双击/方向键→ 直接打开, 右击 快捷菜单')
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
      // 把上次搜索的关键字设置到输入框中
      utools.setSubInputValue(this.query)
      // 获取配置信息
      var setting = utools.db.get(this.setting._id)
      if (setting) {
        this.setting = setting
      }
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
      var keyIndex = query.indexOf(this.setting.data.searchKey)
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
        this.setting.data.searchRoot === 'user' ? this.homeDir : this.rootDir
      // 判断当前配置设置的搜索模式
      var isOnlyName = !this.setting.data.isFindFileContent
      // 搜索
      window.find(query.trim(), isOnlyName, dir, result => {
        if (this.$refs.xTable) {
          // 处理搜索结果
          this.tableData = Handler.handle(
            result,
            highFilter,
            keyWord,
            Tools.generateListToMap(this.setting.data.keyList, 'key', 'regex')
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
    addKeySearch() {
      this.$prompt('规则格式: 关键词&正则表达式', '添加快捷搜索规则', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+&.+/,
        inputErrorMessage: '规则格式不正确'
      }).then(({ value }) => {
        console.log(value)
        var separatorIndex = value.indexOf('&')
        var key = value.substring(0, separatorIndex)
        var regex = value.substring(separatorIndex + 1)
        this.setting.data.keyList.push({
          key: key,
          regex: regex
        })
      })
    },
    removeKeySearch(row) {
      this.$confirm('确认删除快捷搜索' + row.key, '不可恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var index = this.findIndexInSearchKeyList(row.key)
        console.log(index)
        if (index > -1) {
          this.setting.data.keyList.splice(index, 1)
        }
        console.log(this.setting.data.keyList)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    findIndexInSearchKeyList(key) {
      var list = this.setting.data.keyList
      for (var i = 0; i < list.length; i++) {
        if (key === list[i].key) {
          return i
        }
      }
      return -1
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
    numberFix(number, fixed) {
      return number.toFixed(fixed)
    },
    loadDetail() {
      this.detailDrawer.item = this.$refs.xTable.getCurrentRow()
      if (this.detailDrawer.item.type === 'public.folder') {
        this.detailDrawer.item.preview = 'folder'
        window.readFileList(this.detailDrawer.item.path, data => {
          this.detailDrawer.item.files = data
        })
        return
      }
      var extension = Tools.getExtension(this.detailDrawer.item.name)
      this.detailDrawer.item.preview = Constant.typeMap()[extension]
      if (
        this.detailDrawer.item.preview &&
        this.detailDrawer.item.preview === 'text'
      ) {
        window.readTextFile(this.detailDrawer.item.path, data => {
          var encode = CharDetect.detect(data)
          this.detailDrawer.item.text = IconvLite.decode(data, encode)
        })
      }
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
        if (!this.detailDrawer.drawerOpen) {
          this.loadDetail()
        }
        this.detailDrawer.drawerOpen = !this.detailDrawer.drawerOpen
      }
      // 左方向键
      else if (keyCode === 37) {
        if (this.detailDrawer.drawerOpen) {
          this.detailDrawer.drawerOpen = false
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
          if (this.detailDrawer.drawerOpen) {
            this.detailDrawer.drawerOpen = false
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
          this.detailDrawer.drawerOpen = true
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
      if (this.detailDrawer.drawerOpen) {
        this.detailDrawer.item = row
      }
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
    detailFolderTableDbClickEvent(row, column, event) {
      console.log(row)
      window.openDirectly(this.detailDrawer.item.path + '/' + row.name)
    },
    // 抽屉打开事件
    settingDrawerOpenEvent() {},
    // 抽屉关闭事件
    settingDrawerCloseEvent(done) {
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
      done()
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
#tip .el-card,
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

