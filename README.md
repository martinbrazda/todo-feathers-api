# ToDo

ToDo REST API server using Feathers.js

## Project structure
- `config/` - Configuration files
  - `default.json` - port and MongoDB connection URI
  - `production.json` - production config
- `public/` - Static files
- `src/` - Source code
  - `hooks/` - Hooks for services
  - `middleware/` - Express middlewares
  - `services/` - Feather services
  - `app.hooks.ts` - global hooks for every request
  - `app.ts` - App initialization
  - `authentication.ts`
  - `channels.ts` - RTC channels and events
  - `index.ts` - Entry point and server initialization
  - `logger.ts` - Winston logger config
  - `mongodb.ts` - MongoDB connection
- `test` - Code tests


## Requirements
- Node.js >= 14
- MongoDB = 5

## Installing
- `npm i` for dependencies
- `npm install @feathersjs/cli -g` to install Feathers.js CLI for generating services and hooks
- `npm install apidoc -g` to install apidoc, a tool for generating the API documentation

## Running
- `npm start` for production
- `npm run dev` for development (with auto restart)
- Server will be running on the port `3030` (can be changed in config)
- `apidoc -i src -o public/docs` for generating API documentation (run after you change something in the apidocs comments)

## API documentation
- API docs can be found in `public/docs` and will be served on `http://localhost:3030/docs/`

## Testing
- Warning: Running tests will create a lot of entries in the database. Don't test on production databases :)
- `npm test`
