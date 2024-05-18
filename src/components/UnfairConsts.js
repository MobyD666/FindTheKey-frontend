export const settingsDefs = 
{
  unabletoguess: {min:0,max:100,type:'slider',description:'Unable to guess %'},
  delayactions: {min:0,max:100,type:'slider',description:'Delay actions %'},
  hidekeys: {min:0,max:100,type:'slider',description:'Hide keys %'},
  doubleactions: {min:0,max:100,type:'slider',description:'Double actions %'},
  twins: {min:0,max:100,type:'slider',description:'Twins %'},
  nocorrectkey: {min:0,max:100,type:'slider',description:'No correct key %'},
  liecorrect: {min:0,max:100,type:'slider',description:'Lie correct %'},
  blocktime: {min:0,max:100,type:'slider',description:'Add time blocker %'},
  blocktime_time: {min:0,max:8640000,type:'time',description:'Add time blocker mean time'},
  delayactions_time: {min:0,max:8640000,type:'time',description:'Delay actions mean time'},
  blockverification: {min:0,max:100,type:'slider',description:'Verification blocker %'},
  blockshared_link: {min:0,max:100,type:'slider',description:'Shared link blocker %'},
  blockturn_wheel_of_fortune: {min:0,max:100,type:'slider',description:'WoF blocker %'},
  blocktask_completed: {min:0,max:100,type:'slider',description:'Task completed blocker %'},
  blocktask_failed: {min:0,max:100,type:'slider',description:'Task failed blocker %'},
  blockjigsaw_complete: {min:0,max:100,type:'slider',description:'Jigsaw complete blocker %'},

};


export const addBlockerOptions=
[
  { value: 'add_time', text: 'Add Time' },
  { value: 'freeze', text: 'Freeze' },
  { value: 'verification', text: 'Verify lock' },
  { value: 'shared_link', text: 'Get shared link vote' },
  { value: 'turn_wheel_of_fortune', text: 'Turn WoF' },
  { value: 'task_completed', text: 'Complete task' },
  { value: 'task_failed', text: 'Fail task' },
  { value: 'jigsaw_complete', text: 'Complete jigsaw' },

];

export const addUnfairOptions=
[
  { value: 'unabletoguess', text: 'Unable to guess' },
  { value: 'liecorrect', text: 'Lie if correct' },
  { value: 'hidekeys', text: 'Hide keys' },
  { value: 'doubleactions', text: 'Double actions' },
  { value: 'twins', text: 'Twins' },
  { value: 'nocorrectkey', text: 'No correct key' },
  { value: 'delayactions', text: 'Delay on correct actions' },
  { value: 'blocker_addtime', text: 'Blocker add time' },
  { value: 'blocker_freeze', text: 'Blocker freeze' },
  { value: 'blocker_verification', text: 'Blocker verification' },
  { value: 'blocker_shared_link', text: 'Blocker shared link' },  
  { value: 'blocker_turn_wheel_of_fortune', text: 'Blocker turn WoF' },  
  { value: 'blocker_task_completed', text: 'Blocker task completed' },  
  { value: 'blocker_task_failed', text: 'Blocker task failed' },    
  { value: 'blocker_jigsaw_complete', text: 'Blocker jigsaw complete' },      
];


export const defaultStartupUnfairSettings=

{
    "default": {
        "unabletoguess": 0,
        "delayactions": 0,
        "hidekeys": 0,
        "doubleactions": 0,
        "twins": 0,
        "nocorrectkey": 0,
        "liecorrect": 0,
        "blocktime": 0,
        "blocktime_time": 60,
        "delayactions_time": 60,
        "blockverification": 0,
        "blockjigsaw_complete": 0,
        "blockshared_link": 0,
        "blockturn_wheel_of_fortune": 0,
        "blocktask_completed": 0,
        "blocktask_failed": 0
    },
    "user": {
        "unabletoguess": null,
        "delayactions": null,
        "hidekeys": null,
        "doubleactions": null,
        "twins": null,
        "nocorrectkey": null,
        "liecorrect": null,
        "blocktime": null,
        "blocktime_time": null,
        "delayactions_time": null,
        "blockverification": null,
        "blockjigsaw_complete": null,
        "blockshared_link": null,
        "blockturn_wheel_of_fortune": null,
        "blocktask_completed": null,
        "blocktask_failed": null
    }
}


{

};

