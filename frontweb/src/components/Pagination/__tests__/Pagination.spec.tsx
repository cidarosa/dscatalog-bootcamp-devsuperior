import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '..';

describe('Pagination tests', () => {
  test('should render Pagination', () => {
    // ARRANGE
    const pageCount = 3;
    const range = 3;

    // ACT
    render(<Pagination pageCount={pageCount} range={range} />);

    // ASSERT

    const page1 = screen.getByText('1');
    expect(page1).toBeInTheDocument();
    //para testar se a page 1 está ativa - se tem a classe que deixa a bolinha ativa
    expect(page1).toHaveClass('pagination-link-active');

    const page2 = screen.getByText('2');
    expect(page2).toBeInTheDocument();
    expect(page2).not.toHaveClass('pagination-link-active');

    const page3 = screen.getByText('3');
    expect(page3).toBeInTheDocument();
    expect(page3).not.toHaveClass('pagination-link-active');

    const page4 = screen.queryByText('4');
    // queryBy não lança erro
    expect(page4).not.toBeInTheDocument();
  });

  test('next arrow should call onChange', () => {
    // ARRANGE
    const pageCount = 3;
    const range = 3;
    const onChange = jest.fn(); //fn() cria um objeto de mentirinha para simula o comportamento da chamada de função

    // ACT
    render(
      <Pagination pageCount={pageCount} range={range} onChange={onChange} />
    );
    // ASSERT

    const arrowNext = screen.getByTestId('arrow-next');
    //simular o evento
    userEvent.click(arrowNext);

    expect(onChange).toHaveBeenCalledWith(1);
  });


  test('previous arrow should call onChange', () => {
    // ARRANGE
    const pageCount = 3;
    const range = 3;
    const onChange = jest.fn(); //fn() cria um objeto de mentirinha para simula o comportamento da chamada de função
    const forcePage = 1


    // ACT
    render(
      <Pagination 
        pageCount={pageCount} 
        range={range} 
        onChange={onChange}
        forcePage={forcePage}
        />
    );
    // ASSERT

    const arrowPrevious = screen.getByTestId('arrow-previous');
    //simular o evento
    userEvent.click(arrowPrevious);

    expect(onChange).toHaveBeenCalledWith(0);
  });

  test('page link should call onChange', () => {
    // ARRANGE
    const pageCount = 3;
    const range = 3;
    const onChange = jest.fn(); //fn() cria um objeto de mentirinha para simula o comportamento da chamada de função

    // ACT
    render(
      <Pagination pageCount={pageCount} range={range} onChange={onChange} />
    );
    // ASSERT

    const page2 = screen.getByText('2');
    
    
    //simular o evento
    userEvent.click(page2);

    expect(onChange).toHaveBeenCalledWith(1);
  });

});
