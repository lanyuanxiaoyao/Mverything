<template>
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
        <span v-else>
          <el-button type="text">暂无预览, 使用 quick look 查看</el-button>
        </span>
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
</template>

<script>
import IconvLite from 'iconv-lite'
import CharDetect from 'chardet'
import Constant from '../constant'
import Tools from '../tools'

export default {
  name: 'detail',
  data() {
    return {
      item: {}
    }
  },
  methods: {
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
    copyToClipBoard(text) {
      window.writeToClipboard(text)
    },
    numberFix(number, fixed) {
      return number.toFixed(fixed)
    },
    detailFolderTableDbClickEvent(row, column, event) {
      window.openDirectly(this.item.path + '/' + row.name)
    }
  }
}
</script>

<style scoped>
.el-card {
  margin: 10px;
}
.wrap {
  word-break: break-all;
}
</style>