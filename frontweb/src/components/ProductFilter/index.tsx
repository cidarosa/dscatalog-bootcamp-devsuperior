import { ReactComponent as SearchIcon } from 'assets/images/search-icon.svg';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Category } from 'types/category';
import { requestBackend } from 'util/requests';

import './styles.css';

type ProductFilterData = {
  name: string;
  category: Category;
};

const ProductFilter = () => {
  //pegar categorias do backend
  const [selectCategories, setSelectCategories] = useState<Category[]>([]); //iniciando com lista vazia

  const { register, handleSubmit, control } = useForm<ProductFilterData>();

  const onSubmit = (formData: ProductFilterData) => {
    console.log('ENVIOU ', formData);
  };

  //para buscar da API as categorias e armazenar no selectCategories
  useEffect(() => {
    requestBackend({ url: '/categories' }).then((response) => {
      setSelectCategories(response.data.content);
    });
  }, []);

  return (
    <div className="base-card product-filter-container">
      <form onSubmit={handleSubmit(onSubmit)} className="product-filter-form">
        <div className="product-filter-name-container">
          <input
            {...register('name')}
            type="text"
            className="form-control"
            placeholder="Nome do produto"
            name="name"
          />

          <button className="product-filter-search-icon">
            <SearchIcon />
          </button>
        </div>

        <div className="product-filter-bottom-container">
          <div className="product-filter-category-container">
            <Controller
              name="category" //mesmo nome do state, form, type product
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={selectCategories}
                  isClearable
                  placeholder="Categoria"
                  classNamePrefix="product-filter-select"
                  getOptionLabel={(category: Category) => category.name}
                  getOptionValue={(category: Category) => String(category.id)}
                />
              )}
            />
          </div>
          <button className="btn btn-outline-secondary btn-product-filter-clear">
            LIMPAR<span className='btn-product-filter-word'> FILTRO</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilter;