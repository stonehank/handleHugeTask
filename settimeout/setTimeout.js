;(function(){
  function STORun(target,eachTask){
    console.log("\nSTO开始执行")
    console.time("STO耗时")
    let taskSum=0

    // 分割为小任务
    const smallTask = function (n ) {
      for (let i = 0; i < n; i++) {
        taskSum++
      }
    }

    /*---主要执行函数----*/

    function run(tg){
      smallTask(eachTask)
      if (taskSum<target) {
        setTimeout( function(){
          run( tg-eachTask );
        }, 0 );
      }else{
        console.log(target,"STO目标完成！")
        STOrunning=false
        console.timeEnd("STO耗时")
      }
    }
    run(target)
    /*---记录进度函数----*/

    function getProgress(time) {
      let timer
      if (taskSum < target) {
        timer = setInterval(function () {
          if (taskSum >= target) {
            clearInterval(timer);
            timer = null
          }
          console.log("setTimeout当前完成百分比：" + (taskSum / target* 100).toFixed(2) + "%")
        }, time)
      }
    }
    getProgress(1000)
  }
  window.STORun=STORun
})()

