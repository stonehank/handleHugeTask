;(function(){
  function runIDLE(target,eachTask) {
    console.log("\nidle开始执行,准备开始首次调用执行函数")
    let t=performance.now()
    // console.time("idle耗时")

    let taskSum = 0

// 分割为小任务
    const smallTask = function (n) {
      for (let i = 0; i < n; i++) {
        taskSum++
      }
    }
    /*---主要执行函数----*/

    let idleID = requestIdleCallback(function createIdle(deadline) {
      while (deadline.timeRemaining() > 0 && taskSum < target) {
        smallTask(eachTask);
      }
      if (deadline.didTimeout) {
        console.log("刚才至少1秒内一直繁忙，idle无法首次调用createIdle，现在重新调用")
      }
      if (taskSum < target) {
        requestIdleCallback(createIdle)
      } else {
        console.log(target ,"idle完成目标!")
        idleRunning=false
        // console.timeEnd("idle耗时")
        alert("Idle耗时"+(performance.now()-t).toFixed(1)+"ms")
      }
    }, {timeout: 1000})

    /*---记录进度函数----*/

    function getProgress(time) {
      let timer
      if (taskSum < target) {
        timer = setInterval(function () {
          if (taskSum >= target) {
            clearInterval(timer);
            timer = null
          }
          console.log("idle当前完成百分比：" + (taskSum / target* 100).toFixed(2) + "%")
        }, time)
      }
    }
    getProgress(1000)
  }
  window.runIDLE=runIDLE
})()