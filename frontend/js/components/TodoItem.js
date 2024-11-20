const TodoItem = {
    props: {
        todo: Object,
        tagColors: {
            type: Object,
            default: () => ({})
        }
    },
    template: `
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
            <button 
                class="delete-btn" 
                @click.stop="confirmDelete"
                title="删除"
            >
                ✖
            </button>
        </div>
    `,
    methods: {
        formatDate(date) {
            if (!date) return ''
            const d = new Date(date)
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        },
        getTagColor(tag) {
            return this.tagColors[tag] || '#666666'
        },
        confirmDelete() {
            if (confirm('确定要删除这个待办事项吗？')) {
                this.$emit('delete', this.todo)
            }
        }
    }
}
