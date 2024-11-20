const CategoriesPanel = {
    props: {
        groups: Array,
        tags: Array,
        tagColors: Object
    },
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
        
        trackGroupRename(index, newValue) {
            const oldValue = this.originalGroups[index]
            if (oldValue && oldValue !== newValue) {
                this.renamedGroups[oldValue] = newValue
            }
        },

        trackTagRename(index, newValue) {
            const oldValue = this.originalTags[index]?.name
            if (oldValue && oldValue !== newValue) {
                this.renamedTags[oldValue] = newValue
            }
        },

        saveAndClose() {
            this.isSaving = true

            // 更新分组
            this.$emit('update-groups', [...this.editingGroups], this.renamedGroups)
            
            // 更新标签和颜色
            const tags = this.editingTags.map(t => t.name)
            const colors = this.editingTags.reduce((acc, t) => {
                acc[t.name] = t.color
                return acc
            }, {})
            
            this.$emit('update-tags', { 
                tags, 
                colors,
                renamedTags: this.renamedTags
            })

            setTimeout(() => {
                this.isSaving = false
                this.$emit('close')
            }, 300)
        },

        cancel() {
            this.$emit('close')
        }
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
                    <button @click="addGroup">添加分组</button>
                </div>
                
                <div class="items-list">
                    <div v-for="(group, index) in editingGroups" 
                         :key="index"
                         class="item">
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
                    <button @click="addTag">添加标签</button>
                </div>
                
                <div class="items-list">
                    <div v-for="(tag, index) in editingTags" 
                         :key="index"
                         class="item">
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

            <div class="categories-actions">
                <button 
                    class="primary save-btn" 
                    @click="saveAndClose"
                    :disabled="isSaving"
                >
                    <span v-if="!isSaving">保存</span>
                    <span v-else>✓</span>
                </button>
                <button 
                    class="cancel" 
                    @click="cancel"
                    :disabled="isSaving"
                >
                    取消
                </button>
            </div>
        </div>
    `
}
