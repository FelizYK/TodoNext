import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../src/components/TodoList.vue';
import TodoForm from '../src/components/TodoForm.vue';
import faker from 'faker';

describe('TodoForm Component - Fuzz Testing', () => {
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

    it('should handle random input without crashing', async () => {
        for (let i = 0; i < 10000; i++) {
            // 打开创建
            await wrapper.find('.create-btn').trigger('click');
            const todoForm = wrapper.findComponent(TodoForm);
            // 生成随机数据
            const randomText = faker.lorem.sentence();
            const randomDeadline = faker.date.future().toISOString();
            const randomGroup = faker.random.word();
            const randomTags = [faker.random.word(), faker.random.word()];
            const randomDescription = faker.lorem.paragraph();
            // 编辑
            todoForm.vm.formData = {
                text: randomText,
                deadline: randomDeadline,
                group: randomGroup,
                tags: randomTags,
                description: randomDescription,
            };
            // 保存
            await todoForm.find('.save-btn').trigger('click');
            // 验证
            expect(wrapper.vm.todos).toHaveLength(i + 1);
            expect(wrapper.vm.todos[i].text).toBe(randomText);
            expect(wrapper.vm.todos[i].deadline).toBe(randomDeadline);
            expect(wrapper.vm.todos[i].group).toBe(randomGroup);
            expect(wrapper.vm.todos[i].tags).toEqual(randomTags);
            expect(wrapper.vm.todos[i].description).toBe(randomDescription);
        }
    });

    it('should handle edge cases', async () => {
        const edgeCases = [
            null, // 空值
            undefined, // 未定义值
            '<script>alert("XSS Attack")</script>', // XSS
            'a'.repeat(1000000000), // 超长字符串
        ];
        for (const edgeCase of edgeCases) {
            await wrapper.find('.create-btn').trigger('click');
            const todoForm = wrapper.findComponent(TodoForm);
            todoForm.vm.formData.text = edgeCase;
            await todoForm.find('.save-btn').trigger('click');
            expect(wrapper.vm.todos).toHaveLength(0);
        }
    });
});
