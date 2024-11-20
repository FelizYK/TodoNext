const TodoForm = {
    props: {
        todo: Object,
        groups: {
            type: Array,
            default: () => []
        },
        tags: {
            type: Array,
            default: () => []
        },
        tagColors: {
            type: Object,
            default: () => ({})
        }
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
                <select 
                    v-model="formData.group"
                >
                    <option value="">选择分组...</option>
                    <option v-for="group in groups" :value="group">{{ group }}</option>
                </select>
            </div>

            <div class="form-group">
                <label>标签</label>
                <div class="tags-input">
                    <div class="tag-select">
                        <select 
                            v-model="selectedTag"
                        >
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
                <button type="submit" class="save-btn">保存</button>
                <button type="button" class="cancel-btn" @click="$emit('cancel')">取消</button>
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
            newTag: '',
            newTagColor: '#666666',
            newGroup: '',
            showNewTagInput: false,
            showNewGroupInput: false,
            newTags: []
        }
    },
    created() {
        if (this.todo) {
            this.formData = { ...this.todo }
            if (!Array.isArray(this.formData.tags)) {
                this.formData.tags = []
            }
        }
    },
    methods: {
        saveTodo() {
            if (!this.formData.text.trim()) {
                alert('请输入标题！')
                return
            }
            if (!Array.isArray(this.formData.tags)) {
                this.formData.tags = []
            }
            // 发送表单数据和新标签信息
            this.$emit('save', { 
                ...this.formData,
                newTags: this.newTags
            })
        },
        removeTag(tag) {
            this.formData.tags = this.formData.tags.filter(t => t !== tag)
        },
        getTagColor(tag) {
            return this.tagColors[tag] || '#666666'
        }
    },
    watch: {
        selectedTag(tag) {
            if (tag === '__new__') {
                this.showNewTagInput = true
                this.selectedTag = ''
            } else if (tag && !this.formData.tags.includes(tag)) {
                this.formData.tags.push(tag)
                this.selectedTag = ''
            }
        },
        'formData.group'(group) {
            if (group === '__new__') {
                this.showNewGroupInput = true
                this.formData.group = ''
            }
        }
    }
}
