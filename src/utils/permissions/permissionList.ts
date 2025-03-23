import { permissionsFor } from './permissionsFor';
import { permissionsForProfile } from './permissionsForProfile';

export const permissionList = (() => {
  return generate();
})();

// note: permissionsFor pass Name of Controller (without Contorller part)
// note: 3 main points: add permision object, add permission array, add permision to global list
function generate() {
  const profilePermissions = permissionsForProfile();
  const userPermissions = permissionsFor('User');
  const transactionPermissions = permissionsFor('Transaction');
  const userPermissionsPermissions = permissionsFor('UserPermissions');

  const profileList = Object.values(profilePermissions);
  const userList = Object.values(userPermissions);
  const transactionList = Object.values(transactionPermissions);
  const permissionsList = Object.values(userPermissionsPermissions);

  const list = profileList
    .concat(userList)
    .concat(transactionList)
    .concat(permissionsList);

  return {
    profileList,
    userList,
    transactionList,
    permissionsList,
    list,
    profile: profilePermissions,
    user: userPermissions,
    transactions: transactionPermissions,
    permissions: userPermissionsPermissions,
  }
}