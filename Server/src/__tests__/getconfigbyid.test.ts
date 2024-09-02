import pool from '../database/connection';
import getConfigById from '../service/params';

describe('getconfigbyid function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })
  it('should retrieve all settings by id', async () => {
    (pool.query as jest.Mock).mockResolvedValue([{}]);

    const result = await getConfigById.getConfigById(1);

    expect(result).toEqual({
        success: true,
        message: result  
    })

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM sys WHERE id = ?', [1]);
  });

  it('should handle errors and return failure response', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('Error retrieving settings'));

    const result = await getConfigById.getConfigById(1);

    expect(result).toEqual({
        success: false,
        message: 'Error retrieving settings'
    })
  })
});
