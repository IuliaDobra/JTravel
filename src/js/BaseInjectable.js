export default class BaseInjectable {
    constructor(instances, names) {
        instances.forEach((instance, index) => {
            this[names[index]] = instance;
        });
    }
}
