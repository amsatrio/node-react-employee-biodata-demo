build_frontend:
	cd frontend && yarn build
start: build_frontend
	node ./api/index.js
start_vercel:
	vercel dev -d