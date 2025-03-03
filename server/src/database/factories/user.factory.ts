import { createFinalPassword } from 'src/shared/utils';
import { User } from 'src/users/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.username = user.email;
  user.isEmailVerified = true;
  user.password = createFinalPassword('thepassword');

  return user;
});
