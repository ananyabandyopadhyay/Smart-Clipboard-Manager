import { describe, it, expect } from 'vitest';

describe('Posts Component', () => {
  const getStockValue = async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!data || Object.keys(data).length < 1) {
      return false;
    } else {
      return data;
    }
  };

  describe('the getStockValue function', () => {
    it('returns false if no data is returned by the API', async () => {
      const value = await getStockValue();
      expect(value).toBe(false);
    });
  });
});
