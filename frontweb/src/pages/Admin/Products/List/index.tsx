import { Link } from 'react-router-dom';
import ProductCrudCard from 'pages/Admin/Products/ProductCrudCard';

import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Product } from 'types/product';

import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';

import Pagination from 'components/Pagination';

import ProductFilter, { ProductFilterData } from 'components/ProductFilter';

import './styles.css';

// guardar estado dos controles - paginação e filtragem
type ControlComponentsData = {
  activePage: number; //indica qual página está ativa, vem do comp. paginação
  //para a filtragem
  filterData: ProductFilterData;
};

const List = () => {
  // estado da página
  const [page, setPage] = useState<SpringPage<Product>>();

  // guardar estado dos controles - paginação e filtragem
  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0,
      //dados iniciais
      filterData: { name: '', category: null },
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber,
      filterData: controlComponentsData.filterData,
    });
  };

  //type ProductFilterData está como export
  const handleSubmitFilter = (data: ProductFilterData) => {
    setControlComponentsData({
      activePage: 0,
      filterData: data,
    });
  };

  const getProducts = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/products',
      params: {
        page: controlComponentsData.activePage,
        size: 3,
        name: controlComponentsData.filterData.name,
        categoryId: controlComponentsData.filterData.category?.id,
      },
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="product-crud-container">
      <div className="product-crud-bar-container">
        <Link to="/admin/products/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>

        <ProductFilter onSubmitFilter={handleSubmitFilter} />
      </div>

      <div className="row">
        {page?.content.map((product) => (
          <div key={product.id} className="col-sm-6 col-md-12">
            <ProductCrudCard product={product} onDelete={getProducts} />
          </div>
        ))}
      </div>
      {/* parâmetros do  useState - SpringPage*/}
      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </div>
  );
};
export default List;
