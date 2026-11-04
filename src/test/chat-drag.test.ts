import { afterEach, describe, expect, it, vi } from "vitest";
import { attachChatDrag } from "@/lib/chat-drag";

afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });

describe("chat launcher dragging", () => {
  function setup() {
    const button = document.createElement("button");
    document.body.append(button);
    button.setAttribute("aria-pressed", "false");
    button.getBoundingClientRect = () => ({ left: 200, top: 300, width: 44, height: 44 }) as DOMRect;
    Object.defineProperty(button, "offsetWidth", { value: 44 });
    Object.defineProperty(button, "offsetHeight", { value: 44 });
    button.setPointerCapture = vi.fn();
    button.hasPointerCapture = () => true;
    button.releasePointerCapture = vi.fn();
    const detach = attachChatDrag(button);
    const pointer = (type: string, x: number, y: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.assign(event, { pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y });
      button.dispatchEvent(event);
    };
    return { button, pointer, detach };
  }
  it("moves the button and prevents opening when a drag ends", () => {
    const { button, pointer, detach } = setup();
    const open = vi.fn();
    button.addEventListener("click", open);
    pointer("pointerdown", 220, 320);
    pointer("pointermove", 120, 220);
    pointer("pointerup", 120, 220);
    button.dispatchEvent(new MouseEvent("click", { detail: 1, bubbles: true }));
    expect(button.style.left).toBe("100px");
    expect(button.style.top).toBe("200px");
    expect(open).not.toHaveBeenCalled();
    detach();
  });
  it("keeps a normal click working without movement", () => {
    const { button, pointer, detach } = setup();
    const open = vi.fn();
    button.addEventListener("click", open);
    pointer("pointerdown", 220, 320);
    pointer("pointerup", 220, 320);
    button.dispatchEvent(new MouseEvent("click", { detail: 1 }));
    expect(open).toHaveBeenCalledOnce();
    detach();
  });
  it("keeps the entire button on screen and restores the chat position on opening", () => {
    const { button, pointer, detach } = setup();
    pointer("pointerdown", 220, 320);
    pointer("pointermove", -1000, 9999);
    expect(button.style.left).toBe("8px");
    expect(Number.parseFloat(button.style.top) + 44).toBeLessThanOrEqual(window.innerHeight);
    window.dispatchEvent(new CustomEvent("kf-chat", { detail: true }));
    expect(button.style.position).toBe("");
    detach();
  });
});