export { getSession, getCurrentUser } from './authService';
export { getFingerprint } from './deviceService';
export { getOrCreateCart, migrateCart } from './cartService';
export { signUp, signIn, signInWithProvider, signOut, resetPassword, updatePassword } from './loginService';
export {
  getCategories,
  getCategoriesByType,
  getProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsByCategories,
  searchProducts,
} from './productService';
