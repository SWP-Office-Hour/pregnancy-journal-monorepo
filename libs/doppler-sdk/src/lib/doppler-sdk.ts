import DopplerSDK from '@dopplerhq/node-sdk';

export async function dopplerSdk({
  accessToken,
  config = `prd`,
  secret,
}: {
  accessToken: string;
  config?: 'prd' | 'stg' | 'dev';
  secret: string;
}) {
  return (await new DopplerSDK({ accessToken }).secrets.get('swp-office-hour', config, secret)).value!.raw;
}
