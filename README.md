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
- [ ] Spinner after checkin button pressed
- [ ] Server offline warning
- [ ] Error handling
- [ ] Make it more leightweight

#### Home

- [x] Store checkInId in local storage
- [ ] Add expiration to local storage
- [ ] Add ö,ä,ü to regex input validation

#### Admin

- [x] Admin Auth
- [x] Refresh button
- [ ] Export

### Backend

- [x] API Rate limit
- [x] Use local DB
