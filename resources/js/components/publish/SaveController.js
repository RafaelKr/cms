class SaveController {
    constructor() {
        this.index = 0
        this.listeners = {}
    }

    registerListener() {
        const listenerIndex = this.index++

        let triggerOnSave
        const onSave = new Promise((resolve) => triggerOnSave = resolve)

        this.listeners[listenerIndex] = {
            triggerOnSave,
        }

        return {
            onSave,
            unregister: () => {
                delete this.listeners[listenerIndex]
            },
        }
    }

    triggerSave() {
        return new Promise((resolve) => {
            for (const [index, listener] of Object.entries(this.listeners)) {
                listener.triggerOnSave();
                delete this.listeners[index];
            }

            setTimeout(() => resolve())
        });
    }
}

const saveController = new SaveController();
export default saveController
