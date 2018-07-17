let target
let taskSum=0
onmessage=function(e){
  target=e.data
  console.time("workerSOLO耗时")
  console.log("\nworkerSOLO开始计算")
  task()
}

function task() {

  for(let i=0;i<target;i++){
    taskSum++
  }

  console.log(target,"workerSOLO完成目标！")
  console.timeEnd("workerSOLO耗时")
  postMessage("done")
  self.close()
}
