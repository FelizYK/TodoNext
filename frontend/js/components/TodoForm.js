const TodoForm = {
    props: {
        todo: Object,
        isEditing: Boolean,
        tagColors: {
            type: Object,
            default: () => ({})
        },
        groups: {
            type: Array,
            default: () => []
        },
        availableTags: {
            type: Array,
            default: () => []
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
                <div class="group-input">
                    <select v-model="formData.group">
                        <option value="">选择分组...</option>
                        <option v-for="group in groups" :value="group">{{ group }}</option>
                        <option value="__new__">+ 创建新分组</option>
                    </select>
                    <!-- 新分组输入框 -->
                    <div v-if="showNewGroupInput" class="new-input-container">
                        <input 
                            type="text"
                            v-model="newGroup"
                            placeholder="输入新分组名称"
                            @keyup.enter="addNewGroup"
                        >
                        <button type="button" @click="addNewGroup">添加</button>
                        <button type="button" class="cancel" @click="cancelNewGroup">取消</button>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>标签</label>
                <div class="tags-input">
                    <div class="tag-select">
                        <select v-model="selectedTag">
                            <option value="">选择标签...</option>
                            <option v-for="tag in availableTags" :value="tag">{{ tag }}</option>
                            <option value="__new__">+ 创建新标签</option>
                        </select>
                        <!-- 新标签输入框 -->
                        <div v-if="showNewTagInput" class="new-input-container">
                            <input 
                                type="text"
                                v-model="newTag"
                                placeholder="输入新标签名称"
                                @keyup.enter="addNewTag"
                            >
                            <input 
                                type="color"
                                v-model="newTagColor"
                                title="选择标签颜色"
                            >
                            <button type="button" @click="addNewTag">添加</button>
                            <button type="button" class="cancel" @click="cancelNewTag">取消</button>
                        </div>
                    </div>
                    <div class="selected-tags">
                        <span 
                            v-for="tag in formData.tags" 
                            class="tag"
                            :style="{ backgroundColor: getTagColor(tag) }"
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
                <button type="button" @click="saveTodo">{{ isEditing ? '保存' : '创建' }}</button>
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
            newTag: '',
            newTagColor: '#666666',
            newGroup: '',
            showNewTagInput: false,
            showNewGroupInput: false,
            newTags: []
        }
    },
    methods: {
        addNewTag() {
            if (!this.newTag.trim()) return
            
            // 发送新标签到父组件
            this.$emit('add-tag', this.newTag, this.newTagColor)
            
            // 记录新标签
            this.newTags.push({
                tag: this.newTag,
                color: this.newTagColor
            })
            
            // 添加到当前待办
            if (!this.formData.tags.includes(this.newTag)) {
                this.formData.tags.push(this.newTag)
            }
            
            // 重置输入
            this.newTag = ''
            this.showNewTagInput = false
        },
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
        addNewGroup() {
            if (!this.newGroup.trim()) return
            
            // 发送新分组到父组件
            this.$emit('add-group', this.newGroup)
            
            // 设置当前分组
            this.formData.group = this.newGroup
            
            // 重置输入
            this.newGroup = ''
            this.showNewGroupInput = false
        },
        cancelNewGroup() {
            this.newGroup = ''
            this.showNewGroupInput = false
            this.formData.group = ''
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
    },
    created() {
        if (this.todo) {
            this.formData = { ...this.todo }
            if (!Array.isArray(this.formData.tags)) {
                this.formData.tags = []
            }
        }
    }
}
