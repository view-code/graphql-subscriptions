const { PubSub, withFilter } = require('../dist');

const pubsub = new PubSub();

const asyncIterator = pubsub.asyncIterator('messageAdded')

function consumLog(id) {
  return (result) => {
    console.log(`消费 ${id}`, result)
  }
}

asyncIterator.next().then(consumLog(1))

setTimeout(() => asyncIterator.next().then(consumLog(2)), 100)
setTimeout(() => asyncIterator.next().then(consumLog(3)), 200)
setTimeout(() => asyncIterator.next().then(consumLog(4)), 300)
// 在return 1之前订阅
setTimeout(() => asyncIterator.next().then(consumLog(5)), 400)
// 在return 1之后订阅,示验return后不可再被订阅
setTimeout(() => asyncIterator.next().then(consumLog(6)), 600)

setTimeout(() => pubsub.publish('messageAdded', {someData: '1'}), 0)
setTimeout(() => pubsub.publish('messageAdded', {someData: '2'}), 100)
setTimeout(() => pubsub.publish('messageAdded', {someData: '3'}), 200)
setTimeout(() => pubsub.publish('messageAdded', {someData: '4'}), 400)
setTimeout(() => asyncIterator.return().then(() => console.log('return 1')), 500)
setTimeout(() => asyncIterator.return().then(() => console.log('return 2')), 700)
/*
output:
消费 1 { value: { someData: '1' }, done: false }
消费 2 { value: { someData: '2' }, done: false }
消费 3 { value: { someData: '3' }, done: false }
消费 4 { value: { someData: '4' }, done: false }
消费 5 { value: undefined, done: true }
return 1
return 2
*/
