install: #установка
		npm install

brain-games: #запуск
		node bin/brain-games.js

publish: 
		npm publish --dry-run

lint:
		npx eslint .

test:
		node --experimental-vm-modules node_modules/.bin/jest