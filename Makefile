NODE_ENV?=development
APP_NAME:=b2c-viator-experiences

# set the nvm path based on the environment
ifneq (,$(wildcard ~/.nvm/nvm.sh))
ENV_NVM_PATH=~/.nvm/nvm.sh
else ifneq (,$(wildcard /usr/local/lib/nvm/nvm.sh))
ENV_NVM_PATH=/usr/local/lib/nvm/nvm.sh
endif

# create a nvm alias which setup nvm before each tasks using it
# @see https://devops.stackexchange.com/questions/629/how-can-i-make-use-of-bash-functions-in-a-makefile
nvm = . $(ENV_NVM_PATH) || true && nvm install > /dev/null 2>&1 && nvm use > /dev/null 2>&1 && $(1)
ifeq ($(ENV_NVM_PATH),)
nvm = $(1)
endif

.PHONY: build
build: install compile

.PHONY: install
install:
	$(call nvm, npm ci)

.PHONY: compile
compile:
	$(call nvm, npm run build)

.PHONY: lint
lint:
	$(call nvm, npm run lint)

.PHONY: test
test:
	$(call nvm, npm test)

.PHONY: generate-graphql-schema
generate-graphql-schema:
	$(call nvm, npm run generate:graphql-schema)

.PHONY: test-unit
test-unit:
	$(call nvm, npm run test:unit)

.PHONY: test-functional
test-functional:
	$(call nvm, npm run test:functional)

.PHONY: coverage-report
coverage-report:
	$(call nvm, npm run coverage:report)

pull-translations:
	$(call nvm, npm run pull-translations)

.PHONY: healthz
healthz:
	$(call nvm, npm run monitor:health)

.PHONY: graphql-type-check
graphql-type-check:
	$(call nvm, npm run ci:graphql-type-check)

.PHONY: dev-tags-check
dev-tags-check:
	$(call nvm, npm run ci:dev-tags-check)

.PHONY: dev
dev:
	docker compose build
	docker compose run --service-ports --rm $(APP_NAME) bash

.PHONY: env
env:
	docker compose up -d redis rabbitmq

.PHONY: up
up:
	docker compose up --build --remove-orphans --force-recreate

.PHONY: down
down:
	docker compose down --volumes

# Run tests locally without spawning a Docker (only spawn RabbitMQ)
.PHONY: local-test
local-test: up-local-test test down

.PHONY: up-local-test
up-local-test:
	docker compose up -d rabbitmq

.PHONY: test-unit-coverage
test-unit-coverage: $(eval extra_unit_test_options ?=) # extra unit test options to be injected by CI
	$(call nvm, npm run test:unit:coverage -- --ci $(extra_unit_test_options))

test-functional-coverage:
	$(call nvm, npm run test:functional:coverage)
