import qs from 'qs';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination/index';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import { fetchPizzas, selectPizzaData } from '../redux/slices/pizzaSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, status } = useSelector(selectPizzaData);
  const categoryId = useSelector(state => state.filter.categoryId);
  const sort = useSelector(state => state.filter.sort.sortProperty);
  const currentPage = useSelector(state => state.filter.currentPage);
  const searchValue = useSelector(state => state.filter.searchValue);

  const onChangeCategory = id => {
    dispatch(setCategoryId(id));
  }; // Изменение выбранной категории

  const onChangePage = number => {
    dispatch(setCurrentPage(number));
  }; // Изменение текущей страницы

  // получаем данные из url
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)); // Извлекаем параметры из строки запроса
      dispatch(
        setFilters({
          ...params, // Все параметры из строки запроса передаем в Redux
          currentPage: Number(params.currentPage), // Изменение текущей страницы из строки запроса
        }),
      );
    }
  }, [dispatch]); // Передаем dispatch в зависимости от изменения dispatch из Redux при первом рендере

  const getPizzas = useCallback(async () => {
    const category = categoryId > 0 ? `&category=${categoryId}` : '';
    const sortBy = sort.replace('-', ''); // Сортировка по полю без знака "-"
    const order = sort.includes('-') ? 'asc' : 'desc';
    const search = searchValue ? `&search=${searchValue}` : '';

    // Запрашиваем пиццы с сервера и передаем в Redux
    dispatch(
      fetchPizzas({
        category,
        sortBy,
        order,
        search,
        currentPage,
      }),
    );
    window.scrollTo(0, 0);
  }, [categoryId, currentPage, dispatch, searchValue, sort]); // Передаем dispatch в зависимости от изменения dispatch из Redux

  // Запрашиваем пиццы при первом рендере
  React.useEffect(() => {
    getPizzas();
  }, [getPizzas]);

  // Запрашиваем пиццы при смене параметров
  React.useEffect(() => {
    const queryString = qs.stringify({
      sort,
      categoryId,
      currentPage,
    });
    navigate(`?${queryString}`);
  }, [categoryId, sort, currentPage, navigate]);

  const categoryNames = ['Все пиццы', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];
  const pizzas = items.map(obj => (
    <Link key={obj.id} to={`/pizza/${obj.id}`}>
      <PizzaBlock {...obj} image={obj.imageUrl} />
    </Link>
  ));
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">{categoryNames[categoryId]}</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>
            Произошла ошибка<span>😕</span>
          </h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
