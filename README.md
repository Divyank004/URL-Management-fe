# URL Management

An app where the user can login, add urls, view the urls in a table and run analysis on the url and view the analysis in a detailed view.

Userflow:

- The user logs in
- Once logged in user can view list of urls with respective data in a table
- User can add new URLs to the table
- When Url is added a request is sent to the backend to run analysis on the URL.
- When the analysis is done the URL info is updated in the table automatically using polling mechanism
- User can also rerun analysis by clicking rerun button in the url specific row
- User can click on a specific row of a url to go to detailed page
- The url detail page contains Pie chart comparing internal and external links, a table showing number of internal, external links and another table showing list of broken links with the error status code.

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Build the app for production

```bash
npm run build
```
