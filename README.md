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

- [ ] Store checkInId in local storage for 12 hours

#### Admin

- [ ] Admin Auth
- [ ] Export

### Backend

- [ ] API Rate limit
- [ ] Use local DB
