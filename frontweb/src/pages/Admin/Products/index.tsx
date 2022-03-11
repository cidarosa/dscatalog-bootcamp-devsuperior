import { Route, Switch } from 'react-router-dom';
import Form from './Form';
import List from './List';

const Products = () => {
  return (
    <div>
      <Switch>
        <Route path="/admin/products" exact>
          {/* chama o componente LIST */}
          <List />
        </Route>
        {/* Rota com argumento para o ID do produto */}
        <Route path="/admin/products/:productId">
          {/* chama o componente FORM */}
          <Form />
        </Route>
      </Switch>
    </div>
  );
};

export default Products;
