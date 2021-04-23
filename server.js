// import { ApolloServer } from 'apollo-server-express';
// import schemas from './schemas/index.js';
// import resolvers from './resolvers/index.js';
import express from 'express';
import dotenv from 'dotenv';
// import connectMongo from './db/db.js';
// import { checkAuth } from './passport/authenticate.js';
// import helmet from 'helmet';
// import cors from 'cors';

dotenv.config();

(async () => {
  try {
    // const conn = await connectMongo();
    // if (conn) {
    //   console.log('Connected successfully.');
    // }

    // const server = new ApolloServer({
    //   typeDefs: schemas,
    //   resolvers,
    //   context: async ({ req, res }) => {
    //     if (req) {
    //       const user = await checkAuth(req, res);
    //       console.log('server start', user);
    //       return {
    //         req,
    //         res,
    //         user,
    //       };
    //     }
    //   },
    // });

    const app = express();
    // app.use(
    //   helmet({
    //     contentSecurityPolicy: false,
    //     //ieNoOpen: false,
    //   })
    // );

    app.use(express.static('public'));
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // Enable cors for all requests
    //app.use(cors());

    // server.applyMiddleware({ app, path: '/graphql' });

    // process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    // if (process.env.NODE_ENV === 'production') {
    //   console.log('prduction');
    //   const { default: production } = await import('./sec/production.js');
    //   production(app, 3000);
    // } else {
    //   console.log('localhost');
    //   const { default: localhost } = await import('./sec/localhost.js');
    //   localhost(app, 8000, 3000);
    // }

    // app.get('/', (req, res) => {
    //   res.send('Hello Secure World!');
    // });

    app.listen({ port: 3000 }, () =>
      console.log(
        //`🚀 Server ready at http://localhost:3000${server.graphqlPath}`
        'server ready'
      )
    );
  } catch (e) {
    console.log('server error: ' + e.message);
  }
})();
