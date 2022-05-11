import { formatPrice } from 'util/formatters';

describe('formatPrice for positive numbers', () => {
  test('formatPrice should format number pt-BR when given 10.1', () => {
    // ARRANGE
    const value = 10.1;

    // ACT
    const result = formatPrice(value);

    // ASSERT
    expect(result).toEqual('10,10');
  });

  test('formatPrice should format number pt-BR when given 0.1', () => {
    // ARRANGE

    // ACT
    const result = formatPrice(0.1);

    // ASSERT
    expect(result).toEqual('0,10');
  });
});

describe('formatPrice for non-positive numbers', () => {
  test('formatPrice should format number pt-BR when given 0', () => {
    // ARRANGE
    const value = 0;

    // ACT
    const result = formatPrice(value);

    // ASSERT
    expect(result).toEqual('0,00');
  });

  test('formatPrice should format number pt-BR when given -5,1', () => {
    // ARRANGE

    // ACT
    const result = formatPrice(-5.1);

    // ASSERT
    expect(result).toEqual('-5,10');
  });
});