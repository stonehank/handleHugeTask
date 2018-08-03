let target
let taskSum=0
let t
onmessage=function(e){
  target=e.data
   t=performance.now()
  // console.time("workerSOLO耗时")
  console.log("\nworkerSOLO开始计算")
  task()
}

function task() {

  for(let i=0;i<target;i++){
    taskSum++
  }

  console.log(target,"workerSOLO完成目标！")
  // console.timeEnd("workerSOLO耗时")
  // console.log("耗时"+(performance.now()-t).toFixed(1)+"ms")
  postMessage({msg:"done",time:(performance.now()-t).toFixed(1)})
  self.close()
}
