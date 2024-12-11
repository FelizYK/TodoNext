<template>
  <div class="todo-item" @click="$emit('view', todo)">
    <div class="todo-main">
      <button
        class="complete-btn"
        :class="{ completed: todo.completed }"
        @click.stop="$emit('toggle', todo)"
        :title="todo.completed ? '标记为未完成' : '标记为已完成'"
      >
        ✔
      </button>

      <div class="todo-content" :class="{ completed: todo.completed }">
        <div class="todo-header">
          <span class="todo-text">
            {{ todo.text }}
          </span>
          <div>
            <span
              v-for="tag in todo.tags"
              class="tag"
              :style="{ backgroundColor: getTagColor(tag) }"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div>
          <span v-if="todo.group" class="todo-group">
            📁 {{ todo.group }}
          </span>
          <span v-if="todo.deadline" class="todo-deadline">
            ⏰ 截止: {{ formatDate(todo.deadline) }}
          </span>
        </div>
      </div>
    </div>

    <button class="delete-btn" @click.stop="confirmDelete" title="删除">
      ✖
    </button>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: Object,
    tagColors: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d.getDate()).padStart(2, '0')} ${String(
        d.getHours()
      ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },
    getTagColor(tag) {
      return this.tagColors[tag] || '#666666';
    },
    confirmDelete() {
      if (confirm('确定要删除这个待办事项吗？')) {
        this.$emit('delete', this.todo);
      }
    },
  },
};
</script>

<style scoped>
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.todo-item:hover {
  border-color: #e6f7ff;
  background-color: #f0f7ff;
}

.todo-main {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;
}

.todo-content {
  flex: 1;
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: white;
  margin-right: 5px;
  cursor: pointer;
}

.todo-group {
  display: inline-flex;
  align-items: center;
  color: #666;
}

.todo-deadline {
  display: inline-flex;
  align-items: center;
  color: #ff7875;
}

.todo-content.completed {
  opacity: 0.5;
}

.todo-content.completed .todo-text,
.todo-content.completed .todo-group,
.todo-content.completed .todo-deadline {
  color: #999;
}

/* 完成按钮 */
.complete-btn {
  padding: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  border: 2px solid #e8e8e8;
  color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.complete-btn:hover {
  border-color: #52c41a;
  color: #52c41a;
  background: transparent;
}

.complete-btn.completed {
  background-color: #52c41a;
  border-color: #52c41a;
  color: white;
  box-shadow: 0 2px 4px rgba(82, 196, 26, 0.2);
}

/* 删除按钮 */
.delete-btn {
  background: transparent;
  border: none;
  color: #bfbfbf;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background-color: #ff4d4f;
  color: white;
}
</style>
