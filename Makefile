infra:
	docker-compose up -d

infra-stop:
	docker-compose down

infra-clean:
	docker-compose rm --stop --force

.PHONY: infra