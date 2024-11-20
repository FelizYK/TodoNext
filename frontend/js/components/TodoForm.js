const TodoForm = {
    props: {
        todo: Object,
        isEditing: Boolean
    },
    template: `
        <form class="todo-form" @submit.prevent="saveTodo">
            <div class="form-group">
                <label>标题</label>
                <input 
                    type="text"
                    v-model="formData.text" 
                    placeholder="待办事项标题..."
                    required
                >
            </div>

            <div class="form-group">
                <label>截止日期</label>
                <input 
                    type="datetime-local"
                    v-model="formData.deadline"
                >
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
                    <select v-model="selectedTag">
                        <option value="">添加标签...</option>
                        <option v-for="tag in availableTags" :value="tag">{{ tag }}</option>
                    </select>
                    <div class="selected-tags">
                        <span 
                            v-for="tag in formData.tags" 
                            class="tag"
                            @click="removeTag(tag)"
                        >
                            {{ tag }} ×
                        </span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>详细描述</label>
                <textarea 
                    v-model="formData.description"
                    placeholder="详细描述..."
                    rows="5"
                ></textarea>
            </div>

            <div class="form-actions">
                <button type="submit">{{ isEditing ? '保存' : '创建' }}</button>
                <button type="button" class="cancel" @click="$emit('cancel')">取消</button>
            </div>
        </form>
    `,
    data() {
        return {
            formData: {
                text: '',
                deadline: '',
                group: '',
                tags: [],
                description: ''
            },
            selectedTag: '',
            groups: ['工作', '学习', '生活', '其他'],
            availableTags: ['重要', '工作', '个人', '学习']
        }
    },
    created() {
        if (this.todo) {
            this.formData = { ...this.todo }
        }
    },
    methods: {
        saveTodo() {
            this.$emit('save', { ...this.formData })
        },
        removeTag(tag) {
            this.formData.tags = this.formData.tags.filter(t => t !== tag)
        }
    },
    watch: {
        selectedTag(tag) {
            if (tag && !this.formData.tags.includes(tag)) {
                this.formData.tags.push(tag)
                this.selectedTag = ''
            }
        },
        todo: {
            handler(newTodo) {
                if (newTodo) {
                    this.formData = { ...newTodo }
                }
            },
            deep: true
        }
    }
}
