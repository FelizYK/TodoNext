const TodoItem = {
    props: ['todo'],
    template: `
        <div class="todo-item" @click="$emit('view', todo)">
            <div class="todo-main">
                <input 
                    type="checkbox" 
                    v-model="todo.completed"
                    @click.stop
                >
                <div class="todo-content">
                    <div class="todo-header">
                        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
                        <div class="todo-tags">
                            <span 
                                v-for="tag in todo.tags" 
                                class="tag"
                                :style="{ backgroundColor: getTagColor(tag) }"
                            >
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                    <div class="todo-info">
                        <span class="group" v-if="todo.group">📁 {{ todo.group }}</span>
                        <span class="deadline" :class="{ 'deadline-near': isDeadlineNear }">
                            ⏰ {{ formatDeadline }}
                        </span>
                    </div>
                    <div class="todo-description" v-if="todo.description">
                        {{ todo.description }}
                    </div>
                </div>
            </div>
            <div class="todo-actions">
                <button @click="$emit('edit', todo)">编辑</button>
                <button class="delete" @click="$emit('delete', todo.id)">删除</button>
            </div>
        </div>
    `,
    computed: {
        formatDeadline() {
            if (!this.todo.deadline) return '无截止日期'
            return new Date(this.todo.deadline).toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        isDeadlineNear() {
            if (!this.todo.deadline) return false
            const deadline = new Date(this.todo.deadline)
            const now = new Date()
            const diff = deadline - now
            return diff > 0 && diff < 24 * 60 * 60 * 1000 // 24小时内
        }
    },
    methods: {
        getTagColor(tag) {
            // 简单的标签颜色映射
            const colors = {
                '重要': '#ff4d4f',
                '工作': '#1890ff',
                '个人': '#52c41a',
                '学习': '#722ed1'
            }
            return colors[tag] || '#666'
        }
    }
}
