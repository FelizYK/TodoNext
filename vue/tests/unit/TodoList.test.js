import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../../src/components/TodoList.vue';

describe('Todo List Tests', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(TodoList);
        await wrapper.vm.$nextTick();
    });

    // 1. 测试初始状态
    it('should initialize with default state', () => {
        // 待办
        expect(wrapper.vm.todos).toEqual([]);
        // 分组
        expect(wrapper.vm.groups).toEqual(['工作', '学习', '生活', '其他']);
        // 标签
        expect(wrapper.vm.tags).toEqual(['重要', '长期']);
        expect(wrapper.vm.tagColors).toEqual({
            '重要': '#ff4d4f',
            '长期': '#1890ff'
        });
        // 当前待办
        expect(wrapper.vm.currentTodo).toBeNull();
        // 模态框状态
        expect(wrapper.vm.showCreateModal).toBe(false);
        expect(wrapper.vm.showViewModal).toBe(false);
        expect(wrapper.vm.showCategoriesModal).toBe(false);
        // 过滤器
        expect(wrapper.vm.currentFilter).toBe('all');
        expect(wrapper.vm.currentGroup).toBe('');
        // 视图模式
        expect(wrapper.vm.viewMode).toBe('list');
    });

    // 2. 测试切换待办状态
    it('should toggle todo completion status', async () => {
        // 创建待办
        await wrapper.vm.saveTodo({ text: '待切换状态的待办' });
        const todo = wrapper.vm.todos[0];
        // 第一次切换：未完成 -> 完成
        await wrapper.vm.toggleTodo(todo);
        expect(wrapper.vm.todos[0].completed).toBe(true);
        // 第二次切换：完成 -> 未完成
        await wrapper.vm.toggleTodo(todo);
        expect(wrapper.vm.todos[0].completed).toBe(false);
    });

    // 3. 测试删除待办
    it('should delete todo correctly', async () => {
        // 创建待办
        await wrapper.vm.saveTodo({ text: '待删除的待办' });
        const todo = wrapper.vm.todos[0];
        // 删除待办
        await wrapper.vm.deleteTodo(todo);
        expect(wrapper.vm.todos).toHaveLength(0);
    });

    // 4. 测试创建待办
    describe('Create Todo Tests', () => {
        // 1. 测试打开创建待办模态框
        it('should open create modal when create button is clicked', async () => {
            // 点击创建按钮
            const createButton = wrapper.find('.create-btn');
            expect(createButton.exists()).toBe(true);
            await createButton.trigger('click');
            // 检查模态框状态
            expect(wrapper.vm.showCreateModal).toBe(true);
            // 检查 TodoForm 组件
            const todoForm = wrapper.findComponent({ name: 'TodoForm' });
            expect(todoForm.exists()).toBe(true);
            expect(todoForm.props('todo')).toBeNull();
            expect(todoForm.props('groups')).toEqual(wrapper.vm.groups);
            expect(todoForm.props('tags')).toEqual(wrapper.vm.tags);
            expect(todoForm.props('tagColors')).toEqual(wrapper.vm.tagColors);
        });

        // 2. 测试创建待办（最小信息）
        it('should create todo with minimal information', async () => {
            await wrapper.vm.saveTodo({ text: '最小待办' });
            // 检查创建的待办
            expect(wrapper.vm.todos).toHaveLength(1);
            expect(wrapper.vm.todos[0].text).toBe('最小待办');
            expect(wrapper.vm.todos[0].completed).toBe(false);
            // 检查关闭创建模态框
            expect(wrapper.vm.showCreateModal).toBe(false);
            expect(wrapper.vm.currentTodo).toBeNull();
        });

        // 3. 测试创建待办（完整信息）
        it('should create todo with complete information', async () => {
            await wrapper.vm.saveTodo({
                text: '完整待办',
                deadline: '2024-12-31T23:59:59',
                group: '工作',
                tags: ['重要'],
                description: '详细描述',
            });
            const todo = wrapper.vm.todos[0];
            expect(todo.text).toBe('完整待办');
            expect(todo.deadline).toBe('2024-12-31T23:59:59');
            expect(todo.group).toBe('工作');
            expect(todo.tags).toContain('重要');
            expect(todo.description).toBe('详细描述');
        });

        // 4. 测试创建多个待办
        it('should create multiple todos', async () => {
            const todos = [
                { text: '待办1', group: '工作' },
                { text: '待办2', group: '学习' },
            ];
            for (const todo of todos) {
                await wrapper.vm.saveTodo(todo);
            }
            expect(wrapper.vm.todos).toHaveLength(2);
            expect(wrapper.vm.todos[0].text).toBe('待办1');
            expect(wrapper.vm.todos[1].text).toBe('待办2');
        });

        // 5. 测试关闭创建待办模态框
        it('should close create modal correctly', async () => {
            await wrapper.vm.closeCreateModal();
            expect(wrapper.vm.showCreateModal).toBe(false);
            expect(wrapper.vm.currentTodo).toBeNull();
        });
    });

    // 5. 测试编辑待办
    describe('Edit Todo Tests', () => {
        beforeEach(() => {
            // 预设待办列表
            wrapper.vm.todos = [
              { id: 1, text: '待办1', completed: false, group: '工作', tags: ['重要'] },
              { id: 2, text: '待办2', completed: true, group: '学习', tags: ['长期'] },
            ];
        });

        // 1. 测试打开详情/编辑模态框
        it('should show view modal when viewTodo is called', async () => {
            const todo = wrapper.vm.todos[0];
            await wrapper.vm.viewTodo(todo);
            // 检查模态框状态
            expect(wrapper.vm.currentTodo).toEqual(todo);
            expect(wrapper.vm.showViewModal).toBe(true);
            // 检查 TodoForm 组件
            const todoForm = wrapper.findComponent({ name: 'TodoForm' });
            expect(todoForm.exists()).toBe(true);
            expect(todoForm.props('todo')).toEqual(todo);
            expect(todoForm.props('groups')).toEqual(wrapper.vm.groups);
            expect(todoForm.props('tags')).toEqual(wrapper.vm.tags);
            expect(todoForm.props('tagColors')).toEqual(wrapper.vm.tagColors);
        });

        // 2. 测试编辑待办
        it('should edit existing todo when saveTodo is called', async () => {
            // 打开编辑模态框
            const originalTodo = wrapper.vm.todos[0];
            await wrapper.vm.viewTodo(originalTodo);
            // 模拟编辑保存操作
            await wrapper.vm.saveTodo({
                text: '更新后的待办',
                group: '学习',
                tags: ['长期'],
            });
            // 检查编辑的待办
            expect(wrapper.vm.todos).toHaveLength(2);
            const updatedTodo = wrapper.vm.todos[0];
            expect(updatedTodo.id).toBe(originalTodo.id); // id 不变
            expect(updatedTodo.text).toBe('更新后的待办');
            expect(updatedTodo.group).toBe('学习');
            expect(updatedTodo.tags).toEqual(['长期']);
            // 检查关闭编辑模态框
            expect(wrapper.vm.showViewModal).toBe(false);
            expect(wrapper.vm.currentTodo).toBeNull();
        });

        // 3. 测试关闭详情/编辑模态框
        it('should close view modal correctly', async () => {
            await wrapper.vm.closeViewModal();
            expect(wrapper.vm.showViewModal).toBe(false);
            expect(wrapper.vm.currentTodo).toBeNull();
        });
    });

    // 6. 测试过滤功能
    it('should filter todos by completion status', async () => {
        // 创建多个待办
        await wrapper.vm.saveTodo({ text: '未完成1', completed: false });
        await wrapper.vm.saveTodo({ text: '未完成2', completed: false });
        await wrapper.vm.saveTodo({ text: '已完成', completed: true });
        // 显示未完成待办
        wrapper.vm.setFilter('active');
        expect(wrapper.vm.filteredTodos).toHaveLength(2);
        // 显示已完成待办
        wrapper.vm.setFilter('completed');
        expect(wrapper.vm.filteredTodos).toHaveLength(1);
        // 显示所有待办
        wrapper.vm.setFilter('all');
        expect(wrapper.vm.filteredTodos).toHaveLength(3);
    });

    // 7. 测试分组功能
    it('should filter todos by group', async () => {
        // 创建多个待办
        await wrapper.vm.saveTodo({ text: '工作待办', group: '工作' });
        await wrapper.vm.saveTodo({ text: '学习待办', group: '学习' });
        // 显示工作组的待办
        wrapper.vm.setGroup('工作');
        const workTodos = wrapper.vm.filteredTodos;
        expect(workTodos).toHaveLength(1);
        expect(workTodos[0].group).toBe('工作');
    });

    // 8. 测试视图切换
    it('should switch between list and calendar view', () => {
        // 列表视图 -> 日历视图
        expect(wrapper.vm.viewMode).toBe('list');
        wrapper.vm.viewMode = 'calendar';
        expect(wrapper.vm.viewMode).toBe('calendar');
    });
});
