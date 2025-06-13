# JavaScript Validation Library

A robust validation library for JavaScript that allows you to validate complex data structures with ease. This library provides a fluent API for creating validation schemas and validating data against them.

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
const { Schema } = require('./schema');

// Create a simple schema
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  age: Schema.number().min(0).max(120),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
});

// Validate data
const result = userSchema.validate({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
});

console.log(result.isValid); // true
console.log(result.errors); // []
```

### Available Validators

#### String Validator
```javascript
Schema.string()
  .minLength(2)
  .maxLength(50)
  .pattern(/^[A-Z]+$/)
```

#### Number Validator
```javascript
Schema.number()
  .min(0)
  .max(100)
```

#### Boolean Validator
```javascript
Schema.boolean()
```

#### Array Validator
```javascript
Schema.array(Schema.string())
Schema.array(Schema.number().min(0))
```

#### Object Validator
```javascript
Schema.object({
  name: Schema.string(),
  age: Schema.number()
})
```

### Complex Example

```javascript
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

const userData = {
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

const result = userSchema.validate(userData);
```

## Running Tests

To run the test suite:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## API Reference

### Schema

The main entry point for creating validators.

#### Methods

- `Schema.string()` - Creates a string validator
- `Schema.number()` - Creates a number validator
- `Schema.boolean()` - Creates a boolean validator
- `Schema.date()` - Creates a date validator
- `Schema.object(schema)` - Creates an object validator
- `Schema.array(itemValidator)` - Creates an array validator

### Validator Results

All validators return an object with the following structure:

```javascript
{
  isValid: boolean,
  errors: string[]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 