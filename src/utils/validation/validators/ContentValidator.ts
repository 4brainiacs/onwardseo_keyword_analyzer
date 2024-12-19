import { BaseValidator } from './BaseValidator';
import { contentRules } from '../rules/contentRules';

export class ContentValidator extends BaseValidator<string> {
  constructor() {
    super();
    this.addRules(contentRules);
  }
}