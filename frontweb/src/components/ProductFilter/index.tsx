import { ReactComponent as SearchIcon } from 'assets/images/search-icon.svg';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Category } from 'types/category';
import { requestBackend } from 'util/requests';

import './styles.css';

export type ProductFilterData = {
  name: string;
  category: Category | null; //recebe tipo Cate4gory ou null
};

type Props = {
  onSubmitFilter: (data: ProductFilterData) => void;
};

const ProductFilter = ({ onSubmitFilter }: Props) => {
  //pegar categorias do backend
  const [selectCategories, setSelectCategories] = useState<Category[]>([]); //iniciando com lista vazia

  const { register, handleSubmit, setValue, getValues, control } =
    useForm<ProductFilterData>();

  const onSubmit = (formData: ProductFilterData) => {
    // console.log('ENVIOU ', formData);
    onSubmitFilter(formData);
  };

  const handleFormClear = () => {
    //limpar valores do FORM para vazio e nulo
    // usa setValue do useForm => campo, valor
    setValue('name', '');
    setValue('category', null);
  };

  //usa tipo Category
  //para quando mudar a categoria no select
  const handleChangeCategory = (value: Category) => {
    setValue('category', value); //set novo valor de category
    //envia os dados do form com o novo valor

    //pegar os dados do form
    //obj do tipo  //usar getValues do useForm
    const obj: ProductFilterData = {
      //usar getValues do useForm
      name: getValues('name'),
      category: getValues('category'),
    };

    //provisório
    // console.log('ENVIOU ', obj);
    onSubmitFilter(obj);
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
                  onChange={(value) => handleChangeCategory(value as Category)} //casting
                  getOptionLabel={(category: Category) => category.name}
                  getOptionValue={(category: Category) => String(category.id)}
                />
              )}
            />
          </div>
          <button
            onClick={handleFormClear}
            className="btn btn-outline-secondary btn-product-filter-clear"
          >
            LIMPAR<span className="btn-product-filter-word"> FILTRO</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilter;
