const Modal = {
    props: {
        show: Boolean,
        title: String
    },
    template: `
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
    `
}
