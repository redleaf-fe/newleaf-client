import { getUserByName } from '@/api/user';

export function getUserDataByName(username) {
  return getUserByName({ username });
}
