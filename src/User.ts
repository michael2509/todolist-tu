import { differenceInMinutes, differenceInYears, subYears } from "date-fns";
import EmailSenderService from "./EmailSenderService";
import Item from "./Item";

export default class User {
    email: String;
    firstname: String;
    lastname: String;
    birthday: Date;
    password: String;
    emailSenderService: EmailSenderService;
    todoList: Array<Item>;

    // Create user with empty todolist by default
    constructor (email: String, firstname: String, lastname: String, birthday: Date, password: String, emailSenderService: EmailSenderService) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.birthday = birthday;
        this.password = password;
        this.emailSenderService = emailSenderService;
        this.todoList = [];
    }

    validateEmail() {
        return String(this.email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    }

    isValid() {
        if (this.email &&
            this.firstname &&
            this.lastname &&
            this.birthday &&
            this.password &&
            this.todoList &&
            this.validateEmail() &&
            differenceInYears(new Date(Date.now()), this.birthday) >= 13 &&
            this.password.length >= 8 &&
            this.password.length <= 40) {
            return true;
        } else {
            return false;
        }
    }

    addItem(name: String, content: String, creationDate: Date = new Date(Date.now())) {
        const newItem = new Item(name, content, creationDate);

        if (!this.isValid()) {
            throw new Error("User invalide ! Seul les users valide peuvent se constituer une todolist")
        }

        if (!newItem.isValid()) {
            throw new Error("Item invalide ! L'item n'a pas pu être ajouté à la todolist");
        }

        if (this.todoList.length >= 10) {
            throw new Error("La todolist ne peut pas contenir plus de 10 items");
        }

        if (this.getItemByName(newItem.name)) {
            throw new Error("Un item dans la todoList porte déjà ce nom là");
        }

        const lastItemAdded = this.todoList[this.todoList.length - 1];
        if (this.todoList.length > 0 && differenceInMinutes(newItem.creationDate, lastItemAdded.creationDate) < 30) {
            throw new Error("Un item a déjà été ajouté il y a moins de 30 minutes");
        }

        this.todoList.push(newItem);

        if (this.todoList.length === 8) {
            this.emailSenderService.sendEmail();
        }
    }

    // Find an item by name in the todolist
    getItemByName(name: String) {
        return this.todoList.find(item => item.name === name);
    }
}