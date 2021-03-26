import { createApp, startApp } from '../src';
import { TRawManifest } from '../src/types';
import { createConfig } from '../src/lib/config';

type TContextHelpers = {
  greet(name: string): void;
};

const contextHelpers: TContextHelpers = {
  greet: (name) => {
    console.log(`Hello, ${name}`);
  },
};

const manifest: TRawManifest<TContextHelpers> = {
  resources: {
    AccessPolicy: {},
  },
  entities: {},
  operations: {
    test: {
      method: 'GET',
      path: ['$test-operation'],
      handler: async (context) => {
        context.greet('Alice');
        context.log({message: {test: true}, v: '2020.02', fx: "testOperation", type: "backend-test"})
        return { resource: {test:true} };
      },
    },
  },
  subscriptions: {
    // Patient_handler
    Patient: {
      handler: () => {
        console.log('qwerty');
        return true;
      },
    },
  },
};

const main = async () => {
  const config = createConfig();

  const app = createApp<TContextHelpers>(config, manifest, contextHelpers);
  if (!app) {
    console.error(`Unable to create app. Check config/manifest errors.`);
    process.exit(1);
  }
  await startApp(app);
};

if (require.main === module) {
  main();
}
