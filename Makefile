docker:
		@docker buildx build --platform linux/amd64 -t giajiu/hrweb:dev -f ./Dockerfile .
		@docker push giajiu/hrweb:dev
docker-it_dev:
		@docker buildx build --platform linux/amd64 -t giajiu/hrweb:dev -f ./docker/it_dev.dockerfile .
		@docker push giajiu/hrweb:dev
