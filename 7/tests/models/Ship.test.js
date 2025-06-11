const Ship = require('../../src/models/Ship');

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(['00', '01', '02']);
  });

  describe('constructor', () => {
    it('should initialize with locations and empty hits array', () => {
      expect(ship.locations).toEqual(['00', '01', '02']);
      expect(ship.hits).toEqual([false, false, false]);
    });

    it('should handle empty locations array', () => {
      const emptyShip = new Ship();
      expect(emptyShip.locations).toEqual([]);
      expect(emptyShip.hits).toEqual([]);
    });
  });

  describe('hit', () => {
    it('should return true and mark hit when location is valid and not already hit', () => {
      expect(ship.hit('01')).toBe(true);
      expect(ship.hits[1]).toBe(true);
    });

    it('should return false when location is not part of ship', () => {
      expect(ship.hit('99')).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    it('should return false when location is already hit', () => {
      ship.hit('01');
      expect(ship.hit('01')).toBe(false);
      expect(ship.hits[1]).toBe(true);
    });
  });

  describe('isHitAt', () => {
    it('should return true if location has been hit', () => {
      ship.hit('00');
      expect(ship.isHitAt('00')).toBe(true);
    });

    it('should return false if location has not been hit', () => {
      expect(ship.isHitAt('00')).toBe(false);
    });

    it('should return false if location is not part of ship', () => {
      expect(ship.isHitAt('99')).toBe(false);
    });
  });

  describe('isSunk', () => {
    it('should return false when no hits', () => {
      expect(ship.isSunk()).toBe(false);
    });

    it('should return false when partially hit', () => {
      ship.hit('00');
      ship.hit('01');
      expect(ship.isSunk()).toBe(false);
    });

    it('should return true when all locations are hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('isAt', () => {
    it('should return true if ship is at the given location', () => {
      expect(ship.isAt('01')).toBe(true);
    });

    it('should return false if ship is not at the given location', () => {
      expect(ship.isAt('99')).toBe(false);
    });
  });
}); 