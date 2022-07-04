infra:
	docker-compose up -d

infra-stop:
	docker-compose down

infra-clean:
	docker-compose rm --stop --force

generate:
	npx prisma generate

migrate: install
	npx prisma migrate dev --name init

.PHONY: infra
.PHONY: infra-stop
.PHONY: infra-clean
.PHONY: generate
.PHONY: migrate