const {isAsyncIterable} = require('iterall');

const { PubSub, withFilter } = require('../dist');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, graphql, parse } = require('graphql')
const { subscribe } = require('graphql/subscription')

const FIRST_EVENT = 'FIRST_EVENT';

const defaultFilter = (payload) => true;

/*
type Query {
  testString: String
}

type Subscription {
  testSubscription: string
}

testSubscription

testString: () => 'works'
testSubscription: () => 'FIRST_EVENT'
*/
function buildSchema(iterator, filterFn = defaultFilter) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        testString: {
          type: GraphQLString,
          // resolve: function (_, args) {
          //   return 'works';
          // },
        },
      },
    }),
    subscription: new GraphQLObjectType({
      name: 'Subscription',
      fields: {
        testSubscription: {
          type: GraphQLString,
          subscribe: withFilter((rootValue, args, context, info) => {
            console.log('withFilter iterator')
            return iterator
          }, (payload, args, context, info) => {
            console.log('withFilter filterFn', payload)
            return true
          }),
          resolve: (...allArgs) => {
            // console.log('allArgs', allArgs)
            return 'FIRST_EVENT';
          },
        },
      },
    }),
  });
}

const query = parse(`
  subscription S1 {
  
    testSubscription
  }
`);

async function test() {
  const pubsub = new PubSub();
  const origIterator = pubsub.asyncIterator(FIRST_EVENT);
  const schema = buildSchema(origIterator);

  // graphql({
  //   schema: schema,
  //   source: `
  //       { testString }
  //   `,
  //   rootValue: {
  //     testString: 'goods'
  //   },
  // })
  //   .then(console.log)
  //
  // return

  const subScribeArgs = {
    schema: schema,
    document: query,
    rootValue: undefined,
    contextValue: undefined,
    variableValues: undefined,
    operationName: undefined,
    fieldResolver: undefined,
    subscribeFieldResolver: undefined
  }
  const results = await subscribe(subScribeArgs)
  console.log(isAsyncIterable(results))

  const payload1 = results.next();
  const r = payload1.then(res => {
    console.log(res.value.data.testSubscription)
  });
  pubsub.publish(FIRST_EVENT, {a: 1});
  return r;
}

test()
