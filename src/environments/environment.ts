// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
    // para firebase
    firebase: {
        apiKey: "AIzaSyCA9s-H7elfUnvtx8eI7xx1QBXmdEkGuhs",
        authDomain: "valantynespa.firebaseapp.com",
        databaseURL: "https://valantynespa.firebaseio.com",
        projectId: "valantynespa",
        storageBucket: "valantynespa.appspot.com",
        messagingSenderId: "524365887677"
    }
};
