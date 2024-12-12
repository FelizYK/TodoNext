import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../src/components/TodoList.vue';
import TodoForm from '../src/components/TodoForm.vue';

describe('Todo Integration Tests', () => {
    let wrapper;
    let localStorage;

    beforeEach(async () => {
        localStorage = {
            store: {},
            getItem: vi.fn((key) => JSON.stringify(this.store[key] || '[]')),
            setItem: vi.fn((key, value) => { this.store[key] = value; }),
            clear: vi.fn(() => { this.store = {}; }),
        };
        wrapper = mount(TodoList, {
            global: {
                provide: {
                    localStorage: localStorage
                }
            }
        });
        await wrapper.vm.$nextTick();
        wrapper.vm.todos = []; // 重置 todos 数组
    });

    // 1. 创建待办并保存
    it('should create a todo', async () => {
        // 创建
        await wrapper.find('.create-btn').trigger('click');
        const todoForm = wrapper.findComponent(TodoForm);
        const todoData = {
            text: '测试待办',
            deadline: '2024-12-31T23:59:59',
            group: '工作',
            tags: ['重要'],
            description: '测试描述'
        };
        todoForm.vm.formData = { ...todoData };
        // 保存
        await todoForm.find('.save-btn').trigger('click');
        // 检查
        expect(wrapper.vm.todos).toHaveLength(1);
        expect(wrapper.vm.todos[0].text).toBe('测试待办');
    });

    // 2. 创建待办 - 标题为空
    it('should not create a todo with empty text', async () => {
        // 模拟 alert 函数
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        // 创建
        await wrapper.find('.create-btn').trigger('click');
        const todoForm = wrapper.findComponent(TodoForm);
        const todoData = {
            text: '',
            deadline: '2024-12-31T23:59:59',
            group: '工作',
            tags: ['重要'],
            description: '测试描述'
        };
        todoForm.vm.formData = { ...todoData };
        // 保存
        await todoForm.find('.save-btn').trigger('click');
        // 检查
        expect(wrapper.vm.todos).toHaveLength(0);
        // 恢复 alert 函数的原始实现
        alertSpy.mockRestore();
    });
});
