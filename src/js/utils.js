export function calcTileType(index, boardSize) {
  const upperLeftCorner = 0;
  const upperRightCorner = boardSize - 1;
  const bottomLeftCorner = boardSize * (boardSize - 1);
  const bottomRightCorner = boardSize * boardSize - 1;

  if (index === upperLeftCorner) {
    return 'top-left';
  } if (index === upperRightCorner) {
    return 'top-right';
  } if (index > upperLeftCorner && index < upperRightCorner) {
    return 'top';
  }

  if (index === bottomLeftCorner) {
    return 'bottom-left';
  } if (index === bottomRightCorner) {
    return 'bottom-right';
  } if (index > bottomLeftCorner && index < bottomRightCorner) {
    return 'bottom';
  }

  if (index % boardSize === 0) {
    return 'left';
  } if ((index + 1) % boardSize === 0) {
    return 'right';
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
