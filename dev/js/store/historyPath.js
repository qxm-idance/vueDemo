
export default (function historyPath() {
    let history = [];
    return {
        add(path) {
            if (path) {
                history.push(path);
            }
            return history
        },
        remove(index) {
            if (index && history.length >= index + 1) {
                history.splice(index, 1);
            } else {
                history.pop()
            }
            return history
        },
        get() {
            return history
        },
        last() {
            return history[history.length - 1] || '/';
        }
    };
})()
