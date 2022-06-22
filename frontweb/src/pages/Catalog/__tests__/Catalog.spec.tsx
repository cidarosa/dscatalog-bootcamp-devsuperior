import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import history from 'util/history';
import Catalog from '..';

import { server } from './fixtures';

//server mockado
beforeAll(() => {

    // Establish requests interception layer before all tests.
  
    server.listen()
  
  });

  afterEach( () => server.resetHandlers());
  
  afterAll(() => {
  
    // Clean up after all tests are done, preventing this
  
    // interception layer from affecting irrelevant tests.
  
    server.close()
  
  });

test('should render Catalog with products', async () => {
  render(
    <Router history={history}>
      <Catalog />
    </Router>
  );

  //screen.debug();

  expect(screen.getByText('Catálogo de Produtos')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Smart TV')).toBeInTheDocument();
  });

  //screen.debug();

  
});
