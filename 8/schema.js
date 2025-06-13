/**
 * Base Validator class that all other validators extend from
 */
class Validator {
  constructor() {
    this.rules = [];
  }

  /**
   * Adds a validation rule
   * @param {Function} rule - Validation rule function
   * @returns {Validator} - Returns this for chaining
   */
  addRule(rule) {
    this.rules.push(rule);
    return this;
  }

  /**
   * Validates a value against all rules
   * @param {any} value - Value to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  validate(value) {
    const errors = [];
    for (const rule of this.rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors.push(result.error);
      }
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * String Validator class
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this.addRule(value => ({
      isValid: typeof value === 'string',
      error: 'Value must be a string'
    }));
  }

  /**
   * Sets minimum length requirement
   * @param {number} length - Minimum length
   * @returns {StringValidator}
   */
  minLength(length) {
    return this.addRule(value => ({
      isValid: typeof value === 'string' && value.length >= length,
      error: `String must be at least ${length} characters long`
    }));
  }

  /**
   * Sets maximum length requirement
   * @param {number} length - Maximum length
   * @returns {StringValidator}
   */
  maxLength(length) {
    return this.addRule(value => ({
      isValid: typeof value === 'string' && value.length <= length,
      error: `String must be at most ${length} characters long`
    }));
  }

  /**
   * Sets pattern requirement
   * @param {RegExp} pattern - Regular expression pattern
   * @returns {StringValidator}
   */
  pattern(pattern) {
    return this.addRule(value => ({
      isValid: typeof value === 'string' && pattern.test(value),
      error: `String must match pattern ${pattern}`
    }));
  }
}

/**
 * Number Validator class
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this.addRule(value => ({
      isValid: typeof value === 'number',
      error: 'Value must be a number'
    }));
  }

  /**
   * Sets minimum value requirement
   * @param {number} min - Minimum value
   * @returns {NumberValidator}
   */
  min(min) {
    return this.addRule(value => ({
      isValid: typeof value === 'number' && value >= min,
      error: `Number must be at least ${min}`
    }));
  }

  /**
   * Sets maximum value requirement
   * @param {number} max - Maximum value
   * @returns {NumberValidator}
   */
  max(max) {
    return this.addRule(value => ({
      isValid: typeof value === 'number' && value <= max,
      error: `Number must be at most ${max}`
    }));
  }
}

/**
 * Boolean Validator class
 */
class BooleanValidator extends Validator {
  constructor() {
    super();
    this.addRule(value => ({
      isValid: typeof value === 'boolean',
      error: 'Value must be a boolean'
    }));
  }
}

/**
 * Date Validator class
 */
class DateValidator extends Validator {
  constructor() {
    super();
    this.addRule(value => ({
      isValid: value instanceof Date && !isNaN(value),
      error: 'Value must be a valid date'
    }));
  }
}

/**
 * Object Validator class
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;
    this.addRule(value => ({
      isValid: typeof value === 'object' && value !== null && !Array.isArray(value),
      error: 'Value must be an object'
    }));
  }

  /**
   * Validates an object against the schema
   * @param {Object} value - Object to validate
   * @returns {Object} - Validation result
   */
  validate(value) {
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const errors = [];
    for (const [key, validator] of Object.entries(this.schema)) {
      const result = validator.validate(value[key]);
      if (!result.isValid) {
        errors.push(`${key}: ${result.errors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Array Validator class
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.addRule(value => ({
      isValid: Array.isArray(value),
      error: 'Value must be an array'
    }));
  }

  /**
   * Validates an array against the item validator
   * @param {Array} value - Array to validate
   * @returns {Object} - Validation result
   */
  validate(value) {
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const errors = [];
    for (let i = 0; i < value.length; i++) {
      const result = this.itemValidator.validate(value[i]);
      if (!result.isValid) {
        errors.push(`Item ${i}: ${result.errors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Schema Builder class
 */
class Schema {
  static string() {
    return new StringValidator();
  }
  
  static number() {
    return new NumberValidator();
  }
  
  static boolean() {
    return new BooleanValidator();
  }
  
  static date() {
    return new DateValidator();
  }
  
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Example usage
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

// Export the Schema class and validators
module.exports = {
  Schema,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ObjectValidator,
  ArrayValidator
};
