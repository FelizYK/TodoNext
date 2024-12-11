<template>
  <div class="modal-overlay" v-if="show" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    show: Boolean,
    title: String,
  },
};
</script>

<style scoped>
/* 模态框遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 模态框容器 */
.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 24px rgba(255, 153, 153, 0.2);
  position: relative;
}

/* 模态框头部 */
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #ffe5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 模态框标题 */
.modal-header h2 {
  color: #ff9999;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

/* 模态框主体 */
.modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* 滚动条样式 */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #fff5f5;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #ffb3b3;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #ff9999;
}

/* 关闭按钮 */
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #ffb3b3;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #fff5f5;
  color: #ff9999;
  transform: rotate(90deg);
}
</style>
