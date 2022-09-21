export const checkCollision = (collider: HTMLElement, colliding: HTMLElement) => {
    const colliderRect = collider.getBoundingClientRect();
    const collidingRect = colliding.getBoundingClientRect();

    return (
        colliderRect.top < collidingRect.top + collidingRect.height / 2 &&
        collidingRect.bottom - collidingRect.height / 2 < colliderRect.bottom &&
        colliderRect.left < collidingRect.left + collidingRect.width / 2 &&
        colliderRect.right > collidingRect.right - collidingRect.width / 2
    );
}