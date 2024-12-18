<template>
  <form class="todo-form">
    <div class="form-group">
      <label>标题</label>
      <input
        type="text"
        v-model="formData.text"
        placeholder="待办事项标题..."
        required
      />
    </div>

    <div class="form-group">
      <label>截止日期</label>
      <input type="datetime-local" v-model="formData.deadline" />
    </div>

    <div class="form-group">
      <label>分组</label>
      <select v-model="formData.group">
        <option value="">选择分组...</option>
        <option v-for="group in groups" :value="group">{{ group }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>标签</label>
      <div class="tags-input">
        <div class="tag-select">
          <select v-model="selectedTag">
            <option value="">选择标签...</option>
            <option v-for="tag in tags" :value="tag">{{ tag }}</option>
          </select>
        </div>
        <div class="selected-tags">
          <span
            v-for="tag in formData.tags"
            class="tag"
            :style="{ backgroundColor: getTagColor(tag) }"
            @click="removeTag(tag)"
          >
            {{ tag }}
            <span class="remove-tag">×</span>
          </span>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>描述</label>
      <textarea
        v-model="formData.description"
        rows="2"
        placeholder="添加详细描述..."
      ></textarea>
    </div>

    <!-- 按钮 -->
    <div class="form-actions">
      <button class="save-btn" @click="saveTodo">保存</button>
      <button class="cancel-btn" @click="$emit('cancel')">取消</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'TodoForm',
  props: {
    todo: Object,
    groups: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    tagColors: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        text: '',
        deadline: '',
        group: '',
        tags: [],
        description: '',
      },
      selectedTag: '',
    };
  },
  created() {
    if (this.todo) {
      this.formData = { ...this.todo };
      if (!Array.isArray(this.formData.tags)) {
        this.formData.tags = [];
      }
    }
  },
  methods: {
    saveTodo() {
      if (!this.formData || !this.formData.text) {
        alert('请输入标题！');
        return;
      }
      // 检查标题不为空
      if (!this.formData.text.trim()) {
        alert('请输入标题！');
        return;
      }
      // 发送表单数据
      this.$emit('save', {
        ...this.formData
      });
    },
    removeTag(tag) {
      this.formData.tags = this.formData.tags.filter((t) => t !== tag);
    },
    getTagColor(tag) {
      return this.tagColors[tag] || '#666666';
    },
  },
  watch: {
    selectedTag(tag) {
      if (tag && !this.formData.tags.includes(tag)) {
        this.formData.tags.push(tag);
        this.selectedTag = '';
      }
    },
  },
};
</script>

<style scoped>
@import '../assets/base.css';

/* 表单样式 */
.todo-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(255, 153, 153, 0.1);
}

/* 表单组 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #ff9999;
  font-weight: 500;
}

.form-group .tags-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group .tags-input .tag-select {
  margin-bottom: 8px;
}

.form-group .tags-input .selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.form-group .tags-input .selected-tags .remove-tag {
  margin-left: 6px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.form-group .tags-input .selected-tags .remove-tag:hover {
  opacity: 1;
}
</style>
