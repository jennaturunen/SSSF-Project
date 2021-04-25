import { ApolloServer } from 'apollo-server-express';
import schemas from './schemas/index.js';
import resolvers from './resolvers/index.js';
import express from 'express';
import dotenv from 'dotenv';
import connectMongo from './db/db.js';
import { checkAuth } from './passport/authenticate.js';
// import helmet from 'helmet';
// import cors from 'cors';

dotenv.config();

(async () => {
  try {
    const conn = await connectMongo();
    if (conn) {
      console.log('Connected successfully.');
    }

    const server = new ApolloServer({
      typeDefs: schemas,
      resolvers,
      context: async ({ req, res }) => {
        if (req) {
          const user = await checkAuth(req, res);
          console.log('server start', user);
          return {
            req,
            res,
            user,
          };
        }
      },
    });

    const app = express();
    // app.use(
    //   helmet({
    //     contentSecurityPolicy: false,
    //     //ieNoOpen: false,
    //   })
    // );

    app.use(express.static('public'));
    app.use(express.json({ limit: '50mb' })); // for parsing application/json
    app.use(
      express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      })
    ); // for parsing application/x-www-form-urlencoded

    // Enable cors for all requests
    //app.use(cors());

    server.applyMiddleware({ app, path: '/graphql' });

    // app.get('/', (req, res) => {
    //   res.send('Hello Secure World!');
    // });

    app.listen({ port: 3000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:3000${server.graphqlPath}`
      )
    );
  } catch (e) {
    console.log('server error: ' + e.message);
  }
})();
