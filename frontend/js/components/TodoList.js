const TodoList = {
    template: `
        <div class="container">
            <div class="header">
                <h1>待办事项</h1>
                <div class="header-actions">
                    <button @click="showSettingsModal = true" class="settings-btn">
                        ⚙️ 设置
                    </button>
                    <button @click="showCreateModal = true">创建待办</button>
                </div>
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
                :tag-colors="tagColors"
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
                    :tag-colors="tagColors"
                    :groups="groups"
                    :available-tags="availableTags"
                    @save="saveTodo"
                    @add-tag="addTag"
                    @add-group="addGroup"
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

            <!-- 设置模态框 -->
            <modal 
                :show="showSettingsModal" 
                title="设置"
                @close="showSettingsModal = false"
            >
                <settings-panel
                    :groups="groups"
                    :available-tags="availableTags"
                    :tag-colors="tagColors"
                    @update-groups="updateGroups"
                    @update-tags="updateTags"
                    @close="showSettingsModal = false"
                />
            </modal>
        </div>
    `,
    data() {
        return {
            todos: JSON.parse(localStorage.getItem('todos') || '[]'),
            groups: JSON.parse(localStorage.getItem('groups') || '["工作", "学习", "生活", "其他"]'),
            availableTags: JSON.parse(localStorage.getItem('availableTags') || '["重要", "工作", "个人", "学习"]'),
            tagColors: JSON.parse(localStorage.getItem('tagColors') || '{"重要":"#ff4d4f","工作":"#1890ff","个人":"#52c41a","学习":"#722ed1"}'),
            currentTodo: null,
            showCreateModal: false,
            showViewModal: false,
            isEditing: false,
            currentGroup: '',
            currentFilter: 'all',
            showSettingsModal: false
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
        addTag(tag, color) {
            if (!this.availableTags.includes(tag)) {
                this.availableTags.push(tag)
            }
            if (color) {
                this.tagColors[tag] = color
            }
        },
        addGroup(group) {
            if (!this.groups.includes(group)) {
                this.groups.push(group)
            }
        },
        saveTodo(formData) {
            if (formData.newTags) {
                formData.newTags.forEach(({tag, color}) => {
                    this.addTag(tag, color)
                })
            }
            
            if (formData.group && !this.groups.includes(formData.group)) {
                this.groups.push(formData.group)
            }

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
            return this.tagColors[tag] || '#666666'
        },
        updateGroups(newGroups, renamedGroups = {}) {
            // 保存新的分组列表
            this.groups = [...newGroups]
            
            // 更新所有任务的分组
            this.todos = this.todos.map(todo => {
                if (!todo.group) return todo
                
                // 如果是重命名的分组，更新为新名称
                if (renamedGroups[todo.group]) {
                    return {
                        ...todo,
                        group: renamedGroups[todo.group]
                    }
                }
                
                // 如果分组被删除，将分组设为空
                if (!newGroups.includes(todo.group)) {
                    return {
                        ...todo,
                        group: ''
                    }
                }
                
                return todo
            })
        },
        
        updateTags({ tags, colors, renamedTags = {} }) {
            // 保存新的标签和颜色
            this.availableTags = [...tags]
            this.tagColors = { ...colors }
            
            // 更新所有任务的标签
            this.todos = this.todos.map(todo => {
                if (!todo.tags) {
                    todo.tags = []
                }
                
                // 更新标签名称
                const updatedTags = todo.tags.map(tag => {
                    // 如果是重命名的标签，使用新名称
                    if (renamedTags[tag]) {
                        return renamedTags[tag]
                    }
                    // 如果标签还存在，保留原名称
                    if (tags.includes(tag)) {
                        return tag
                    }
                    // 标签被删除的情况会被过滤掉
                    return null
                }).filter(tag => tag !== null)
                
                return {
                    ...todo,
                    tags: updatedTags
                }
            })
        },

        // 可选：添加一个方法来显示更改提示
        showUpdateNotification() {
            // 如果你想添加一个提示，可以使用这个方法
            const notification = document.createElement('div')
            notification.className = 'notification'
            notification.textContent = '已更新相关任务'
            document.body.appendChild(notification)
            
            setTimeout(() => {
                notification.classList.add('fade-out')
                setTimeout(() => {
                    document.body.removeChild(notification)
                }, 300)
            }, 2000)
        }
    },
    watch: {
        todos: {
            handler(newTodos) {
                localStorage.setItem('todos', JSON.stringify(newTodos))
            },
            deep: true
        },
        groups: {
            handler(newGroups) {
                localStorage.setItem('groups', JSON.stringify(newGroups))
            },
            deep: true
        },
        availableTags: {
            handler(newTags) {
                localStorage.setItem('availableTags', JSON.stringify(newTags))
            },
            deep: true
        },
        tagColors: {
            handler(newColors) {
                localStorage.setItem('tagColors', JSON.stringify(newColors))
            },
            deep: true
        }
    }
}
