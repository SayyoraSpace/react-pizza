import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalPrice: 0,
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find(obj => obj.id === action.payload.id); // существует ли в корзине товар с таким же id
      if (findItem) {
        findItem.count++; // если да, то увеличиваем его количество
      } else {
        state.items.push({
          ...action.payload,
          count: 1, // если нет, то добавляем в корзину новый товар
        });
      }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum; // считаем общую стоимость
      }, 0);
    },

    // уменьшаем количество товара
    minusItem(state, action) {
      const findItem = state.items.find(obj => obj.id === action.payload);
      if (findItem) {
        findItem.count--;
        state.totalPrice = state.items.reduce((sum, obj) => {
          return obj.price * obj.count + sum; // уменьшает кол-во товаров в корзине на 1 и  обновляет общую цену
        }, 0);
      }
    },

    // удаляем товар
    removeItem(state, action) {
      state.items = state.items.filter(obj => obj.id !== action.payload);
    },

    // очистка корзины
    clearItem(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const selectCart = state => state.cart;

export const selectCartItemById = id => state => state.cart.items.find(obj => obj.id === id);

export const { addItem, removeItem, minusItem, clearItem } = cartSlice.actions;

export default cartSlice.reducer;
