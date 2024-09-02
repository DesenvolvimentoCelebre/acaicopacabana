"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
describe('Database Connection', () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.default.end();
    }));
    it('should connect to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield connection_1.default.query('SELECT 1 + 1 AS result');
            const result = rows[0].result;
            expect(result).toBe(2);
        }
        catch (error) {
            fail('Failed to connect to database');
        }
    }));
});
