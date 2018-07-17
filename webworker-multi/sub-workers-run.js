let target
let taskSum=0
onmessage=function(e){
  target=e.data
  smallTask()
}

function smallTask() {
 for(let i=0;i<target;i++){
   taskSum++
 }
 postMessage(taskSum)
 self.close()
}
