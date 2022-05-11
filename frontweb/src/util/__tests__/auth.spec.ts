
import { hasAnyRoles } from './../auth';

//para mokar o Token - referência para o arquivo do token
import * as TokenModule from '../token';

describe('hasAnyRoles tests', () => {
  test('should return true when empty list', () => {
    const result = hasAnyRoles([]);
    expect(result).toEqual(true);
  });

  test('should return true when user has given role', () => {

    // mokando o token - simulação do retorno da função TokenData
    jest.spyOn(TokenModule, 'getTokenData').mockReturnValue({
      //estrutura do TokenData
      exp: 0,
      user_name: '',
      authorities: ['ROLE_ADMIN', 'ROLE_OPERATOR'],
    });

    //pega o resultado dos dados mokados
    const result = hasAnyRoles(['ROLE_ADMIN']);
    expect(result).toEqual(true);
  });
});
