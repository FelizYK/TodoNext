beforeEach(() => {
  window.confirm = vi.fn(() => true); // 模拟 confirm 函数
  window.alert = vi.fn(); // 模拟 alert 函数
  global.localStorage = { // 模拟 localStorage
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = value.toString();
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
});

afterEach(() => {
  vi.clearAllMocks(); // 清除所有模拟
});
