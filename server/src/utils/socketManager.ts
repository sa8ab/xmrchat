class socketManager {
    constructor() {
        if (socketManager._instance) {
            return socketManager._instance
        }
        socketManager._instance = this;

        // ... Your rest of the constructor code goes after this
    }
}