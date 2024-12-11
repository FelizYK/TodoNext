beforeEach(() => {
  window.confirm = vi.fn(() => true); // 模拟 confirm 函数
  window.alert = vi.fn(); // 模拟 alert 函数
});

afterEach(() => {
  vi.clearAllMocks(); // 清除所有模拟
});
