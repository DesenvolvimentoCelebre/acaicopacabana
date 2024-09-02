import pool from '../database/connection';
import { RowDataPacket } from 'mysql2';

interface ResultDatabase extends RowDataPacket {
  result: number;
}

describe('Database Connection', () => {
    afterAll(async () => {
        await pool.end();
    })

  it('should connect to the database', async () => {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT 1 + 1 AS result');
      const result = (rows as ResultDatabase[])[0].result;
      expect(result).toBe(2);
    } catch (error) {
      fail('Failed to connect to database');
    }
  });
});
