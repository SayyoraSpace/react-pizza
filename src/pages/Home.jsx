import React from 'react';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';

const Home = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsloading] = React.useState(true);

  React.useEffect(() => {
    fetch('https://6719dfb5acf9aa94f6a82299.mockapi.io/items')
      .then(res => {
        return res.json();
      })
      .then(arr => {
        setItems(arr);
        setIsloading(false);
      });
  }, []);

  return (
    <>
      <div className="content__top">
        <Categories />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : items.map(obj => <PizzaBlock key={obj.id} {...obj} image={obj.imageUrl} />)}
      </div>
    </>
  );
};

export default Home;
