import { get } from 'lodash';

class UserUtil {
  // DMS 2.0
  id = user => get(user, 'userId', null);

  tenantId = user => get(user, 'tenantId', null);

  email = user => get(user, 'email', '');

  firstName = user => get(user, 'firstName', '');

  lastName = user => get(user, 'lastName', '');

  phoneNumber = user => get(user, 'phoneNumber', '');

  role = user => get(user, 'role', '');

  userId = user => get(user, 'userId', '');

  fullName = user =>
    `${get(user, 'firstName', '')} ${get(user, 'lastName', '')}`;
}

export default new UserUtil();
