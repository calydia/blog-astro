import assert from 'node:assert/strict';
import test from 'node:test';
import { getPageCount, getPageItems } from '../../src/utils/pagination.ts';

test('getPageCount always returns at least one page', () => {
  assert.equal(getPageCount(0), 1);
  assert.equal(getPageCount(12), 1);
  assert.equal(getPageCount(13), 2);
});

test('getPageItems returns the requested twelve-item slice', () => {
  const items = Array.from({ length: 25 }, (_, index) => index + 1);
  assert.deepEqual(getPageItems(items, 2), [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
  assert.deepEqual(getPageItems(items, 3), [25]);
});
