export default class Item {
    name: String;
    content: String;
    creationDate: Date;

    constructor(name: String, content: String, creationDate: Date = new Date(Date.now())) {
        this.name = name;
        this.content = content;
        this.creationDate = creationDate;
    }

    isValid() {
        if (this.name &&
            this.content &&
            this.creationDate &&
            this.content.length <= 1000) {
            return true;
        } else {
            return false;
        }
    }
}