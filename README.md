# SQLInjectionDemo

This site is vulnerable to SQL Injection.
![Homepage](Others/homepage.png)

## Installation Instructions

### Prerequisites  
Ensure you have the following versions installed:  

- **Python**  
    ```sh
    Python 3.11.5
    ```
- **NodeJS**  
    ```sh
    v22.2.0
    ```
- **npm**  
    ```sh
    10.7.0
    ```
- **PostgreSQL**  
    ```sh
    "PostgreSQL 17.2 on x86_64-windows, compiled by msvc-19.42.34435, 64-bit"
    ```
- Make sure you enter correct database details in /Backend/.env file
    ```sh
    DBHOST=localhost
    DBPORT=5432
    DBNAME=Test
    DBUSER=postgres
    DBPASSWORD=acoolpassword
    ```

## Installation Steps

### Frontend (App)
1. Navigate to the `app` directory:
    ```sh
    cd app
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend server:
    ```sh
    npm start
    ```

### Backend
1. Navigate to the `Backend` directory:
    ```sh
    cd Backend
    ```
2. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Start the backend server:
    ```sh
    python server.py
    ```