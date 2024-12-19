import { BaseValidator } from './BaseValidator';
import { urlRules } from '../rules/urlRules';

export class UrlValidator extends BaseValidator<string> {
  constructor() {
    super();
    this.addRules(urlRules);
  }
}