#!/bin/bash
set -e #Exit if any command failed with != 0

docker exec -i bausenberg-check-in-db /bin/bash -c "PGPASSWORD=$POSTGRES_PW \
         pg_dump --username $POSTGRES_USER $POSTGRES_DB -f pg_dump.sql"

echo "Dump OK"

mkdir -p /home/rml/pg-backups
cd /home/rml/pg-backups

docker cp bausenberg-check-in-db:/pg_dump.sql .
echo  "Copy from docker OK"

filename=backup_$(date +"%Y-%m-%d").zip
zip -r $filename pg_dump.sql
rm -rf pg_dump.sql
sshpass -p '$PASSWORD' sftp $USER@$HOST:/ <<<$'put '$filename
echo  "All done"