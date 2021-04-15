# 主要的作用 
实现一个可以异步消费的pubsub

- pubsub EventEmitter promise封装，以及订阅、取消订阅的封装

- PubSubEngine  抽象类
    - public abstract publish
    - public abstract subscribe
    - public abstract unsubscribe
    - public asyncIterator

- PubSubAsyncIterator PubSub异步迭代器
  - pullQueue 消费值队列
  - pushQueue 产生值队列 推入值
  - running 异步迭代器是否运行中
  - allSubscribed @type {Promise<number[]>} 操作需要等待订阅事件完成，number数据用于后面的订阅取消。
  - eventsArray 事件名称

- with-filter 提供过滤功能，更为主要的目的是适应graphql
