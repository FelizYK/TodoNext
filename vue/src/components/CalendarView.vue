<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button @click="prevMonth">◀</button>
      <h2>{{ currentYear }}年 {{ currentMonth + 1 }}月</h2>
      <button @click="nextMonth">▶</button>
    </div>

    <div class="calendar-grid">
      <div class="calendar-weekdays">
        <div v-for="week in weeks" class="weekday">{{ week }}</div>
      </div>

      <div class="calendar-days">
        <div
          v-for="day in daysInMonth"
          class="day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'has-todos': day.todos.length > 0,
          }"
        >
          <div class="day-header">{{ formatDate(day.date) }}</div>
          <div>
            <div
              v-for="todo in day.todos"
              class="calendar-todo"
              :class="{ completed: todo.completed }"
              @click="viewTodo(todo)"
            >
              <span class="todo-text">{{ todo.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarView',
  props: {
    todos: Array,
  },
  data() {
    return {
      currentDate: new Date(),
      weeks: ['一', '二', '三', '四', '五', '六', '日'],
    };
  },
  computed: {
    currentMonth() {
      return this.currentDate.getMonth();
    },
    currentYear() {
      return this.currentDate.getFullYear();
    },
    daysInMonth() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

      // 填充上个月的日期
      for (let i = 0; i < firstDay.getDay(); i++) {
        const prevDate = new Date(this.currentYear, this.currentMonth, -i);
        days.unshift({
          date: prevDate,
          isCurrentMonth: false,
          todos: this.getTodosForDate(prevDate),
        });
      }
      // 当前月的日期
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(this.currentYear, this.currentMonth, i);
        days.push({
          date: currentDate,
          isCurrentMonth: true,
          todos: this.getTodosForDate(currentDate),
        });
      }
      // 填充下个月的日期
      const remainingDays = 42 - days.length; // 保持6行
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({
          date: nextDate,
          isCurrentMonth: false,
          todos: this.getTodosForDate(nextDate),
        });
      }

      return days;
    },
  },
  methods: {
    getTodosForDate(date) {
      return this.todos.filter((todo) => {
        if (!todo.deadline) return false;
        const todoDate = new Date(todo.deadline);
        return (
          todoDate.getFullYear() === date.getFullYear() &&
          todoDate.getMonth() === date.getMonth() &&
          todoDate.getDate() === date.getDate()
        );
      });
    },
    formatDate(date) {
      return date.getDate();
    },
    prevMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1);
    },
    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1);
    },
    viewTodo(todo) {
      this.$emit('view', todo);
    },
  },
};
</script>

<style scoped>
.calendar-view {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(255, 153, 102, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #ff9966;
  transition: all 0.3s ease;
}

.calendar-header button:hover {
  background: #fff5f0;
  transform: translateY(-1px);
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

/* 星期标题行 */
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  margin-bottom: 12px;
}

.weekday {
  padding: 12px;
  color: #ff9966;
}

/* 日期格 */
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background: #ffe6d9;
  border-radius: 8px;
  padding: 2px;
}

.day {
  background: white;
  min-height: 120px;
  padding: 10px;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.day:hover {
  background: #fff5f0;
}

.day.other-month {
  background: #fafafa;
  color: #bbb;
}

.day.has-todos {
  background: #fff5f0;
}

/* 日期数字 */
.day-header {
  text-align: right;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

/* 待办事项 */
.calendar-todo {
  font-size: 12px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #ffe6d9;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
  color: #666;
}

.calendar-todo:hover {
  background: #fff5f0;
  border-color: #ffb088;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(255, 153, 102, 0.1);
}

.calendar-todo.completed {
  text-decoration: line-through;
  opacity: 0.8;
  background: #f5f5f5;
  border-color: #eee;
  color: #999;
}
</style>
