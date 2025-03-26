-- Create the user if it does not exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hacker') THEN
        CREATE USER hacker WITH ENCRYPTED PASSWORD '1234';
    END IF;
END $$;

-- Grant connection privileges and TEMP privilege at the database level
GRANT CONNECT, TEMP ON DATABASE "Test" TO hacker;

-- Grant necessary permissions on the schema
GRANT USAGE, CREATE ON SCHEMA public TO hacker;  -- Allow creating tables

-- Ensure user has full control over tables they create
ALTER DEFAULT PRIVILEGES FOR ROLE hacker IN SCHEMA public 
GRANT ALL ON TABLES TO hacker;

-- Ensure user has full control over sequences they create
ALTER DEFAULT PRIVILEGES FOR ROLE hacker IN SCHEMA public 
GRANT ALL ON SEQUENCES TO hacker;

-- Ensure user has full control over functions they create
ALTER DEFAULT PRIVILEGES FOR ROLE hacker IN SCHEMA public 
GRANT ALL ON FUNCTIONS TO hacker;

-- Restrict unnecessary privileges from the public role
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
