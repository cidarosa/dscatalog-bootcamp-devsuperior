import { render, screen } from '@testing-library/react';
import ButtonIcon from '..';

test('ButtonIcon should render button with given text', () => {
  //ARRANGE
  const text = "Fazer Login";

  //ACT
  //Renderizar o HTML
  render(<ButtonIcon text={text} />);

  //Encontrar o nó que queremos testar

  //verificar conteúdo

  //ASSERT
  //Encontrar o nó que queremos testar
  // Queries da Testing Library para encontrar elementos
  // https://testing-library.com/docs/queries/about
  expect(screen.getByText(text)).toBeInTheDocument();
});
