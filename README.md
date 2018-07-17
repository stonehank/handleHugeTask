## web worker VS idleRequestCallback VS setTimeout

***测试平台：FireFox***

Chrome嵌套worker会有[BUG](https://bugs.chromium.org/p/chromium/issues/detail?id=31666)

|*方法*             |从0自加至100亿（相同环境）|  
|-------------------|:--------------:|
|web worker(10线程) |7s              |
|web worker(单线程) |29s             |
|idleRequestCallback|45s             |
|setTimeout         |61s             |

### [线上测试](https://stonehank.github.io/handleHugeTask/)

一些注意点：

1. web worker执行不受主线程执行影响。
2. idle执行收到主线程影响,主线程繁忙会暂停(因为没有空闲帧),setTimeout也会受影响。
3. worker可以嵌套，充分发挥多核cpu的性能（个人的电脑数据，worker能让浏览器进程迅速到90%，idle和setTimeout在35%徘徊，最多40%)。
4. worker任务结束必须手动关闭，否则线程会一直占用资源。
5. idle和setTimeout应该将任务分割成合适的小任务，否则单个任务过大会影响主线程流畅度。

-----
### web worker开启方式：
```js
// 开启
let worker=new Worker("workers-run.js")
// 传递数据，对象会序列化然后再传过去
worker.postMessage({target,threadNum:threadNum.value})
// 接受数据
worker.onmessage=function (e) {
    if(e.data==="done"){
        workerRunning=false
        // 结束线程
        worker.terminate()
    }
}
```
内部还可以嵌套：
```js
// workers-run.js

 for(let i=0;i<n;i++) {
    let subWorker
    // 线程下再分n个子线程
    subWorker = new Worker('sub-workers-run.js')
    subWorker.postMessage(target / n)
    subWorker.onmessage = function (e) {
        //...
    }
}
```
-----
### idleRequestCallback开启方式：

```js
let idleID = requestIdleCallback(function createIdle(deadline) {
    // 当有空闲帧 并且 未完成目标时
    while (deadline.timeRemaining() > 0 && taskSum < target) {
      // 调用执行函数
      smallTask(target/3000);
    }
    // 如果未能调用createIdle，didTimeout为true
    if (deadline.didTimeout) {
      // 未能调用createIdle
    }
    if (taskSum < target) {
      // 递归请求
      requestIdleCallback(createIdle)
    } else {
      // 完成！
    }
    // 未能调用createIdle的超时时间
}, {timeout: 1000})
```

-----
### setTimeout的运行方式：
```js
if (taskSum<target) {
  setTimeout( function(){
    run( tg-eachTask );
  }, 0 );
}
```
经常看到使用`Promise.resolve().then`代替`setTimeout(function(){},0)`的，那么这里能不能这么写呢：
```js
Promise.resolve().then(function(){
  run( tg-eachTask );
})
```

结果是不行的，使用Promise会造成主线程阻塞，原因是Promise会加入到`任务队列`，而setTimeout会加入到`事件循环队列`

一张图理解：

![](./eventloop%20and%20callbackqueue.png)

因此，使用Promise就不会去等下一次队列的渲染，结束后放到任务队列末尾继续调用