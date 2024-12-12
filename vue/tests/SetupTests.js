// import { JSDOM } from 'jsdom';
// const { window } = new JSDOM('<!doctype html><html><body></body></html>');

// global.window = window;
// global.document = window.document;
// global.SVGElement = class {};
// global.Element = class {};

beforeEach(() => {
  global.confirm = vi.fn(() => true); // 模拟 confirm 函数
  global.alert = vi.fn(); // 模拟 alert 函数
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
