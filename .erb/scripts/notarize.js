const { notarize } = require('electron-notarize');
const { build } = require('../../package.json');
require('dotenv').config();

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;
  const appName = context.packager.appInfo.productFilename;

  if (electronPlatformName !== 'darwin') {
    return;
  }
  // TODO DISABLED
  if (process.env.CI !== 'true' && false) {
    console.warn('Skipping notarizing step. Packaging is not running in CI');
    return;
  }

  if ('APPLE_API_KEY' in process.env && 'APPLE_API_ISSUER' in process.env) {
    console.log('Notarizing app... with api');
    await notarize({
      appBundleId: build.appId,
      appPath: `${appOutDir}/${appName}.app`,
      appleApiKey: process.env.APPLE_API_KEY,
      appleApiIssuer: process.env.APPLE_API_ISSUER,
    });
    return;
  }
  if ('APPLE_ID' in process.env && 'APPLE_PASSWORD' in process.env) {
    console.log('Notarizing app... with id');
    await notarize({
      appBundleId: build.appId,
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
    });
    return;
  }
  console.log('Not valid credentials to notorize');
};
