import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, useParams } from 'react-router-dom';
import selectEvent from 'react-select-event';
import { ToastContainer } from 'react-toastify';
import history from 'util/history';
import Form from '../Form';

import { server } from './fixtures';

//server mockado
beforeAll(() => {
  // Establish requests interception layer before all tests.

  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  // Clean up after all tests are done, preventing this

  // interception layer from affecting irrelevant tests.

  server.close();
});

//mockando react-router-dom - userParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('Product form create tests', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({
      productId: 'create',
    });
  });

  test('should render Form', async () => {
    render(
      //precisa usar o Router por causa do Swuitch
      <Router history={history}>
        <ToastContainer />
        <Form />
      </Router>
    );

    const nameInput = screen.getByTestId('name');
    const priceInput = screen.getByTestId('price');
    const imgUrlInput = screen.getByTestId('imgUrl');
    const descriptionInput = screen.getByTestId('description');

    // Categorias -> texto que foi colocado no Label do select do form
    const categoriesInput = screen.getByLabelText('Categorias');

    //selecionando o botão
    const submitButton = screen.getByRole('button', { name: /salvar/i });

    //pegando do Combo
    await selectEvent.select(categoriesInput, ['Eletrônicos', 'Computadores']);
    //simulando a digitaçao nas caixas de texto
    userEvent.type(nameInput, 'Computador');
    userEvent.type(priceInput, '5000.12');
    userEvent.type(
      imgUrlInput,
      'https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg'
    );
    userEvent.type(descriptionInput, 'Computador muito bom');

    //simulando o click no botão
    userEvent.click(submitButton);

    await waitFor(() => {
      const toastElement = screen.getByText('Produto cadastrado com sucesso!');
      expect(toastElement).toBeInTheDocument();
    });
  });
});
