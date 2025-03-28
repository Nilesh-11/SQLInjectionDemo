import psycopg2.pool
from contextlib import contextmanager
from psycopg2 import DatabaseError

class dbManager:
    def __init__(self, dbname, user, password, host='localhost', port='5432'):
        self.connection_pool = psycopg2.pool.SimpleConnectionPool( minconn=5, maxconn=40, 
                                                                        dbname=dbname,
                                                                        user=user,
                                                                        password=password,
                                                                        host=host,
                                                                        port=port
                                                                    )

    def _connect(self):
        try:
            connection = self.connection_pool.getconn()
            return connection
        except DatabaseError as e:
            print(f"Error while connecting to database: {e}")
            raise
                                                            
    @contextmanager
    def get_cursor(self):
        connection = None
        cursor = None
        try:
            connection = self._connect()
            cursor = connection.cursor()
            yield cursor 
            connection.commit() 
        except Exception as e:
            if connection:
                connection.rollback()
            print(f"Error executing database operation: {e}")
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.connection_pool.putconn(connection)

    def execute_query(self, query, params=None):
        connection = self._connect()
        cursor = connection.cursor()
        cursor.execute(query, params)
        connection.commit()
        cursor.close()
        self.connection_pool.putconn(connection)

    def fetch_all(self, query, params=None):
        with self.get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    def fetch_one(self, query, params=None):
        with self.get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()