import { describe, expect, it } from "@jest/globals";
import Item from "../src/Item";

describe("Item validity", () => {
    it("Should be invalid when the Item has no name", () => {
        const item = new Item(null, "content");
        expect(item.isValid()).toBe(false);
    })

    it("Should be invalid when the Item has no content", () => {
        const item = new Item("task 1", null);
        expect(item.isValid()).toBe(false);
    })

    it("Should be valid when the content size is 1000 characters", () => {
        const content1000Characters = "Lore ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper ante diam, non placerat eros fringilla quis. Ut lorem ante, ultrices et rhoncus et, luctus sed magna. Proin placerat vel nulla ac egestas. Phasellus convallis, arcu in iaculis elementum, elit massa semper ante, in vestibulum lorem urna quis odio. Vivamus sed elit in ligula malesuada volutpat sit amet non ex. Aenean mollis purus ac justo viverra, nec porta sem scelerisque. Maecenas volutpat orci vitae leo eleifend pellentesque. Ut pharetra sodales suscipit. Vestibulum fermentum est sit amet nunc varius egestas. Nam felis elit, tempor ut varius non, rhoncus non nunc. Donec diam dolor, lobortis sed scelerisque et, accumsan eget eros. Etiam sed rhoncus diam, at ultrices turpis. Curabitur maximus sem arcu, quis scelerisque eros porttitor quis. Curabitur quam eros, fermentum ac lectus vel, pulvinar vestibulum elit.Sed vel gravida erat. Nulla vulputate tellus quis nisi facilisis, et condimentum velit aliquet donec."
        const item = new Item("task 1", content1000Characters);
        expect(item.isValid()).toBe(true);
    })

    it("Should be invalid when the content size is more than 1000 characters", () => {
        const content1001Characters = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper ante diam, non placerat eros fringilla quis. Ut lorem ante, ultrices et rhoncus et, luctus sed magna. Proin placerat vel nulla ac egestas. Phasellus convallis, arcu in iaculis elementum, elit massa semper ante, in vestibulum lorem urna quis odio. Vivamus sed elit in ligula malesuada volutpat sit amet non ex. Aenean mollis purus ac justo viverra, nec porta sem scelerisque. Maecenas volutpat orci vitae leo eleifend pellentesque. Ut pharetra sodales suscipit. Vestibulum fermentum est sit amet nunc varius egestas. Nam felis elit, tempor ut varius non, rhoncus non nunc. Donec diam dolor, lobortis sed scelerisque et, accumsan eget eros. Etiam sed rhoncus diam, at ultrices turpis. Curabitur maximus sem arcu, quis scelerisque eros porttitor quis. Curabitur quam eros, fermentum ac lectus vel, pulvinar vestibulum elit.Sed vel gravida erat. Nulla vulputate tellus quis nisi facilisis, et condimentum velit aliquet donec."
        const item = new Item("task 1", content1001Characters);
        expect(item.isValid()).toBe(false);
    })

    it("Should be valid when the content size is less than 1000 characters", () => {
        const item = new Item("task 1", "content under 1000 characters");
        expect(item.isValid()).toBe(true);
    })
})