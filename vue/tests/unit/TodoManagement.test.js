import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../../src/components/TodoList.vue';

describe('Todo Management Tests', () => {
  let wrapper;

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('todos', JSON.stringify([]));
    wrapper = mount(TodoList);
    await wrapper.vm.$nextTick();
  });

  describe('Todo CRUD Operations', () => {
    // 1. 创建待办项 - 基本场景
    it('should create a todo with basic information', async () => {
      await wrapper.find('.create-btn').trigger('click');

      const form = wrapper.findComponent({ name: 'TodoForm' });
      form.vm.formData.text = 'Basic Todo';
      form.vm.formData.group = '';
      form.vm.formData.tags = [];
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Basic Todo');
    });

    // 2. 创建待办项 - 包含所有字段
    it('should create a todo with all fields', async () => {
      await wrapper.find('.create-btn').trigger('click');

      const form = wrapper.findComponent({ name: 'TodoForm' });
      form.vm.formData.text = 'Full Todo';
      form.vm.formData.group = 'work';
      form.vm.formData.tags = ['important', 'urgent'];
      form.vm.formData.deadline = '2024-02-20T15:30:00';
      form.vm.formData.description = 'Detailed description';
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos[0]).toMatchObject({
        text: 'Full Todo',
        group: 'work',
        tags: ['important', 'urgent'],
        deadline: '2024-02-20T15:30:00',
        description: 'Detailed description',
      });
    });

    // 3. 创建待办项 - 标题为空
    it('should not create a todo with empty text', async () => {
      await wrapper.find('.create-btn').trigger('click');

      const form = wrapper.findComponent({ name: 'TodoForm' });
      form.vm.formData.text = '';
      form.vm.formData.group = 'work';
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos).toHaveLength(0);
    });

    // 4. 更新待办项
    it('should update existing todo', async () => {
      // 先创建一个待办项
      const todo = {
        id: 1,
        text: 'Initial Todo',
        completed: false,
      };
      localStorage.setItem('todos', JSON.stringify([todo]));
      wrapper.setData({ todos: JSON.parse(localStorage.getItem('todos')) });
      await wrapper.vm.$nextTick();

      // 打开详情编辑页
      const todoItems = wrapper.findAllComponents({ name: 'todo-item' });
      const todoItem = todoItems.find(
        (item) => item.props('todo').id === todo.id
      );
      expect(todoItem).toBeTruthy();
      await todoItem.trigger('click');

      // 更新
      const form = wrapper.findComponent({ name: 'TodoForm' });
      form.vm.formData.text = 'Updated Todo';
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos[0].text).toBe('Updated Todo');
    });

    // 5. 删除待办项
    it('should delete todo', async () => {
      const todo = {
        id: 1,
        text: 'Todo to delete',
        completed: false,
      };
      localStorage.setItem('todos', JSON.stringify([todo]));
      wrapper.setData({ todos: JSON.parse(localStorage.getItem('todos')) });
      await wrapper.vm.$nextTick();

      const todoItems = wrapper.findAllComponents({ name: 'todo-item' });
      const todoItem = todoItems.find(
        (item) => item.props('todo').id === todo.id
      );
      expect(todoItem).toBeTruthy();
      await todoItem.find('.delete-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos).toHaveLength(0);
    });

    // 6. 切换待办项状态
    it('should toggle todo status', async () => {
      const todo = {
        id: 1,
        text: 'Toggle Todo',
        completed: false,
      };
      localStorage.setItem('todos', JSON.stringify([todo]));
      wrapper.setData({ todos: JSON.parse(localStorage.getItem('todos')) });
      await wrapper.vm.$nextTick();

      const todoItems = wrapper.findAllComponents({ name: 'todo-item' });
      const todoItem = todoItems.find(
        (item) => item.props('todo').id === todo.id
      );
      expect(todoItem).toBeTruthy();
      await todoItem.find('.complete-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos[0].completed).toBe(true);
    });

    // 7. 批量操作测试
    it('should handle multiple todos', async () => {
      // 创建多个待办项
      for (let i = 0; i < 5; i++) {
        await wrapper.find('.create-btn').trigger('click');

        const form = wrapper.findComponent({ name: 'TodoForm' });
        form.vm.formData.text = `Todo ${i}`;
        form.vm.formData.completed = i % 2 === 0;
        await form.find('.save-btn').trigger('click');
      }

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos).toHaveLength(5);
    });

    // 8. 截止日期处理
    it('should handle deadline correctly', async () => {
      await wrapper.find('.create-btn').trigger('click');

      const form = wrapper.findComponent({ name: 'TodoForm' });
      form.vm.formData.text = 'Deadline Todo';
      const deadline = '2024-02-20T15:30:00';
      form.vm.formData.deadline = deadline;
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos[0].deadline).toBe(deadline);
    });

    // 9. 特殊字符处理
    it('should handle special characters in todo text', async () => {
      await wrapper.find('.create-btn').trigger('click');

      const form = wrapper.findComponent({ name: 'TodoForm' });
      const specialText = '!@#$%^&*()_+<>?:"{}|';
      form.vm.formData.text = specialText;
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos[0].text).toBe(specialText);
    });

    // 10. 长文本处理
    it('should handle long text in todo', async () => {
      await wrapper.find('.create-btn').trigger('click');

      const form = wrapper.findComponent({ name: 'TodoForm' });
      const longText = 'a'.repeat(1000);
      form.vm.formData.text = longText;
      form.vm.formData.description = longText;
      await form.find('.save-btn').trigger('click');

      const todos = JSON.parse(localStorage.getItem('todos'));
      expect(todos[0].text).toBe(longText);
      expect(todos[0].description).toBe(longText);
    });
  });
});
