import type { ValidationResult, ValidationContext, ValidationRule } from '../types';

export abstract class BaseValidator<T> {
  protected rules: ValidationRule<T>[] = [];

  validate(value: T, context?: ValidationContext): ValidationResult {
    for (const rule of this.rules) {
      const result = rule.validate(value, context);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  }

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  addRules(rules: ValidationRule<T>[]): this {
    this.rules.push(...rules);
    return this;
  }
}