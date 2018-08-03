
  let target;
  let taskSum=0
  let threadNum=0
  let t
  self.onmessage=function(e){
    target=e.data.target;
    threadNum=e.data.threadNum;
    console.log("\n开始执行worker")
    t=performance.now()
    // console.time("worker耗时")
    runTask(threadNum)
  }

  function runTask(n){
    console.log("分配"+n+"个子线程计算")
    for(let i=0;i<n;i++) {
      let subWorker
      subWorker = new Worker('sub-workers-run.js')
      subWorker.postMessage(target / n)
      subWorker.onmessage = function (e) {
        taskSum += e.data
        console.log("子线程完成，当前完成百分比：" + (taskSum / target).toFixed(4) * 100 + "%")
        if (taskSum >= target) {
          console.log(target,"worker目标完成！")
          // console.timeEnd("worker耗时")
          postMessage({msg:"done",time:(performance.now()-t).toFixed(1)})
          // postMessage("done")
          self.close()
        }

      }
    }
  }

