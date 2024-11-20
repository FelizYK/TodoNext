const CategoriesPanel = {
    props: {
        groups: Array,
        tags: Array,
        tagColors: Object
    },
    template: `
        <div class="categories-panel">
            <div class="categories-tabs">
                <button 
                    :class="{ active: activeTab === 'groups' }"
                    @click="activeTab = 'groups'"
                >
                    分组管理
                </button>
                <button 
                    :class="{ active: activeTab === 'tags' }"
                    @click="activeTab = 'tags'"
                >
                    标签管理
                </button>
            </div>

            <!-- 分组管理 -->
            <div v-if="activeTab === 'groups'" class="categories-content">
                <div class="add-item">
                    <input 
                        v-model="newGroupName"
                        placeholder="新分组名称"
                        @keyup.enter="addGroup"
                    >
                    <button class="create" @click="addGroup">添加</button>
                </div>
                
                <div class="items-list">
                    <div
                        v-for="(group, index) in editingGroups" 
                        :key="index"
                        class="item"
                    >
                        <input 
                            v-model="editingGroups[index]"
                            @input="trackGroupRename(index, editingGroups[index])"
                        >
                        <button class="delete" @click="deleteGroup(index)">删除</button>
                    </div>
                </div>
            </div>

            <!-- 标签管理 -->
            <div v-if="activeTab === 'tags'" class="categories-content">
                <div class="add-item">
                    <input 
                        v-model="newTagName"
                        placeholder="新标签名称"
                    >
                    <input 
                        type="color"
                        v-model="newTagColor"
                    >
                    <button class="create" @click="addTag">添加</button>
                </div>
                
                <div class="items-list">
                    <div
                        v-for="(tag, index) in editingTags" 
                        :key="index"
                        class="item"
                    >
                        <input 
                            v-model="editingTags[index].name"
                            @input="trackTagRename(index, editingTags[index].name)"
                        >
                        <input 
                            type="color"
                            v-model="editingTags[index].color"
                        >
                        <button class="delete" @click="deleteTag(index)">删除</button>
                    </div>
                </div>
            </div>

            <!-- 按钮 -->
            <div class="form-actions">
                <button 
                    class="save-btn" 
                    @click="saveAndClose"
                    :disabled="isSaving"
                >
                    保存
                </button>
                <button 
                    class="cancel-btn" 
                    @click="cancel"
                    :disabled="isSaving"
                >
                    取消
                </button>
            </div>
        </div>
    `,
    data() {
        return {
            editingGroups: [...this.groups],
            editingTags: this.tags.map(tag => ({
                name: tag,
                color: this.tagColors[tag] || '#666666'
            })),
            newGroupName: '',
            newTagName: '',
            newTagColor: '#666666',
            activeTab: 'groups',
            isSaving: false,
            originalGroups: [],
            originalTags: [],
            renamedGroups: {},
            renamedTags: {}
        }
    },
    created() {
        this.originalGroups = [...this.groups]
        this.originalTags = this.tags.map(tag => ({
            name: tag,
            color: this.tagColors[tag]
        }))
    },
    methods: {
        // group
        addGroup() {
            if (!this.newGroupName.trim()) return
            if (this.editingGroups.includes(this.newGroupName)) {
                alert('该分组已存在')
                return
            }
            this.editingGroups.push(this.newGroupName)
            this.newGroupName = ''
        },
        deleteGroup(index) {
            if (confirm('确定要删除这个分组吗？')) {
                this.editingGroups.splice(index, 1)
            }
        },
        trackGroupRename(index, newValue) {
            const oldValue = this.originalGroups[index]
            if (oldValue && oldValue !== newValue) {
                this.renamedGroups[oldValue] = newValue
            }
        },
        // tag
        addTag() {
            if (!this.newTagName.trim()) return
            if (this.editingTags.some(t => t.name === this.newTagName)) {
                alert('该标签已存在')
                return
            }
            this.editingTags.push({
                name: this.newTagName,
                color: this.newTagColor
            })
            this.newTagName = ''
        },
        deleteTag(index) {
            if (confirm('确定要删除这个标签吗？')) {
                this.editingTags.splice(index, 1)
            }
        },
        trackTagRename(index, newValue) {
            const oldValue = this.originalTags[index]?.name
            if (oldValue && oldValue !== newValue) {
                this.renamedTags[oldValue] = newValue
            }
        },
        // save & cancel
        async saveAndClose() {
            this.isSaving = true
            try {
                // 更新分组
                await this.$emit('update-groups', [...this.editingGroups], this.renamedGroups)
                
                // 更新标签和颜色
                const tags = this.editingTags.map(t => t.name)
                const colors = this.editingTags.reduce((acc, t) => {
                    acc[t.name] = t.color
                    return acc
                }, {})
                
                await this.$emit('update-tags', { 
                    tags, 
                    colors,
                    renamedTags: this.renamedTags
                })

                // 确保数据更新完成后再关闭
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // 显式触发关闭事件
                this.$emit('close')
            } catch (error) {
                console.error('保存失败:', error)
            } finally {
                this.isSaving = false
            }
        },
        cancel() {
            this.$emit('close')
        }
    }
}
