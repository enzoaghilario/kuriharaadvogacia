/** Move only the launcher; the conversation keeps Typebot's safe viewport layout. */
export function attachChatDrag(button: HTMLButtonElement) {
  let position: { x: number; y: number } | undefined;
  let gesture: { id: number; x: number; y: number; left: number; top: number; moved: boolean } | undefined;
  let suppressClick = false;
  let clearClickTimer: ReturnType<typeof setTimeout> | undefined;
  const originalStyle = button.getAttribute("style") ?? "";
  const closed = () => button.getAttribute("aria-pressed") !== "true";

  const applyPosition = () => {
    if (!position || !closed()) return;
    const margin = 8;
    position.x = Math.max(margin, Math.min(position.x, window.innerWidth - button.offsetWidth - margin));
    position.y = Math.max(margin, Math.min(position.y, window.innerHeight - button.offsetHeight - margin));
    button.style.position = "fixed";
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";
  };
  button.style.touchAction = "none";
  button.style.cursor = "grab";
  button.style.userSelect = "none";

  const down = (event: PointerEvent) => {
    if (!closed() || !event.isPrimary || event.button !== 0) return;
    clearTimeout(clearClickTimer);
    suppressClick = false;
    const rect = button.getBoundingClientRect();
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
    button.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.moved && Math.hypot(dx, dy) < 6) return;
    gesture.moved = true;
    suppressClick = true;
    event.preventDefault();
    position = { x: gesture.left + dx, y: gesture.top + dy };
    applyPosition();
    button.style.cursor = "grabbing";
  };
  const end = (event: PointerEvent) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    gesture = undefined;
    if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
    button.style.cursor = "grab";
    // The synthesized click immediately after a drag must not open the chat.
    clearClickTimer = setTimeout(() => { suppressClick = false; }, 0);
  };
  const click = (event: MouseEvent) => {
    if (!suppressClick || event.detail === 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  };
  const preventImageDrag = (event: Event) => event.preventDefault();
  const onChat = (event: Event) => {
    if ((event as CustomEvent<boolean>).detail) {
      button.style.removeProperty("position");
      button.style.removeProperty("left");
      button.style.removeProperty("top");
      button.style.removeProperty("right");
      button.style.removeProperty("bottom");
    } else {
      // Typebot may update aria-pressed after its callback.
      requestAnimationFrame(applyPosition);
    }
  };
  button.addEventListener("pointerdown", down);
  button.addEventListener("pointermove", move);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("lostpointercapture", end);
  button.addEventListener("click", click, true);
  button.addEventListener("dragstart", preventImageDrag);
  window.addEventListener("resize", applyPosition);
  window.addEventListener("kf-chat", onChat);
  return () => {
    clearTimeout(clearClickTimer);
    button.removeEventListener("pointerdown", down);
    button.removeEventListener("pointermove", move);
    button.removeEventListener("pointerup", end);
    button.removeEventListener("pointercancel", end);
    button.removeEventListener("lostpointercapture", end);
    button.removeEventListener("click", click, true);
    button.removeEventListener("dragstart", preventImageDrag);
    window.removeEventListener("resize", applyPosition);
    window.removeEventListener("kf-chat", onChat);
    button.setAttribute("style", originalStyle);
  };
}