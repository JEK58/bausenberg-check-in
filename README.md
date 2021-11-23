# bausenberg-check-in

Needs .env! See .env-sample

### Rebuild with docker

#### Production

```
docker-compose -f docker-compose-prod.yml up --force-recreate --build
```

#### Development

```
docker-compose -f docker-compose-dev.yml up --force-recreate --build
```

### Todo

#### Frontend

- [ ] More beautiful colors and design
- [x] dark mode
- [x] Spinner after checkin button pressed
- [x] Connection error warning
- [x] Error handling
- [ ] Make it more leightweight
- [ ] Make the footer sticky

#### Home

- [x] Store checkInId in local storage
- [ ] Add expiration to local storage
- [ ] Show time left till on API rate limit error
- [x] Show rate limit warning
- [x] Add ö,ä,ü to regex input validation

#### Admin

- [x] Admin Auth
- [ ] Statistics for each year
- [x] Refresh button
- [x] Delete entry modal => are you sure?
- [ ] Error handling
- [ ] Export

### Backend

- [x] API Rate limit
- [x] Use local DB
