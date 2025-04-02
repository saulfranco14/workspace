const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockSingle = jest.fn();
const mockMaybeSingle = jest.fn();
const mockLimit = jest.fn();
const mockOrder = jest.fn();

const resetMocks = () => {
  jest.clearAllMocks();

  mockEq.mockImplementation(() => ({
    eq: mockEq,
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
    limit: mockLimit,
    order: mockOrder,
    select: mockSelect,
  }));

  mockDelete.mockImplementation(() => ({
    eq: mockEq,
  }));

  mockLimit.mockImplementation(() => ({
    maybeSingle: mockMaybeSingle,
  }));

  mockOrder.mockImplementation(() => ({
    limit: mockLimit,
    maybeSingle: mockMaybeSingle,
  }));

  mockSelect.mockImplementation(() => ({
    eq: mockEq,
    order: mockOrder,
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
    limit: mockLimit,
    data: [],
    error: null,
  }));

  mockInsert.mockImplementation(() =>
    Promise.resolve({
      data: null,
      error: null,
    })
  );

  mockUpdate.mockImplementation(() => ({
    eq: mockEq,
  }));

  mockSingle.mockImplementation(() => ({
    data: null,
    error: null,
  }));

  mockMaybeSingle.mockImplementation(() => ({
    data: null,
    error: null,
  }));

  mockFrom.mockImplementation(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  }));
};

export const mockSupabase = {
  from: mockFrom,
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: jest.fn(),
    signIn: jest.fn(),
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    signOut: jest.fn(),
    exchangeCodeForSession: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
};

// Resetear los mocks
resetMocks();

// Exportar funciones útiles para los tests
export {
  resetMocks,
  mockFrom,
  mockSelect,
  mockEq,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockSingle,
  mockMaybeSingle,
  mockLimit,
  mockOrder,
};

if (process.env.NODE_ENV === 'test') {
  describe('SupabaseMock', () => {
    it('debe exportar mocks correctamente', () => {
      expect(mockSupabase).toBeDefined();
      expect(mockFrom).toBeDefined();
      expect(resetMocks).toBeDefined();
    });
  });
}
