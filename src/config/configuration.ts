export default () => ({
  baseUrl: process.env.BASE_URL,
  port: Number(process.env.PORT) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
  },
  user: {
    default: {
      role: process.env.USER_DEFAULT_ROLE,
      permission: process.env.USER_DEFAULT_PERMISSION,
    },
    login: {
      credential: {
        role: process.env.USER_LOGIN_DEFAULT_ROLE,
        permission: process.env.USER_LOGIN_DEFAULT_PERMISSION,
      },
      external: {
        role: process.env.USER_LOGIN_EXTERNAL_ROLE,
        permission: process.env.USER_LOGIN_EXTERNAL_PERMISSION,
      },
    },
  },
  jwt: {
    secret:
      'This is a secret string, using another string and do not expose it to other people',
    accessTokenExpire: {
      string: '5m',
      number: 1000 * 60 * 5,
    },
    confirmationTokenExpire: {
      string: '1d',
      number: 1000 * 60 * 60 * 24,
    },
    refreshTokenExpire: {
      string: '7d',
      number: 1000 * 60 * 60 * 24 * 7,
    },
  },
  isPublicKey: 'isPublic',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  files: {
    pic: {
      dest: process.env.FILES_PIC_DEST,
    },
  },
});
// https://docs.nestjs.com/techniques/configuration
