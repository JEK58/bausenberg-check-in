# bausenberg-check-in

Needs `DB_CONNECTION=` in .env

### Rebuild with docker

```
docker-compose -f docker-compose-prod.yml up --force-recreate --build
```

### Todo

#### Frontend

- [ ] More beautiful colors and design
- [ ] Server offline warning
- [ ] Make it more leightweight

#### Home

- [x] Store checkInId in local storage
- [ ] Add expiration to local storage

#### Admin

- [ ] Admin Auth
- [ ] Export

### Backend

- [ ] API Rate limit
- [ ] Use local DB
