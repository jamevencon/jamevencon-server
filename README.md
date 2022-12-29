# jamevencon-server

## Requirements

- Node.js 9 or higher
- Yarn
- MariaDB (or any MySQL)

## Installation

1. Install dependencies

```bash
yarn
```

2. Run server

```bash
yarn start
```

This will setup database automatically.

## Environment setup

To define pre-defined settings, add below variables to `.env` file

- DB_HOST : host of the database (default is `localhost`)
- DB_PORT : port of the databse (default is `3306`. This variable is numberic. non-integer value will cause exception and kill the process.)
- DB_USER : privileged user for database (default is `jameven`)
- DB_PASSWORD : password of privileged user (default is `jamevencon`)
- DB_DATABASE : name of database (default is `jamevencon`)

## Author

- YEAHx4 (5tarlight)
