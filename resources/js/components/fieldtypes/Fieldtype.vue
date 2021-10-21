<script>
import saveController from '../publish/SaveController';

const debouncedUpdate = _.debounce(function (func) {
    func();
}, 3000);

export default {

    props: {
        value: {
            required: true
        },
        config: {
            type: Object,
            default: () => { return {}; }
        },
        handle: {
            type: String,
            required: true
        },
        meta: {
            type: Object,
            default: () => { return {}; }
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        namePrefix: String,
        errorKeyPrefix: String,
    },

    methods: {
        update(value) {
            this.$emit('input', value);
        },

        updateDebounced(value) {
            console.log('updateDebounced', value)
            const listener = saveController.registerListener();

            listener.onSave.then(() => {
                console.log('updateDebounced onSave', value)
                debouncedUpdate.cancel();
                this.update(value);
                console.log('updateDebounced onSave after update')
            })

            return debouncedUpdate(() => {
                console.log('update', value)
                listener.unregister();
                this.update(value);
            });
        },

        updateMeta(value) {
            this.$emit('meta-updated', value);
        }
    },

    computed: {
        name() {
            if (this.namePrefix) {
                return `${this.namePrefix}[${this.handle}]`;
            }

            return this.handle;
        },

        isReadOnly() {
            return this.readOnly || this.config.read_only || false;
        },

        replicatorPreview() {
            return this.value;
        },

        fieldId() {
            return 'field_'+this.config.handle;
        }
    },

    watch: {

        replicatorPreview: {
            immediate: true,
            handler(text) {
                this.$emit('replicator-preview-updated', text);
            }
        }

    }

}
</script>
