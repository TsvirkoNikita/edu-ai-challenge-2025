/**
 * Ship class representing a battleship with locations and hit status
 */
class Ship {
  constructor(locations = []) {
    this.locations = locations;
    this.hits = new Array(locations.length).fill(false);
  }

  /**
   * Attempts to hit the ship at the given location
   * @param {string} location - The location to hit (e.g., "34")
   * @returns {boolean} - True if hit, false if miss
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index >= 0 && !this.hits[index]) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  /**
   * Checks if the ship has been hit at a specific location
   * @param {string} location - The location to check
   * @returns {boolean} - True if already hit
   */
  isHitAt(location) {
    const index = this.locations.indexOf(location);
    return index >= 0 && this.hits[index];
  }

  /**
   * Checks if the ship is completely sunk
   * @returns {boolean} - True if all locations are hit
   */
  isSunk() {
    return this.hits.every(hit => hit);
  }

  /**
   * Checks if the ship occupies the given location
   * @param {string} location - The location to check
   * @returns {boolean} - True if ship is at this location
   */
  isAt(location) {
    return this.locations.includes(location);
  }
}

module.exports = Ship; 