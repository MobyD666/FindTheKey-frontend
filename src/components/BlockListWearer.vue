<template>
    <div>
        There is something preventing you from guessing...
        <div v-for="(item,index) in blocks" :key="index" class="key-grid-cell" >
                <p v-if="(item.type=='add_time')"><FontAwesomeIcon :icon="icon_addtime"  />&nbsp;&nbsp;{{ message_addtime }}</p>
                <p v-if="(item.type=='freeze')"><FontAwesomeIcon :icon="icon_frozen"  />&nbsp;&nbsp;{{ message_frozen }}</p>
                <p v-if="(item.type=='verification')"><FontAwesomeIcon :icon="icon_verification"  />&nbsp;&nbsp;{{ message_verification}}</p>
                
                <p v-if="(item.type=='shared_link')"><FontAwesomeIcon :icon="icon_shared_link"  />&nbsp;&nbsp;{{ message_shared_link}}</p>
                <p v-if="(item.type=='turn_wheel_of_fortune')"><FontAwesomeIcon :icon="icon_turn_wof"  />&nbsp;&nbsp;{{ message_turn_wof}}</p>
                <p v-if="(item.type=='task_completed')"><FontAwesomeIcon :icon="icon_task_completed"  />&nbsp;&nbsp;{{ message_task_completed}}</p>
                <p v-if="(item.type=='task_failed')"><FontAwesomeIcon :icon="icon_task_failed"  />&nbsp;&nbsp;{{ message_task_failed}}</p>                                                
                <p v-if="(item.type=='jigsaw_complete')"><FontAwesomeIcon :icon="icon_jigsaw_complete"  />&nbsp;&nbsp;{{ message_jigsaw_complete}}</p>                                                
            </div>
    </div>
  </template>
  
  <script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps(
    {
        blocks: Array,
        seed: Number
    });


    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faHourglassHalf, faSnowflake, faCamera,faLink,faClover,faList, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faHourglassHalf);
library.add(faSnowflake);
library.add(faCamera);
library.add(faLink);
library.add(faClover);
library.add(faList);
library.add(faPuzzlePiece);


function seededRandom(min, max) 
{
  const seedValue = props.seed;
  let t = (seedValue + 0x6D2B79F5) | 0;
  t = Math.imul(t ^ t >>> 15, 1 | t);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  t = (t ^ t >>> 14) >>> 0;
  return min + (t % ((max - min + 1) + min));
}

const messages_addtime = [
  {message:"Feeling light? Let's add just a little bit more...",icon:faHourglassHalf},
  {message:"A moment more won't hurt, will it?",icon:faHourglassHalf},
  {message:"Patience is a virtue... care to practice?",icon:faHourglassHalf},
  {message:"Stretch your limits, just a tad more time...",icon:faHourglassHalf},
  {message:"Who says more isn't merrier? Prove them wrong!",icon:faHourglassHalf},
  {message:"Just a little longer... It's for the best!",icon:faHourglassHalf},
  {message:"More time? Think of it as a bonus round!",icon:faHourglassHalf},
  {message:"Dare to add a sprinkle more of time?",icon:faHourglassHalf},
  {message:"Every minute counts, why not a few more?",icon:faHourglassHalf},
  {message:"Give yourself the gift of time, you deserve it!",icon:faHourglassHalf},
  {message:"treat yourself a little...",icon:faHourglassHalf},
];

const messages_verification = [
  {message:"Seeing is believing... Show it's locked!",icon:faCamera},
  {message:"Are you really locked?",icon:faCamera},
  {message:"Pics or it didn't happen!",icon:faCamera},
  {message:"Trust, but verify. Time for a lock check!",icon:faCamera},
  {message:"Locked up tight? Prove it with a snapshot!",icon:faCamera},
  {message:"A quick pic to keep things click!",icon:faCamera},
  {message:"Are you really secured? Let's see it!",icon:faCamera},
  {message:"Verify your virtue, a picture's worth a thousand locks.",icon:faCamera},
  {message:"Flash a photo, just to be sure!",icon:faCamera},
  {message:"Just double-checking... Snap a lock shot!",icon:faCamera},
  {message:"A peek for proof, please!",icon:faCamera},

];

const messages_frozen = [
  {message:"Frozen keys...",icon:faSnowflake},
  {message:"Frozen in the moment? Seek out the thaw.",icon:faSnowflake},
  {message:"Who can break the ice?",icon:faSnowflake},
  {message:"Time's on a break. ",icon:faSnowflake},
  {message:"Frozen clock, hidden keys.",icon:faSnowflake},
  {message:"Chronos halted. ",icon:faSnowflake},

];

const messages_shared_link = [
  {message:"Curious what others think? Give them a say ...",icon:faLink},
  {message:"It’s a game of numbers. Have others weigh in!",icon:faLink},
  {message:"Destiny by democracy?",icon:faLink},
  {message:"Link your luck. Let the votes fall where they may!",icon:faLink},
  {message:"Invite opinions, cast your net wider. What will they say?",icon:faLink},
  {message:"Your next guess is just a share away.",icon:faLink},
  {message:"Your story awaits its audience.",icon:faLink},
  {message:"Seek the wisdom of the crowd.",icon:faLink},
];

const messages_turn_wof = [
{message:"Fate's wheel awaits — give it a spin?",icon:faClover},
{message:"Give the wheel a whirl. What’s your fortune today?",icon:faClover},
{message:"Let the wheel weave your next woe or win.",icon:faClover},
{message:"Turn your luck around! What will the fates decide?",icon:faClover},
{message:"Rotate the circle of chance.",icon:faClover},
{message:"Twirl the oracle’s orb. What secrets will it unveil?",icon:faClover},
{message:"Ready for a round of chance? Set it in motion!",icon:faClover},
{message:"Your destiny is just a turn away. Ready to discover",icon:faClover},
{message:"Circulate the circle of serendipity. What surprise awaits?",icon:faClover},
];

const messages_task_completed = [
{message:"Complete the quest, claim your honor.",icon:faList},
{message:"The task at hand demands your best.",icon:faList},
{message:"Face the task with courage. Success is your only option.",icon:faList},
{message:"Master your task, master yourself. Are you prepared?",icon:faList},
{message:"The task ahead is tough, but so are you. Prove it!",icon:faList},
{message:"Take on the task, take pride in your success.",icon:faList},
{message:"Initiate the task, seal it with success.",icon:faList},
{message:"The task beckons. Start strong, finish stronger.",icon:faList},
{message:"Launch into your task, land with accomplishment. Ready for liftoff?",icon:faList},
];

const messages_task_failed = [
{message:"Task requires a sacrifice. Will you pay the price?",icon:faList},
{message:"Embrace the twist—fail to succeed. Are you in for the challenge?",icon:faList},
{message:"Sometimes the hero must fail to rise. Will you take that fall?",icon:faList},
{message:"Dare to fail the task?",icon:faList},
{message:"Embrace the art of failing tasks",icon:faList},
{message:"Fail this task, and see what doors it opens.",icon:faList},
{message:"A calculated fail of a task might just be your winning strategy.",icon:faList},
];

const messages_jigsaw_complete = [
{message:"Piece together the path to your freedom. Ready to fit in?",ivon:faPuzzlePiece},
{message:"Missing a piece of the puzzle? Better start looking!",ivon:faPuzzlePiece},
{message:"Your solution lies in the pieces. Can you assemble the answer?",ivon:faPuzzlePiece},
{message:"Every piece counts. Have you placed them all correctly?",ivon:faPuzzlePiece},
{message:"The big picture is in the small details. Can you see it yet?",ivon:faPuzzlePiece},
{message:"Arrange the chaos into order. Is your mind ready for the challenge?",ivon:faPuzzlePiece},
{message:"Your next step is hidden in the fragments. Piece it out!",ivon:faPuzzlePiece},
{message:"Complete the picture, complete the task. Are you up to it?",ivon:faPuzzlePiece},
{message:"Solve the riddle of the scattered pieces. Ready for a brain workout?",ivon:faPuzzlePiece},
{message:"Your future depends on how the parts align. Ready to rearrange?",ivon:faPuzzlePiece},
{message:"There’s a pattern to be found here. Can you sort it out?",ivon:faPuzzlePiece},
{message:"Align the fragments to find your way. Are you the missing piece?",ivon:faPuzzlePiece},
{message:"Your next clue is a scattered puzzle. Piece together your victory!",ivon:faPuzzlePiece},
{message:"Assembly required to advance. Do you have the right strategy?",ivon:faPuzzlePiece},
];


const message_addtime = computed(() => messages_addtime[seededRandom(0, messages_addtime.length - 1)].message);
const icon_addtime = computed(() => messages_addtime[seededRandom(0, messages_addtime.length - 1)].icon);

const message_verification = computed(() => messages_verification[seededRandom(0, messages_verification.length - 1)].message);
const icon_verification = computed(() => messages_verification[seededRandom(0, messages_verification.length - 1)].icon);

const message_frozen = computed(() => messages_frozen[seededRandom(0, messages_frozen.length - 1)].message);
const icon_frozen = computed(() => messages_frozen[seededRandom(0, messages_frozen.length - 1)].icon);

const message_shared_link = computed(() => messages_shared_link[seededRandom(0, messages_shared_link.length - 1)].message);
const icon_shared_link = computed(() => messages_shared_link[seededRandom(0, messages_shared_link.length - 1)].icon);

const message_turn_wof = computed(() => messages_turn_wof[seededRandom(0, messages_turn_wof.length - 1)].message);
const icon_turn_wof = computed(() => messages_turn_wof[seededRandom(0, messages_turn_wof.length - 1)].icon);

const message_task_completed = computed(() => messages_task_completed[seededRandom(0, messages_task_completed.length - 1)].message);
const icon_task_completed = computed(() => messages_task_completed[seededRandom(0, messages_task_completed.length - 1)].icon);

const message_task_failed = computed(() => messages_task_failed[seededRandom(0, messages_task_failed.length - 1)].message);
const icon_task_failed = computed(() => messages_task_failed[seededRandom(0, messages_task_failed.length - 1)].icon);


const message_jigsaw_complete = computed(() => messages_jigsaw_complete[seededRandom(0, messages_jigsaw_complete.length - 1)].message);
const icon_jigsaw_complete = computed(() => messages_jigsaw_complete[seededRandom(0, messages_jigsaw_complete.length - 1)].icon);

</script>
  
  <style scoped>
  
  
  

  </style>
  