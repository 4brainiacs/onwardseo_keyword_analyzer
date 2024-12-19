/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});