import { render, screen } from '@testing-library/react';
import Pagination from '..';

describe('Pagination tests', () => {
  test('should render Pagination', () => {
    // ARRANGE
    const pageCount = 3;
    const range = 3;

    // ACT
    render(<Pagination 
        pageCount={pageCount} 
        range={range} />
        );

    // ASSERT

    const page1 = screen.getByText("1");
     expect(page1).toBeInTheDocument();
     //para testa se a page 1 está ativa - se tem a classe que deixa a bolinha ativa
     expect(page1).toHaveClass("pagination-link-active");

     const page2 = screen.getByText("2");
     expect(page2).toBeInTheDocument();
     expect(page2).not.toHaveClass("pagination-link-active");

     const page3 = screen.getByText("3");
     expect(page3).toBeInTheDocument();
     expect(page3).not.toHaveClass("pagination-link-active");

     const page4 = screen.queryByText("4");
     // queryBy não lança erro
     expect(page4).not.toBeInTheDocument();
  });
});
