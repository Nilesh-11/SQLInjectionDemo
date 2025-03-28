# SQLInjectionDemo

This site is vulnerable to SQL Injection.
![Homepage](Others/homepage.png)

## Requirements
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Initialization
- Enter Superuser and Webuser credentials in [docker-compose file](./docker-compose.yml) and [sql file](./Backend/init.sql)

## Installation Instructions
- Run `docker-compose up --build`

App will be accessible at [http://localhost:3000](http://localhost:3000)