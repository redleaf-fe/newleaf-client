import { getUserByName } from '@/api/user';

export function getUserDataByName(userName) {
  return getUserByName({ userName });
}
