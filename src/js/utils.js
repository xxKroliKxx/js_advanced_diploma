export function calcTileType(index, boardSize) {
    // TODO: test
    const upperLeftCorner = 0
    const upperRightCorner = boardSize - 1
    const bottomLeftCorner = boardSize * (boardSize - 1)
    const bottomRightCorner = boardSize * boardSize - 1

    if (index === upperLeftCorner) {
        return 'top-left'
    } else if (index === upperRightCorner) {
        return 'top-right'
    } else if (index > upperLeftCorner && index < upperRightCorner) {
        return 'top'
    }

    if (index === bottomLeftCorner) {
        return 'bottom-left'
    } else if (index === bottomRightCorner) {
        return 'bottom-right'
    } else if (index > bottomLeftCorner && index < bottomRightCorner) {
        return 'bottom'
    }

    if (index % boardSize === 0) {
        return 'left'
    } else if ((index + 1) % boardSize === 0) {
        return 'right'
    }

    return 'center';
}

export function calcHealthLevel(health) {
    if (health < 15) {
        return 'critical';
    }

    if (health < 50) {
        return 'normal';
    }

    return 'high';
}
