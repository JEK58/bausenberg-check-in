# bausenberg-check-in

Needs .env! See .env-sample

### Rebuild with docker

#### Production

```
docker-compose -f docker-compose-prod.yml up --force-recreate --build
```

#### Development

```
docker-compose -f docker-compose-dev.yml up
```

Or if the Dockerfile changed:

```
docker-compose -f docker-compose-dev.yml up --force-recreate --build
```

### Todo

#### Frontend

- [x] More beautiful colors and design
- [x] dark mode
- [x] Spinner after checkin button pressed
- [x] Connection error warning
- [x] Error handling
- [x] Make it more leightweight
- [x] Make the footer sticky

#### Home

- [x] Store checkInId in local storage
- [ ] Add expiration to local storage
- [ ] Show time left till on API rate limit error
- [x] Show rate limit warning
- [x] Add ö,ä,ü to regex input validation

#### Admin

- [x] Admin Auth
- [x] Statistics for each year
- [x] Refresh button
- [x] Delete entry modal => are you sure?
- [x] Error handling
- [ ] Export
- [ ] Sweetalert dark mode

### Backend

- [x] API Rate limit
