;(function(){
  let s = 0
  function extra(n) {
    console.time("extra耗时")
    console.log("正在执行extra，无空闲帧...")
    for (let i = 0; i < n; i++) {
      s += i
    }
    console.log('extra执行完毕...')
    console.timeEnd("extra耗时")
  }
  window.extra=extra
})()
