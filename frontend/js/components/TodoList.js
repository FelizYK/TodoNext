const TodoList = {
    template: `
        <div class="container">
            <div class="header">
                <h1>待办事项</h1>
                <button @click="showCreateModal = true">创建待办</button>
            </div>

            <!-- 筛选器 -->
            <div class="filters">
                <select v-model="currentGroup">
                    <option value="">所有分组</option>
                    <option v-for="group in groups" :value="group">{{ group }}</option>
                </select>
                <select v-model="currentFilter">
                    <option value="all">全部</option>
                    <option value="active">未完成</option>
                    <option value="completed">已完成</option>
                </select>
            </div>

            <!-- 待办列表 -->
            <todo-item
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
                @view="viewTodo"
                @delete="deleteTodo"
                @edit="editTodo"
            ></todo-item>

            <!-- 创建待办模态框 -->
            <modal 
                :show="showCreateModal" 
                :title="isEditing ? '编辑待办' : '创建待办'"
                @close="closeCreateModal"
            >
                <todo-form
                    :todo="currentTodo"
                    :is-editing="isEditing"
                    @save="saveTodo"
                    @cancel="closeCreateModal"
                />
            </modal>

            <!-- 查看详情模态框 -->
            <modal 
                :show="showViewModal" 
                title="待办详情"
                @close="closeViewModal"
            >
                <div class="todo-detail" v-if="currentTodo">
                    <h3>{{ currentTodo.text }}</h3>
                    <div class="detail-info">
                        <p><strong>截止日期：</strong>{{ formatDeadline(currentTodo.deadline) }}</p>
                        <p><strong>分组：</strong>{{ currentTodo.group || '无' }}</p>
                        <p><strong>标签：</strong>
                            <span 
                                v-for="tag in currentTodo.tags" 
                                class="tag"
                                :style="{ backgroundColor: getTagColor(tag) }"
                            >
                                {{ tag }}
                            </span>
                        </p>
                        <p><strong>描述：</strong></p>
                        <p class="description">{{ currentTodo.description || '无' }}</p>
                    </div>
                    <div class="detail-actions">
                        <button @click="editTodo(currentTodo)">编辑</button>
                        <button class="delete" @click="deleteTodo(currentTodo.id)">删除</button>
                    </div>
                </div>
            </modal>
        </div>
    `,
    data() {
        return {
            todos: [],
            currentTodo: null,
            showCreateModal: false,
            showViewModal: false,
            isEditing: false,
            selectedTag: '',
            currentGroup: '',
            currentFilter: 'all',
            groups: ['工作', '学习', '生活', '其他'],
            availableTags: ['重要', '工作', '个人', '学习']
        }
    },
    computed: {
        filteredTodos() {
            return this.todos
                .filter(todo => {
                    if (this.currentGroup && todo.group !== this.currentGroup) return false
                    if (this.currentFilter === 'active') return !todo.completed
                    if (this.currentFilter === 'completed') return todo.completed
                    return true
                })
                .sort((a, b) => {
                    if (a.deadline && b.deadline) {
                        return new Date(a.deadline) - new Date(b.deadline)
                    }
                    return b.id - a.id
                })
        }
    },
    methods: {
        saveTodo(formData) {
            if (this.isEditing) {
                const index = this.todos.findIndex(t => t.id === this.currentTodo.id)
                if (index !== -1) {
                    this.todos[index] = {
                        ...this.todos[index],
                        ...formData
                    }
                }
            } else {
                this.todos.push({
                    id: Date.now(),
                    completed: false,
                    ...formData
                })
            }
            this.closeCreateModal()
            
            console.log('保存成功：', this.todos)
        },
        viewTodo(todo) {
            this.currentTodo = todo
            this.showViewModal = true
        },
        editTodo(todo) {
            this.currentTodo = todo
            this.isEditing = true
            this.showViewModal = false
            this.showCreateModal = true
        },
        deleteTodo(id) {
            this.todos = this.todos.filter(todo => todo.id !== id)
            this.closeViewModal()
        },
        closeCreateModal() {
            this.showCreateModal = false
            this.currentTodo = null
            this.isEditing = false
        },
        closeViewModal() {
            this.showViewModal = false
            this.currentTodo = null
        },
        formatDeadline(deadline) {
            if (!deadline) return '无'
            return new Date(deadline).toLocaleString('zh-CN')
        },
        getTagColor(tag) {
            const colors = {
                '重要': '#ff4d4f',
                '工作': '#1890ff',
                '个人': '#52c41a',
                '学习': '#722ed1'
            }
            return colors[tag] || '#666'
        }
    },
    watch: {
        selectedTag(tag) {
            if (tag && !this.todoForm.tags.includes(tag)) {
                this.todoForm.tags.push(tag)
                this.selectedTag = ''
            }
        }
    }
}
