import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoForm from '../../src/components/TodoForm.vue';

describe('Todo Form Tests', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(TodoForm, {
            props: {
                todo: null,
                groups: ['工作', '学习', '生活', '其他'],
                tags: ['重要', '长期'],
                tagColors: {
                    '重要': '#ff4d4f',
                    '长期': '#1890ff',
                },
            },
        });
        await wrapper.vm.$nextTick();
    });

    // 1. 测试初始状态
    it('should initialize with default state', () => {
        expect(wrapper.vm.formData).toEqual({
            text: '',
            deadline: '',
            group: '',
            tags: [],
            description: '',
        });
        expect(wrapper.vm.selectedTag).toBe('');
    });

    // 2. 测试保存按钮
    it('should call saveTodo when save button is clicked', async () => {
        const todoData = {
            text: '测试待办',
            deadline: '2024-12-31T23:59:59',
            group: '工作',
            tags: ['重要'],
            description: '测试描述'
        };
        wrapper.vm.formData = { ...todoData };
        // 监听 saveTodo 函数
        const saveTodoSpy = vi.spyOn(wrapper.vm, 'saveTodo');
        // 点击保存按钮
        const saveButton = wrapper.find('.save-btn');
        expect(saveButton.exists()).toBe(true);
        await saveButton.trigger('click');
        // 验证 saveTodo 函数被调用
        expect(saveTodoSpy).toHaveBeenCalled();
    });

    // 3. 测试保存待办
    it('should emit save event with correct data when saveTodo is called', async () => {
        const todoData = {
            text: '测试待办',
            deadline: '2024-12-31T23:59:59',
            group: '工作',
            tags: ['重要'],
            description: '测试描述'
        };
        wrapper.vm.formData = { ...todoData };
        await wrapper.vm.saveTodo();
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')[0]).toEqual([todoData]);
    });

    // 4. 测试取消按钮
    it('should emit cancel event when cancel button is clicked', async () => {
        await wrapper.find('.cancel-btn').trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    // 5. 测试空标题
    it('should alert when text is empty', async () => {
        // 设置空标题
        wrapper.vm.formData.text = '';
        // 模拟 alert 函数
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        // 调用 saveTodo 函数
        await wrapper.vm.saveTodo();
        // 验证 alert 函数被调用
        expect(alertSpy).toHaveBeenCalledWith('请输入标题！');
        // 恢复 alert 函数的原始实现
        alertSpy.mockRestore();
    });

    // 6. 测试添加标签
    it('should add selected tag to formData.tags', async () => {
        // 添加标签
        wrapper.vm.selectedTag = '重要';
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.formData.tags).toContain('重要');
        // 再次添加相同标签
        wrapper.vm.selectedTag = '重要';
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.formData.tags).toHaveLength(1);
    });

    // 7. 测试移除标签
    it('should call removeTag method when tag is clicked', async () => {
        wrapper.vm.formData.tags = ['重要', '长期'];
        await wrapper.vm.$nextTick();
        // 监听 removeTag 函数
        const removeTagSpy = vi.spyOn(wrapper.vm, 'removeTag');
        // 点击标签
        await wrapper.find('.tag').trigger('click');
        // 验证 removeTag 函数被调用
        expect(removeTagSpy).toHaveBeenCalledWith('重要');
        expect(wrapper.vm.formData.tags).toHaveLength(1);
        expect(wrapper.vm.formData.tags).toEqual(['长期']);
    });
});
