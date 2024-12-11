import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CategoriesPanel from '../../src/components/CategoriesPanel.vue';

describe('Category Management Tests', () => {
  let wrapper;
  const initialGroups = ['工作', '学习', '生活'];
  const initialTags = ['重要', '紧急'];
  const initialTagColors = {
    重要: '#ff4d4f',
    紧急: '#1890ff',
  };

  beforeEach(() => {
    wrapper = mount(CategoriesPanel, {
      props: {
        groups: initialGroups,
        tags: initialTags,
        tagColors: initialTagColors,
      },
    });
  });

  describe('Group Management', () => {
    // 1. 添加分组
    it('should add new group', async () => {
      await wrapper.setData({ newGroupName: '娱乐' });
      await wrapper.find('.add-item button').trigger('click');

      expect(wrapper.vm.editingGroups).toContain('娱乐');
    });

    // 2. 添加重复分组
    it('should not add duplicate group', async () => {
      await wrapper.setData({ newGroupName: '工作' });
      await wrapper.find('.add-item button').trigger('click');

      const groupsCount = wrapper.vm.editingGroups.filter(
        (g) => g === '工作'
      ).length;
      expect(groupsCount).toBe(1);
    });

    // 3. 添加空分组
    it('should not add empty group', async () => {
      await wrapper.setData({ newGroupName: '' });
      await wrapper.find('.add-item button').trigger('click');

      expect(wrapper.vm.editingGroups).toHaveLength(initialGroups.length);
    });

    // 4. 删除分组
    it('should delete group', async () => {
      const deleteButtons = wrapper.findAll('.delete');
      await deleteButtons[0].trigger('click');

      expect(wrapper.vm.editingGroups).not.toContain('工作');
    });

    // 5. 重命名分组
    it('should rename group', async () => {
      const inputs = wrapper.findAll('.item input');
      await inputs[0].setValue('工作新');

      expect(wrapper.vm.renamedGroups['工作']).toBe('工作新');
    });

    // 6. 特殊字符分组名
    it('should handle special characters in group name', async () => {
      const specialName = '!@#$%^&*()';
      await wrapper.setData({ newGroupName: specialName });
      await wrapper.find('.add-item button').trigger('click');

      expect(wrapper.vm.editingGroups).toContain(specialName);
    });

    // 7. 长分组名
    it('should handle long group name', async () => {
      const longName = 'a'.repeat(100);
      await wrapper.setData({ newGroupName: longName });
      await wrapper.find('.add-item button').trigger('click');

      expect(wrapper.vm.editingGroups).toContain(longName);
    });

    // 8. 批量操作分组
    it('should handle multiple group operations', async () => {
      // 添加多个分组
      const newGroups = ['分组1', '分组2', '分组3'];
      for (const group of newGroups) {
        await wrapper.setData({ newGroupName: group });
        await wrapper.find('.add-item button').trigger('click');
      }

      expect(wrapper.vm.editingGroups).toHaveLength(
        initialGroups.length + newGroups.length
      );
    });
  });

  describe('Tag Management', () => {
    beforeEach(async () => {
      // 切换到标签管理页面
      await wrapper.find('button:nth-child(2)').trigger('click');
    });

    // 9. 添加标签
    it('should add new tag with color', async () => {
      await wrapper.setData({
        newTagName: '个人',
        newTagColor: '#87d068',
      });
      await wrapper.find('.add-item button').trigger('click');

      const newTag = wrapper.vm.editingTags.find((t) => t.name === '个人');
      expect(newTag).toBeTruthy();
      expect(newTag.color).toBe('#87d068');
    });

    // 10. 更新标签颜色
    it('should update tag color', async () => {
      const colorInputs = wrapper.findAll('.item input[type="color"]');
      await colorInputs[0].setValue('#000000');

      const updatedTag = wrapper.vm.editingTags.find((t) => t.name === '重要');
      expect(updatedTag.color).toBe('#000000');
    });

    // 11. 删除标签
    it('should delete tag', async () => {
      const deleteButtons = wrapper.findAll('.delete');
      await deleteButtons[0].trigger('click');

      expect(wrapper.vm.editingTags.find((t) => t.name === '重要')).toBeFalsy();
    });

    // 12. 重命名标签
    it('should rename tag', async () => {
      const inputs = wrapper.findAll('.item input');
      await inputs[0].setValue('非常重要');

      expect(wrapper.vm.renamedTags['重要']).toBe('非常重要');
    });
  });
});
