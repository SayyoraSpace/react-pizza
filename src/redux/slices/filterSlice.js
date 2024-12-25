import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchValue: '',
  categoryId: 0,
  currentPage: 1,
  sort: {
    name: 'популярности',
    sortProperty: 'rating',
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategoryId(state, action) {
      state.categoryId = action.payload; // Изменение выбранной категории
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload; // Изменение значения поиска
    },
    setSort(state, action) {
      state.sort = action.payload; // Изменение типа сортировки
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload; // Изменение текущей страницы
    },
    setFilters(state, action) {
      state.sort.sortProperty = action.payload.sort;
      state.currentPage = Number(action.payload.currentPage);
      state.categoryId = Number(action.payload.categoryId);
    },
  },
});

export const selectSort = state => state.filter.sort;

export const { setCategoryId, setSort, setCurrentPage, setFilters, setSearchValue } =
  filterSlice.actions;

export default filterSlice.reducer;
