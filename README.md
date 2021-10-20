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
/client: yarn serve
```

### Todo

#### Frontend

- [ ] More beautiful colors and design
- [x] Spinner after checkin button pressed
- [ ] Connection error warning
- [x] Error handling
- [ ] Make it more leightweight

#### Home

- [x] Store checkInId in local storage
- [ ] Add expiration to local storage
- [ ] Show time left till on API rate limit error
- [ ] Add ö,ä,ü to regex input validation

#### Admin

- [x] Admin Auth
- [x] Refresh button
- [ ] Delete entry modal => are you sure?
- [ ] Export

### Backend

- [x] API Rate limit
- [x] Use local DB
