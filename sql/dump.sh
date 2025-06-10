cat 1.init.sql \
 2.store.sql > temp.sql

PGPASSWORD=1234 psql -h localhost -p 5432 -U postgres -d postgres -f temp.sql
