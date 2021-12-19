#!/bin/bash
set -e #Exit if any command failed with != 0

docker exec -i bausenberg-check-in-db /usr/bin/mongodump --username $DB_USER --password $DB_PW \
	 --authenticationDatabase admin --db $DB --out /dump
echo "Dump OK"

mkdir -p /home/rml/mongo-backups
cd /home/rml/mongo-backups

docker cp bausenberg-check-in-db:/dump .
echo  "Copy from docker OK"

filename=backup_$(date +"%Y-%m-%d").zip
zip -r $filename dump
rm -rf dump
sshpass -p '$PASSWORD' sftp $USER@$HOST:/ <<<$'put '$filename
echo  "All done"