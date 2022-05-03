import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Category } from 'types/category';
import { Product } from 'types/product';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';
import './styles.css';

type UrlParams = {
  productId: string;
};

const Form = () => {
  //para a combobox - testar
  /* const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ]; */

  const { productId } = useParams<UrlParams>();

  const isEditing = productId !== 'create';

  const history = useHistory();

  //pegar categorias do backend
  const [selectCategories, setSelectCategories] = useState<Category[]>([]); //iniciando com lista vazia

  const {
    register,
    handleSubmit,
    formState: { errors },
    // para ver se está editando ou criando um novo produto
    setValue, //permite definir um valor de algum atributo
    control, //para o combobox
  } = useForm<Product>();

  //para buscar da API as categorias e armazenar no selectCategories
  useEffect(() => {
    requestBackend({ url: '/categories' }).then((response) => {
      setSelectCategories(response.data.content);
    });
  }, []);

  // para fazer no começo qdo o componente for montado
  useEffect(() => {
    // se estiver editando, preenche os dados no form
    if (isEditing) {
      // carregar os dados do produto - chama requisição do backend - chamando direto
      requestBackend({ url: `/products/${productId}` }).then((response) => {
        const product = response.data as Product; //variável product tipado

        setValue('name', product.name);
        setValue('price', product.price);
        setValue('description', product.description);
        setValue('imgUrl', product.imgUrl);
        setValue('categories', product.categories);
      });
    }
  }, [isEditing, productId, setValue]); //dependências

  const onSubmit = (formData: Product) => {
    //para formatar o preço, com ponto para casas decimais

    const data = {
      ...formData,
      price: String(formData.price).replace(',', '.'),
    };

    /*    const data = {
      ...formData,
      imgUrl: isEditing
        ? formData.imgUrl
        : 'https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg',
      categories: isEditing ? formData.categories : [{ id: 1, name: '' }],
    }; */

    /* configuração da requesição para salvar o Product */
    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/products/${productId}` : '/products',
      //data: formData, //dados que serão passados
      // data: data, //não precisa colocar qdo o nome da variável é igual ao atributo
      //data: formData,
      data,
      withCredentials: true,
      /* tem que estar autenticado para passar a requisção */
    };

    requestBackend(config)
      .then(() => {
        toast.info('Produto cadastrado com sucesso!');
        history.push('/admin/products'); //volta para a tela anterior
      })
      .catch(() => {
        toast.error('Erro ao cadastrar o produto');
      });
  };

  const handleCancel = () => {
    history.push('/admin/products');
  };

  return (
    //pega do style do List
    <div className="product-crud-container">
      <div className="base-card product-crud-form-card">
        <h1 className="product-crud-form-title">DADOS DO PRODUTO</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row product-crud-inputs-container">
            <div className="col-lg-6 product-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  } `}
                  placeholder="Nome do Produto"
                  name="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <Controller
                  name="categories" //mesmo nome do state, form, type product
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectCategories}
                      classNamePrefix="product-crud-select"
                      isMulti
                      getOptionLabel={(category: Category) => category.name}
                      getOptionValue={(category: Category) =>
                        String(category.id)
                      }
                    />
                  )}
                />

                {errors.categories && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatório
                  </div>
                )}
              </div>

              <div className="margin-bottom-30">
                <Controller
                  name="price"
                  rules={{ required: 'Campo obrigatório' }}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      placeholder="Preço"
                      className={`form-control base-input ${
                        errors.price ? 'is-invalid' : ''
                      } `}
                      disableGroupSeparators={true}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <div className="invalid-feedback d-block">
                  {errors.price?.message}
                </div>
              </div>

              {/* <div className="margin-bottom-30">
                <input
                  {...register('price', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.price ? 'is-invalid' : ''
                  } `}
                  placeholder="Preço"
                  name="price"
                />
                <div className="invalid-feedback d-block">
                  {errors.price?.message}
                </div>
              </div> */}

              <div className="margin-bottom-30">
                <input
                  value={
                    'https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg'
                  }
                  {...register('imgUrl', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                      message: 'URL inválida',
                    },
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  } `}
                  placeholder="Url da Imagem"
                  name="imgUrl"
                />
                <div className="invalid-feedback d-block">
                  {errors.imgUrl?.message}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div>
                <textarea
                  rows={10}
                  {...register('description', {
                    required: 'Campo obrigatório',
                  })}
                  className={`form-control base-input h-auto ${
                    errors.description ? 'is-invalid' : ''
                  } `}
                  placeholder="Descrição"
                  name="description"
                />
                <div className="invalid-feedback d-block">
                  {errors.description?.message}
                </div>
              </div>
            </div>
          </div>

          <div className="product-crud-buttons-container">
            <button
              className="btn btn-outline-danger product-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary product-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
