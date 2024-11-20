const CalendarView = {
    props: {
        todos: Array,
        tagColors: Object
    },
    data() {
        return {
            currentDate: new Date(),
            weeks: ['日', '一', '二', '三', '四', '五', '六']
        }
    },
    computed: {
        currentMonth() {
            return this.currentDate.getMonth()
        },
        currentYear() {
            return this.currentDate.getFullYear()
        },
        daysInMonth() {
            const days = []
            const firstDay = new Date(this.currentYear, this.currentMonth, 1)
            const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
            
            // 填充上个月的日期
            for (let i = 0; i < firstDay.getDay(); i++) {
                const prevDate = new Date(this.currentYear, this.currentMonth, -i)
                days.unshift({
                    date: prevDate,
                    isCurrentMonth: false,
                    todos: this.getTodosForDate(prevDate)
                })
            }
            
            // 当前月的日期
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const currentDate = new Date(this.currentYear, this.currentMonth, i)
                days.push({
                    date: currentDate,
                    isCurrentMonth: true,
                    todos: this.getTodosForDate(currentDate)
                })
            }
            
            // 填充下个月的日期
            const remainingDays = 42 - days.length // 保持6行
            for (let i = 1; i <= remainingDays; i++) {
                const nextDate = new Date(this.currentYear, this.currentMonth + 1, i)
                days.push({
                    date: nextDate,
                    isCurrentMonth: false,
                    todos: this.getTodosForDate(nextDate)
                })
            }
            
            return days
        }
    },
    methods: {
        getTodosForDate(date) {
            return this.todos.filter(todo => {
                if (!todo.deadline) return false
                const todoDate = new Date(todo.deadline)
                return todoDate.getFullYear() === date.getFullYear() &&
                       todoDate.getMonth() === date.getMonth() &&
                       todoDate.getDate() === date.getDate()
            })
        },
        
        formatDate(date) {
            return date.getDate()
        },
        
        prevMonth() {
            this.currentDate = new Date(this.currentYear, this.currentMonth - 1)
        },
        
        nextMonth() {
            this.currentDate = new Date(this.currentYear, this.currentMonth + 1)
        },
        
        viewTodo(todo) {
            this.$emit('view', todo)
        }
    },
    template: `
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
                            'has-todos': day.todos.length > 0
                        }"
                    >
                        <div class="day-header">{{ formatDate(day.date) }}</div>
                        <div class="day-content">
                            <div 
                                v-for="todo in day.todos"
                                class="calendar-todo"
                                :class="{ completed: todo.completed }"
                                @click="viewTodo(todo)"
                            >
                                <span class="todo-text">{{ todo.text }}</span>
                                <div class="todo-tags">
                                    <span 
                                        v-for="tag in todo.tags" 
                                        class="tag"
                                        :style="{ backgroundColor: tagColors[tag] || '#666666' }"
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}
