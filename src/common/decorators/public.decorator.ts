import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/guard.constans';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
