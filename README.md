# bausenberg-check-in

Needs .env with:

```
MONGO_ROOT_USER=
MONGO_ROOT_PASSWORD=

DB_CONNECTION=mongodb://MONGO_ROOT_USER:MONGO_ROOT_PASSWORD@db:27017/bausenberg-check-in?authSource=admin
```

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
- [ ] Server offline warning
- [ ] Make it more leightweight

#### Home

- [x] Store checkInId in local storage
- [ ] Add expiration to local storage
- [ ] Add ö,ä,ü to regex input validation

#### Admin

- [ ] Admin Auth
- [ ] Export

### Backend

- [ ] API Rate limit
- [ ] Use local DB
