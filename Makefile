docker:
		@docker buildx build --platform linux/amd64 -t giajiu/hrweb:dev -f ./Dockerfile .
		@docker push giajiu/hrweb:dev
