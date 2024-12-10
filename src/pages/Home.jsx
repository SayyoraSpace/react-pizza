import axios from 'axios';
import qs from 'qs';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { SearchContext } from '../App';
import Categories from '../components/Categories';
import Pagination from '../components/Pagination/index';
import PizzaBlock from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryId = useSelector(state => state.filter.categoryId);
  const sort = useSelector(state => state.filter.sort.sortProperty);
  const currentPage = useSelector(state => state.filter.currentPage);

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]); // Хранит список пицц
  const [isLoading, setIsloading] = React.useState(true);

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
          // Устанавливаем фильтры в Redux
          ...params,
          currentPage: Number(params.currentPage),
        }),
      );
    }
  }, [dispatch]);

  // Получаем пиццы с сервера и записываем в state
  React.useEffect(() => {
    setIsloading(true);
    const category = categoryId > 0 ? `&category=${categoryId}` : '';
    const sortBy = sort.replace('-', ''); // Сортировка по полю без знака "-"
    const order = sort.includes('-') ? 'asc' : 'desc';
    const search = searchValue ? `&search=${searchValue}` : '';

    axios
      .get(
        `https://6719dfb5acf9aa94f6a82299.mockapi.io/items?page=${currentPage}&limit=4${category}&sortBy=${sortBy}&order=${order}${search}`,
      )
      .then(res => {
        setItems(res.data);
        setIsloading(false);
      })
      .catch(() => {
        setIsloading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sort, searchValue, currentPage]);

  // Записываем параметры в url
  React.useEffect(() => {
    const queryString = qs.stringify({
      sort,
      categoryId,
      currentPage,
    });
    navigate(`?${queryString}`);
  }, [categoryId, sort, currentPage, navigate]);

  const categoryNames = ['Все пиццы', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];
  const pizzas = items.map(obj => <PizzaBlock key={obj.id} {...obj} image={obj.imageUrl} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">{categoryNames[categoryId]}</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
