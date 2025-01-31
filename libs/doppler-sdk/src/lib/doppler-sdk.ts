import DopplerSDK, { SecretsGetResponse } from '@dopplerhq/node-sdk';

export function dopplerSdk({
  accessToken,
  config,
  secret,
}: {
  accessToken: string;
  config: string;
  secret: string;
}): Promise<SecretsGetResponse> {
  return new DopplerSDK({ accessToken }).secrets.get('swp-office-hour', config, secret);
}
