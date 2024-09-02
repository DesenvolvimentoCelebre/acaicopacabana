import pool from '../database/connection';
import acaiPrice from '../service/params';

jest.mock('../database/connection');

describe('acaiPrice function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update the price successfully', async () => {
    (pool.query as jest.Mock).mockResolvedValue([{}]);

    const result = await acaiPrice.acaiPrice(10.5);

    expect(result).toEqual({
      success: true,
      message: ['Acai price updated successfully']
    });

    expect(pool.query).toHaveBeenCalledWith('UPDATE sys SET val = ? WHERE id = 1', [10.5]);
  });

  it('should handle errors and return failure response', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('Error updating acai price'));

    const result = await acaiPrice.acaiPrice(10.5);

    expect(result).toEqual({
      success: false,
      message: ['Error to updateing acai price']
    });

    expect(pool.query).toHaveBeenCalledWith('UPDATE sys SET val = ? WHERE id = 1', [10.5]);
  });
});
