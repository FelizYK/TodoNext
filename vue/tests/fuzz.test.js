import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoForm from '../src/components/TodoForm.vue';
import faker from 'faker';

describe('TodoForm Component - Fuzz Testing', () => {
    let wrapper;

    beforeEach(() => {
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
    });

    it('should handle random input without crashing', async () => {
        for (let i = 0; i < 100; i++) { // 进行100次随机测试
            // 随机生成数据
            const randomText = faker.lorem.sentence();
            const randomDeadline = faker.date.future().toISOString();
            const randomGroup = faker.random.word();
            const randomTags = [faker.random.word(), faker.random.word()];
            // 保存待办
            wrapper.vm.formData = {
                text: randomText,
                deadline: randomDeadline,
                group: randomGroup,
                tags: randomTags,
                description: '测试描述'
            };
            await wrapper.vm.saveTodo();
            // 验证
            expect(wrapper.vm.formData.text).toBe(randomText);
            expect(wrapper.vm.formData.deadline).toBe(randomDeadline);
            expect(wrapper.vm.formData.group).toBe(randomGroup);
            expect(wrapper.vm.formData.tags).toEqual(randomTags);
        }
    });

    // 边界情况
    it('should handle edge cases', async () => {
        const edgeCases = [
            '', // 空字符串
            ' ' // 仅空格
        ];

        for (const edgeCase of edgeCases) {
            wrapper.vm.formData.text = edgeCase;
            await wrapper.vm.saveTodo();
            expect(wrapper.vm.formData.text).toBe(edgeCase);
        }
    });
});
