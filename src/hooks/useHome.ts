'use client';

import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';

import {
  selectPlantCategories,
  selectAccessoryCategories,
  selectKitCategories,
  selectProducts,
  selectFeaturedProducts,
  selectSelectedCategory,
  selectSearchTerm,
  selectProductsLoading,
  selectProductsError,
  selectCategories,
} from '@/selectors/productSelectors';

import {
  fetchCategories,
  fetchCategoriesByType,
  fetchFeaturedProducts,
  fetchProducts,
} from '@/store/products/thunk/productThunk';

import { filterProductsByCategory, getCategoryType, getFilteredProductsByType } from '@/helpers/productHelpers';
import { useSingleEffect } from './useSingleEffect';
import { Product } from '@/interfaces/product.interface';

export const useHomeData = () => {
  const dispatch = useDispatch<AppDispatch>();

  const plantCategories = useSelector(selectPlantCategories);
  const accessoryCategories = useSelector(selectAccessoryCategories);
  const kitCategories = useSelector(selectKitCategories);
  const products = useSelector(selectProducts);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const selectedCategory = useSelector(selectSelectedCategory);
  const searchTerm = useSelector(selectSearchTerm);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const categories = useSelector(selectCategories);

  useSingleEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchCategoriesByType());
    dispatch(fetchProducts());
    dispatch(fetchFeaturedProducts());
  });

  const plantProducts = useMemo(
    () =>
      filterProductsByCategory(
        products,
        plantCategories.map((cat: { id: string }) => cat.id)
      ),
    [products, plantCategories]
  );

  const accessoryProducts = useMemo(
    () =>
      filterProductsByCategory(
        products,
        accessoryCategories.map((cat: { id: string }) => cat.id)
      ),
    [products, accessoryCategories]
  );

  const kitProducts = useMemo(
    () =>
      filterProductsByCategory(
        products,
        kitCategories.map((cat: { id: string }) => cat.id)
      ),
    [products, kitCategories]
  );

  const featuredKit = useMemo(() => kitProducts.find((product: Product) => product.is_featured), [kitProducts]);

  const selectedCategoryType = useMemo(
    () => getCategoryType(selectedCategory, plantCategories, accessoryCategories, kitCategories),
    [selectedCategory, plantCategories, accessoryCategories, kitCategories]
  );

  const selectedCategoryName = useMemo(
    () => (selectedCategory ? categories.find((cat: { id: string }) => cat.id === selectedCategory)?.name : null),
    [selectedCategory, categories]
  );

  const filteredPlantProducts = useMemo(
    () => getFilteredProductsByType(products, plantProducts, selectedCategory, selectedCategoryType, 'plant'),
    [products, plantProducts, selectedCategory, selectedCategoryType]
  );

  const filteredAccessoryProducts = useMemo(
    () => getFilteredProductsByType(products, accessoryProducts, selectedCategory, selectedCategoryType, 'accessory'),
    [products, accessoryProducts, selectedCategory, selectedCategoryType]
  );

  return {
    plantCategories,
    accessoryCategories,
    kitCategories,
    products,
    featuredProducts,
    selectedCategory,
    searchTerm,
    loading,
    error,
    categories,

    plantProducts,
    accessoryProducts,
    kitProducts,
    featuredKit,
    selectedCategoryType,
    selectedCategoryName,
    filteredPlantProducts,
    filteredAccessoryProducts,
  };
};
