# Flight Check-in

Needs .env! See .env-sample

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
