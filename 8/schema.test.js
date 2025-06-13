const { Schema } = require('./schema');

describe('Schema Validation Library', () => {
  describe('String Validator', () => {
    test('validates basic string', () => {
      const validator = Schema.string();
      expect(validator.validate('test').isValid).toBe(true);
      expect(validator.validate(123).isValid).toBe(false);
    });

    test('validates string length constraints', () => {
      const validator = Schema.string().minLength(2).maxLength(5);
      expect(validator.validate('ab').isValid).toBe(true);
      expect(validator.validate('a').isValid).toBe(false);
      expect(validator.validate('abcdef').isValid).toBe(false);
    });

    test('validates string pattern', () => {
      const validator = Schema.string().pattern(/^[A-Z]+$/);
      expect(validator.validate('ABC').isValid).toBe(true);
      expect(validator.validate('abc').isValid).toBe(false);
    });
  });

  describe('Number Validator', () => {
    test('validates basic number', () => {
      const validator = Schema.number();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate('123').isValid).toBe(false);
    });

    test('validates number range', () => {
      const validator = Schema.number().min(1).max(10);
      expect(validator.validate(5).isValid).toBe(true);
      expect(validator.validate(0).isValid).toBe(false);
      expect(validator.validate(11).isValid).toBe(false);
    });
  });

  describe('Boolean Validator', () => {
    test('validates boolean values', () => {
      const validator = Schema.boolean();
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate(false).isValid).toBe(true);
      expect(validator.validate('true').isValid).toBe(false);
    });
  });

  describe('Array Validator', () => {
    test('validates array of strings', () => {
      const validator = Schema.array(Schema.string());
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a', 1]).isValid).toBe(false);
      expect(validator.validate('not an array').isValid).toBe(false);
    });

    test('validates array of numbers', () => {
      const validator = Schema.array(Schema.number().min(0));
      expect(validator.validate([1, 2, 3]).isValid).toBe(true);
      expect(validator.validate([1, -1, 3]).isValid).toBe(false);
    });
  });

  describe('Object Validator', () => {
    test('validates simple object', () => {
      const schema = Schema.object({
        name: Schema.string(),
        age: Schema.number()
      });

      const validData = { name: 'John', age: 30 };
      const invalidData = { name: 'John', age: '30' };

      expect(schema.validate(validData).isValid).toBe(true);
      expect(schema.validate(invalidData).isValid).toBe(false);
    });

    test('validates nested objects', () => {
      const addressSchema = Schema.object({
        street: Schema.string(),
        city: Schema.string()
      });

      const userSchema = Schema.object({
        name: Schema.string(),
        address: addressSchema
      });

      const validData = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'Boston'
        }
      };

      const invalidData = {
        name: 'John',
        address: {
          street: 123,
          city: 'Boston'
        }
      };

      expect(userSchema.validate(validData).isValid).toBe(true);
      expect(userSchema.validate(invalidData).isValid).toBe(false);
    });
  });

  describe('Complex Schema Example', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/),
      country: Schema.string()
    });

    const userSchema = Schema.object({
      id: Schema.string(),
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number(),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()),
      address: addressSchema
    });

    test('validates complex user object', () => {
      const validUser = {
        id: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true,
        tags: ['developer', 'designer'],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'USA'
        }
      };

      const invalidUser = {
        id: '12345',
        name: 'J', // Too short
        email: 'invalid-email',
        age: '30', // Should be number
        isActive: 'true', // Should be boolean
        tags: [1, 2], // Should be strings
        address: {
          street: '123 Main St',
          city: 'Anytown',
          postalCode: '123', // Invalid postal code
          country: 'USA'
        }
      };

      expect(userSchema.validate(validUser).isValid).toBe(true);
      expect(userSchema.validate(invalidUser).isValid).toBe(false);
    });
  });
}); 