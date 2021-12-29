import { describe, expect, it, jest } from "@jest/globals";
import { subHours, subMinutes, subYears } from "date-fns";
import User from "../src/User";
import EmailSenderService from "../src/EmailSenderService";

// Mock EmailSenderService class and his method sendEmail
const mockSendEmail = jest.fn();
jest.mock('../src/EmailSenderService', () => {
    return jest.fn().mockImplementation(() => {
        return {
            sendEmail: mockSendEmail
        }
    })
})
// Jest will create a mock instead of the real EmailSenderService class
const emailSenderServiceMock = new EmailSenderService();

describe("User validity", () => {
    it("Should be valid when User has good infos", () => {
        // Create a birthday 20 years before now
        // ex: if now = 2022, then birthday = 2002
        const now = new Date(Date.now());
        const birthday = subYears(now, 20);

        const user = new User("toto@toto.com", "toto", "toto", birthday, "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(true);
    })

    it("Should be invalid when User has no email adress", () => {
        const user = new User(null, "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when User has no first name", () => {
        const user = new User("toto@mail.com", null, "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when User has no last name", () => {
        const user = new User("toto@mail.com", "toto", null, subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when User has no birthday", () => {
        const user = new User("toto@mail.com", "toto", "toto", null, "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when User has no password", () => {
        const user = new User("toto@mail.com", "toto", "toto", subYears(new Date(Date.now()), 20), null, emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when User has less than 13 years old", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 10), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be valid when User has 13 years old", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 13), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(true);
    })

    it("Should be valid when User has more than 13 years old", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 25), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(true);
    })

    it("Should be invalid when User email has not good format", () => {
        const email = "toto1234";
        const user = new User(email, "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when password is too short", () => {
        const password7Characters = "1234567";
        const user = new User("toto1234", "toto", "toto", subYears(new Date(Date.now()), 20), password7Characters, emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })

    it("Should be invalid when password is too long", () => {
        const password45Characters = "123456789123456789123456789123456789123456789"
        const user = new User("toto1234", "toto", "toto", subYears(new Date(Date.now()), 20), password45Characters, emailSenderServiceMock);
        expect(user.isValid()).toBe(false);
    })
})

describe("Add Item to User's todolist", () => {
    it("Should be added to todolist when the user and the item is valid", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(true);

        user.addItem("item 1", "content");
        const itemAdded = user.getItemByName("item 1")
        expect(itemAdded).toBeDefined();
    })

    it("Should throw error when user is invalid", () => {
        const user = new User("toto1234", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        expect(user.isValid()).toBe(false);

        expect(() => {
            user.addItem("item 1", "content");
        }).toThrowError(new Error("User invalide ! Seul les users valide peuvent se constituer une todolist"))
    })

    it("Should throw error when User tries to add 11th item in his todolist", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);

        // Add 1st item 10h before now, 2nd item 9h before now etc...
        // To not trigger the error when the last item has been added less than 30mn before the next item
        const now = new Date(Date.now());
        user.addItem("item 1", "content", subHours(now, 10));
        user.addItem("item 2", "content", subHours(now, 9));
        user.addItem("item 3", "content", subHours(now, 8));
        user.addItem("item 4", "content", subHours(now, 7));
        user.addItem("item 5", "content", subHours(now, 6));
        user.addItem("item 6", "content", subHours(now, 5));
        user.addItem("item 7", "content", subHours(now, 4));
        user.addItem("item 8", "content", subHours(now, 3));
        user.addItem("item 9", "content", subHours(now, 2));
        user.addItem("item 10", "content", subHours(now, 1));

        expect(() => {
            user.addItem("item 11", "my item 11");
        }).toThrowError(new Error("La todolist ne peut pas contenir plus de 10 items"))
    })

    it("Should throw error when an item with same name already exist in the user's todolist", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        user.addItem("item 1", "my item 1");

        expect(() => {
            user.addItem("item 1", "my item 1 bis")
        }).toThrowError(new Error("Un item dans la todoList porte déjà ce nom là"))
    })

    it("Should throw error when the item contains more than 1000 characters", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        const content1001Characters = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper ante diam, non placerat eros fringilla quis. Ut lorem ante, ultrices et rhoncus et, luctus sed magna. Proin placerat vel nulla ac egestas. Phasellus convallis, arcu in iaculis elementum, elit massa semper ante, in vestibulum lorem urna quis odio. Vivamus sed elit in ligula malesuada volutpat sit amet non ex. Aenean mollis purus ac justo viverra, nec porta sem scelerisque. Maecenas volutpat orci vitae leo eleifend pellentesque. Ut pharetra sodales suscipit. Vestibulum fermentum est sit amet nunc varius egestas. Nam felis elit, tempor ut varius non, rhoncus non nunc. Donec diam dolor, lobortis sed scelerisque et, accumsan eget eros. Etiam sed rhoncus diam, at ultrices turpis. Curabitur maximus sem arcu, quis scelerisque eros porttitor quis. Curabitur quam eros, fermentum ac lectus vel, pulvinar vestibulum elit.Sed vel gravida erat. Nulla vulputate tellus quis nisi facilisis, et condimentum velit aliquet donec."
        expect(() => {
            user.addItem("item 1", content1001Characters)
        }).toThrowError(new Error("Item invalide ! L'item n'a pas pu être ajouté à la todolist"))
    })

    it("Should throw error when an item has been added less than 30mn ago", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        // Add an item 15mn ago
        user.addItem("item 1", "content", subMinutes(new Date(Date.now()), 15));

        expect(() => {
            user.addItem("item 2", "content")
        }).toThrowError(new Error("Un item a déjà été ajouté il y a moins de 30 minutes"))
    })

    it("Should use EmailSenderService sendEmail method when user add 8th item in his todolist", () => {
        const user = new User("toto@toto.com", "toto", "toto", subYears(new Date(Date.now()), 20), "password", emailSenderServiceMock);
        const now = new Date(Date.now());
        user.addItem("item 1", "content", subHours(now, 8));
        user.addItem("item 2", "content", subHours(now, 7));
        user.addItem("item 3", "content", subHours(now, 6));
        user.addItem("item 4", "content", subHours(now, 5));
        user.addItem("item 5", "content", subHours(now, 4));
        user.addItem("item 6", "content", subHours(now, 3));
        user.addItem("item 7", "content", subHours(now, 2));

        // Mock behavior of sendEmail method
        mockSendEmail.mockImplementation(() => {
            throw new Error("Email sent with message: 'You can now add only 2 more items in your todoList'")
        })

        expect(() => {
            user.addItem("item 8", "content", subHours(now, 1));
        }).toThrowError(new Error("Email sent with message: 'You can now add only 2 more items in your todoList'"));

        expect(mockSendEmail).toHaveBeenCalled();
    })
})