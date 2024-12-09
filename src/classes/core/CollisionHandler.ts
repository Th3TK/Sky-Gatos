import { Obstacles } from "../../types/board.types";
import { Coordinates, Movement } from "../../types/common.types";
import { signDependantFloor } from "../../utils/misc";

export default class CollisionHandler {
    getCurrentCoords: () => Coordinates;
    getTileCoords: (coords: Coordinates) => Coordinates;
    getColliders: () => Obstacles;

    constructor(getCoords: () => Coordinates, getTileCoords: (coords: Coordinates) => Coordinates, getColliders: () => Obstacles) {
        this.getCurrentCoords = getCoords;
        this.getTileCoords = getTileCoords;
        this.getColliders = getColliders;
    }

    willOverlap(objectRect: DOMRect, colliderRect: DOMRect, movement: Movement) {
        const horizontalBounds = objectRect.left < colliderRect.right && objectRect.right > colliderRect.left;
        const verticalBounds = objectRect.top < colliderRect.bottom && objectRect.bottom > colliderRect.top;

        const horizontalBoundsAfterMove = objectRect.left + movement.x < colliderRect.right && objectRect.right + movement.x > colliderRect.left;
        const verticalBoundsAfterMove = objectRect.top + movement.y < colliderRect.bottom && objectRect.bottom + movement.y > colliderRect.top;

        return {
            horizontal: horizontalBoundsAfterMove && verticalBounds,
            vertical: horizontalBounds && verticalBoundsAfterMove,
        };
    }

    handleCollisions(element: HTMLElement, movement: Movement): Movement {
        const output = movement;
        const currentTile = this.getTileCoords(this.getCurrentCoords());
        const objectRect = element.getBoundingClientRect();
        const colliders = this.getColliders();

        // check only the tiles around the tile the Entity is in
        for (let dx = currentTile.x - 2; dx <= currentTile.x + 2; dx++) {
            for (let dy = currentTile.y - 2; dy <= currentTile.y + 2; dy++) {
                const id = `${dx}:::${dy}`;

                if (!(id in colliders)) continue;

                const rect = colliders[id].element.getBoundingClientRect();
                const overlaps = this.willOverlap(objectRect, rect, movement);

                // calculate ideal velocity for perfect collision (without any gap in between)
                if (overlaps.horizontal) output.x = signDependantFloor(output.x > 0 ? Math.max(rect.left - objectRect.right, 0) : Math.min(rect.right - objectRect.left, 0));
                if (overlaps.vertical) output.y = signDependantFloor(output.y > 0 ? Math.max(rect.top - objectRect.bottom, 0) : Math.min(rect.bottom - objectRect.top, 0));
                if (!output.x && !output.y) return { x: 0, y: 0 };
            }
        }
        
        return output;
    }
}