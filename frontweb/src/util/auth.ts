import { getTokenData } from './token';
import { Role } from 'types/role';

export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();
  return tokenData && tokenData.exp * 1000 > Date.now() ? true : false;
};

export const hasAnyRoles = (roles: Role[]): boolean => {
  if (roles.length === 0) {
    return true;
  }

  const tokenData = getTokenData();

  //usando função de alta ordem
  //some => algum
  /*
    if (tokenData !== undefined) {
      return roles.some((role) => tokenData.authorities.includes(role));
    }
    */

  if (tokenData !== undefined) {
    for (var i = 0; i < roles.length; i++) {
      if (tokenData.authorities.includes(roles[i])) {
        return true;
      }
    }
  }
  return false;
};
