#!/bin/bash

# Define the container and database names
CONTAINER_NAME=
DATABASE_NAME=

# Define DB credentials
PG_USER=
PG_PASSWORD=

# Define the SFTP server details
SFTP_USER=
SFTP_HOST=
SFTP_PORT=
SFTP_REMOTE_DIR=
SFTP_PASSWORD=

# Get the current date and time
DATE=$(date +%Y-%m-%d-%H-%M-%S)

# Create a directory for the backups
mkdir -p backups

# Create the backup file name
BACKUP_FILE="backups/${DATABASE_NAME}-${DATE}.sql"

# Use `docker exec` to run the `pg_dump` command in the container and write the output to a file
docker exec -t ${CONTAINER_NAME} pg_dump -U ${PG_USER} -w ${DATABASE_NAME} > ${BACKUP_FILE}

# Check the exit status of the pg_dump command
if [ "$?" -eq 0 ]; then
  echo "Backup successful: ${BACKUP_FILE}"
else
  echo "Backup failed"
  exit 1
fi

# Compress the backup file
echo "Compressing backup file..."
gzip ${BACKUP_FILE}
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload the backup file to the remote SFTP server
# Needs sshpass to be installed... 
# sudo apt-get install sshpass

echo "Uploading backup file to SFTP server..."
sshpass -p ${SFTP_PASSWORD} sftp -P ${SFTP_PORT} ${SFTP_USER}@${SFTP_HOST}:${SFTP_REMOTE_DIR} <<< "put ${BACKUP_FILE}"

# Check the exit status of the SFTP command
if [ "$?" -eq 0 ]; then
  echo "Upload successful"
else
  echo "Upload failed"
  exit 1
fi

# Cleanup the local backup file
echo "Cleaning up local backup file..."
rm ${BACKUP_FILE}

echo "Backup and upload complete"