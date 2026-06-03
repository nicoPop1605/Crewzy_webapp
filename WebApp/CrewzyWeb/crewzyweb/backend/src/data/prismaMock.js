import { mockDeep, mockReset } from 'jest-mock-extended';

const mockPrismaClient = mockDeep();

beforeEach(() => {
    mockReset(mockPrismaClient);
});

export default mockPrismaClient;