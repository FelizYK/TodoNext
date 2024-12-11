<template>
  <div class="container">
    <div class="header">
      <h1>待办事项</h1>
      <div class="header-actions">
        <button
          class="view-toggle"
          @click="viewMode = viewMode === 'list' ? 'calendar' : 'list'"
        >
          {{ viewMode === 'list' ? '📅 月历视图' : '📝 列表视图' }}
        </button>
        <button class="categories-btn" @click="showCategoriesModal = true">
          ⚙️ 管理分类
        </button>
        <button class="create-btn" @click="showCreateModal = true">
          ✏️ 创建待办
        </button>
      </div>
    </div>

    <!-- 列表视图 -->
    <template v-if="viewMode === 'list'">
      <!-- 筛选器 -->
      <div class="filters">
        <div class="filter-completed">
          <button
            :class="{ active: currentFilter === 'all' }"
            @click="setFilter('all')"
          >
            全部
          </button>
          <button
            :class="{ active: currentFilter === 'active' }"
            @click="setFilter('active')"
          >
            未完成
          </button>
          <button
            :class="{ active: currentFilter === 'completed' }"
            @click="setFilter('completed')"
          >
            已完成
          </button>
        </div>

        <div class="filter-group">
          <select v-model="currentGroup">
            <option value="">所有分组</option>
            <option v-for="group in groups" :value="group">
              {{ group }}
            </option>
          </select>
        </div>
      </div>

      <!-- 待办列表 -->
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        :tag-colors="tagColors"
        @view="viewTodo"
        @toggle="toggleTodo"
        @delete="deleteTodo"
      ></todo-item>
    </template>

    <!-- 月历视图 -->
    <calendar-view v-else :todos="todos" @view="viewTodo"></calendar-view>

    <!-- 管理分类模态框 -->
    <modal
      :show="showCategoriesModal"
      title="管理分类"
      @close="showCategoriesModal = false"
    >
      <categories-panel
        :groups="groups"
        :tags="tags"
        :tag-colors="tagColors"
        @update-groups="updateGroups"
        @update-tags="updateTags"
        @close="showCategoriesModal = false"
      />
    </modal>

    <!-- 创建待办模态框 -->
    <modal :show="showCreateModal" title="创建待办" @close="closeCreateModal">
      <todo-form
        :todo="null"
        :groups="groups"
        :tags="tags"
        :tag-colors="tagColors"
        @save="saveTodo"
        @cancel="closeCreateModal"
      />
    </modal>

    <!-- 详情/编辑模态框 -->
    <modal
      :show="showViewModal"
      :title="currentTodo ? currentTodo.text : ''"
      @close="closeViewModal"
    >
      <todo-form
        v-if="currentTodo"
        :todo="currentTodo"
        :groups="groups"
        :tags="tags"
        :tag-colors="tagColors"
        @save="saveTodo"
        @cancel="closeViewModal"
      />
    </modal>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue';
import CalendarView from './CalendarView.vue';
import Modal from './Modal.vue';
import CategoriesPanel from './CategoriesPanel.vue';
import TodoForm from './TodoForm.vue';

export default {
  name: 'TodoList',
  components: {
    TodoItem,
    CalendarView,
    Modal,
    CategoriesPanel,
    TodoForm,
  },
  data() {
    return {
      todos: JSON.parse(localStorage.getItem('todos') || '[]'),
      groups: JSON.parse(
        localStorage.getItem('groups') || '["工作", "学习", "生活", "其他"]'
      ),
      tags: JSON.parse(localStorage.getItem('tags') || '["重要", "长期"]'),
      tagColors: JSON.parse(
        localStorage.getItem('tagColors') ||
          '{"重要":"#ff4d4f","长期":"#1890ff"}'
      ),
      currentTodo: null,
      // modal
      showCreateModal: false,
      showViewModal: false,
      showCategoriesModal: false,
      // filter
      currentFilter: 'all',
      currentGroup: '',
      // view
      viewMode: 'list', // 'list' 或 'calendar'
    };
  },
  computed: {
    filteredTodos() {
      // 首先按完成状态筛选
      let result = this.todos.filter((todo) => {
        if (this.currentFilter === 'completed') {
          return todo.completed;
        } else if (this.currentFilter === 'active') {
          return !todo.completed;
        }
        return true; // 'all' 状态返回所有待办
      });

      // 然后按分组筛选
      if (this.currentGroup) {
        result = result.filter((todo) => todo.group === this.currentGroup);
      }

      return result;
    },
  },
  methods: {
    // todo
    saveTodo(formData) {
      if (this.currentTodo) {
        // 编辑现有待办
        const index = this.todos.findIndex((t) => t.id === this.currentTodo.id);
        if (index !== -1) {
          this.todos[index] = {
            ...this.todos[index],
            ...formData,
          };
        }
      } else {
        // 创建新待办
        this.todos.push({
          id: Date.now(),
          completed: false,
          ...formData,
        });
      }

      // 关闭所有模态框
      this.closeViewModal();
      this.closeCreateModal();
    },
    viewTodo(todo) {
      this.currentTodo = { ...todo };
      this.showViewModal = true;
    },
    deleteTodo(todo) {
      const index = this.todos.findIndex((t) => t.id === todo.id);
      if (index !== -1) {
        this.todos.splice(index, 1);
      }
    },
    toggleTodo(todo) {
      const index = this.todos.findIndex((t) => t.id === todo.id);
      if (index !== -1) {
        // 切换完成状态
        this.todos[index].completed = !this.todos[index].completed;
      }
    },
    // modal
    closeCreateModal() {
      this.showCreateModal = false;
      this.currentTodo = null;
    },
    closeViewModal() {
      this.showViewModal = false;
      this.currentTodo = null;
    },
    // group & tag
    addGroup(group) {
      if (!this.groups.includes(group)) {
        this.groups.push(group);
      }
    },
    addTag(tag, color) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
      if (color) {
        this.tagColors[tag] = color;
      }
    },
    updateGroups(newGroups, renamedGroups) {
      // 保存新的分组列表
      this.groups = [...newGroups];

      // 更新所有任务的分组
      this.todos = this.todos.map((todo) => {
        if (!todo.group) return todo;
        // 如果是重命名的分组，更新为新名称
        if (renamedGroups[todo.group]) {
          return {
            ...todo,
            group: renamedGroups[todo.group],
          };
        }
        // 如果分组被删除，将分组设为空
        if (!newGroups.includes(todo.group)) {
          return {
            ...todo,
            group: '',
          };
        }

        return todo;
      });
    },
    updateTags({ tags, colors, renamedTags }) {
      // 保存新的标签和颜色
      this.tags = [...tags];
      this.tagColors = { ...colors };

      // 更新所有任务的标签
      this.todos = this.todos.map((todo) => {
        if (!todo.tags) todo.tags = [];
        // 更新任务的所有标签
        const updatedTags = todo.tags
          .map((tag) => {
            // 如果是重命名的标签，使用新名称
            if (renamedTags[tag]) {
              return renamedTags[tag];
            }
            // 如果标签还存在，保留原名称
            if (tags.includes(tag)) {
              return tag;
            }
            // 标签被删除的情况会被过滤掉
            return null;
          })
          .filter((tag) => tag !== null);

        return {
          ...todo,
          tags: updatedTags,
        };
      });
    },
    // filter
    setFilter(filter) {
      this.currentFilter = filter;
    },
    setGroup(group) {
      this.currentGroup = group;
    },
  },
  watch: {
    todos: {
      handler(newTodos) {
        localStorage.setItem('todos', JSON.stringify(newTodos));
      },
      deep: true,
    },
    groups: {
      handler(newGroups) {
        localStorage.setItem('groups', JSON.stringify(newGroups));
      },
      deep: true,
    },
    tags: {
      handler(newTags) {
        localStorage.setItem('tags', JSON.stringify(newTags));
      },
      deep: true,
    },
    tagColors: {
      handler(newColors) {
        localStorage.setItem('tagColors', JSON.stringify(newColors));
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 34px;
  font-weight: bold;
  color: #ff6666;
  border-bottom: 2px solid #ffe5e5;
}

/* 头部按钮 */
.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 视图切换按钮 */
.view-toggle {
  background-color: #b19cd9;
  color: white;
}

.view-toggle:hover {
  background-color: #c5b3e6;
  box-shadow: 0 2px 8px rgba(177, 156, 217, 0.3);
}

/* 管理分类按钮 */
.categories-btn {
  background-color: #95d5b2;
  color: white;
}

.categories-btn:hover {
  background-color: #b7e4c7;
  box-shadow: 0 2px 8px rgba(149, 213, 178, 0.3);
}

/* 创建待办按钮 */
.create-btn {
  background-color: #ff9999;
  color: white;
}

.create-btn:hover {
  background-color: #ffb3b3;
  box-shadow: 0 2px 8px rgba(255, 153, 153, 0.3);
}

/* filter */
.filters {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-completed {
  display: flex;
  gap: 10px;
}

.filter-completed button {
  padding: 6px 12px;
  border: 1px solid #ffe6d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #ff9966;
  transition: all 0.3s ease;
}

.filter-completed button:hover {
  border-color: #ffb088;
  color: #ff8547;
  background-color: #fff5f0;
}

.filter-completed button.active {
  background: #ff9966;
  border-color: #ff9966;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 153, 102, 0.2);
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid #ffe6d9;
  border-radius: 4px;
  color: #ff9966;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-group select:hover {
  border-color: #ffb088;
  background-color: #fff5f0;
}

.filter-group select:focus {
  border-color: #ff9966;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.2);
}
</style>
