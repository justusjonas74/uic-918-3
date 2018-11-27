import {Organisation} from './lib/vdvKaTypes'

const org3 = new Organisation(21, 'hallo')
console.log(Organisation.allInstances.length)
const newScope = ()=>{
  const org = new Organisation(11, 'hallo')
  console.log(Organisation.allInstances.length)      
}
newScope()
const or = Organisation.getByID(11)
console.log(Organisation.allInstances.length)
