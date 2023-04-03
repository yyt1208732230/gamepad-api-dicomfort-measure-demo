//  Init record function states
var recordStates = {
  ctrl1: false,
  ctrl2: false,
  ctrl3: false,
  ctrl4: false,
};

var recordFolder1 = {
  id: '1',
  events: [],
  discomfortEvents_L: [],
  discomfortEvents_R: [],
};

var recordFolder2 = {
  id: '2',
  events: [],
  discomfortEvents_L: [],
  discomfortEvents_R: [],
};

var recordFolder3 = {
  id: '3',
  events: [],
  discomfortEvents_L: [],
  discomfortEvents_R: [],
};

var recordFolder4 = {
  id: '4',
  events: [],
  discomfortEvents_L: [],
  discomfortEvents_R: [],
};

// Map controller with gamepad id
// var ctrlMapping = {
//   'ctrl1': 'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
//   'ctrl2': null,
//   'ctrl3': null,
//   'ctrl4': null,
// }

// Target button events filter (format output)
var ctrl_last_RT_state = [
  {pressed: false, value: 0},
  {pressed: false, value: 0},
  {pressed: false, value: 0},
  {pressed: false, value: 0},
];

const getNowFormatDate = () => {
  let date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
  return currentdate;
}

const eventFilter = (id, gamepads, targetButton, targetId=null, props=null) => {
  let values = 0.00000;
  let _id = parseInt(id);
  if (targetButton === 'RT') {
    let btnState = gamepads[_id-1].buttons[7];
    let ctrlTimestamp = gamepads[_id-1].timestamp;
    let pValue = (btnState.value == 0 && btnState.pressed) ? ctrl_last_RT_state[_id-1].value : btnState.value;
    values = [ctrlTimestamp, btnState ? pValue : 0];
    ctrl_last_RT_state[_id-1].pressed = btnState.pressed;
    ctrl_last_RT_state[_id-1].value = btnState.value;
  }

  return [getNowFormatDate(), new Date(), Date.now(), ...values];
}

// Gamepad Basic APIs
document.addEventListener('DOMContentLoaded', () => {
  // logger
  const logsContainer = document.querySelector('#logs');
  const logger = (text, name=null) => {
    const li = document.createElement('li');
    const a = document.createElement("h4", { color: "#1A58AB" });
    if(name) {
      a.textContent = name;
    }
    li.textContent = `[${(new Date).toISOString()}] ${text}`;
    logsContainer.prepend(li);
    logsContainer.prepend(a);
  };

  // handle gamepad events
  const controller = [];

  const deepEqual = (before, after) => {
    if (!before) { return false; }

    if (before.buttons.length != after.buttons.length) { return false; }
    for (let i = 0; i < before.buttons.length; i++) {
      beforeButton = before.buttons[i];
      afterButton = after.buttons[i];
      if (beforeButton.pressed != afterButton.pressed || beforeButton.value != afterButton.value) {
        return false;
      }
    }

    if (before.axes.length != after.axes.length) { return false; }
    for (let i = 0; i < before.axes.length; i++) {
      beforeAxes = before.axes[i];
      afterAxes = after.axes[i];
      if (beforeAxes != afterAxes) {
        return false;
      }
    }

    return true;
  };

  // gamepad states checks
  const updateGamepadState = () => {
    const gamepads = navigator.getGamepads();
    for (i in gamepads) {
      const gamepad = gamepads[i];
      if (gamepad) {
        const nextState = {
          id: gamepad.id,
          timestamp: gamepad.timestamp,
          buttons: [],
          axes: [],
        };
        gamepad.buttons.forEach(e => nextState.buttons.push({ pressed: e.pressed, value: e.value }));
        gamepad.axes.forEach(e => nextState.axes.push(e));

        if (!deepEqual(controller[i], nextState)) {
          controller[i] = nextState;
          logger(JSON.stringify(nextState), `Controller ` + (parseInt(i)+1) + ` `);
        }
      }
    }
    if (gamepads) {
      const haveActivePads = gamepads.filter(g => g && g.connected).length > 0;
      if (haveActivePads) {
        // test
        if(recordStates.ctrl1) {
          let RTvalue = eventFilter('1', gamepads, 'RT')
          recordFolder1.events.push(RTvalue);
          // console.log(gamepads);
        }
        if(recordStates.ctrl2) {
          let RTvalue = eventFilter('2', gamepads, 'RT')
          recordFolder2.events.push(RTvalue);
          // console.log(gamepads);
        }
        if(recordStates.ctrl3) {
          let RTvalue = eventFilter('3', gamepads, 'RT')
          recordFolder3.events.push(RTvalue);
          // console.log(gamepads);
        }
        if(recordStates.ctrl4) {
          let RTvalue = eventFilter('4', gamepads, 'RT')
          recordFolder4.events.push(RTvalue);
          // console.log(gamepads);
        }
        window.requestAnimationFrame(updateGamepadState);
      }
    }
  };

  const connectHandler = (e) => {
    const gamepad = e.gamepad;
    console.log(gamepad);
    logger(`${gamepad.id} connected`);
    window.requestAnimationFrame(updateGamepadState);
  };

  const disconnectHandler = (e) => {
    const gamepad = e.gamepad;
    logger(`${gamepad.id} disconnected`);
  };

  window.addEventListener("gamepadconnected", connectHandler);
  window.addEventListener("gamepaddisconnected", disconnectHandler);
});

// Recording button toggles
const updateBtnText = (tagId, newText) => {
  $('#' + tagId).text(newText)
}

const updateControllerRecordState = (tagId, newText) => {
  $('#' + tagId).text(newText)
}

// Recording handlers
const startRecord = (id, state) => {
  if (!recordStates['ctrl' + id]) {
    recordStates['ctrl' + id] = true;
  }
  updateBtnText('btn_r' + id, 'End Record');
  console.log('Start Record Controller Id - ' + id);
}

const EndRecord = (id, state) => {
  if (recordStates['ctrl' + id]) {
    recordStates['ctrl' + id] = false;
  }
  // test
  if(id === '1') {
    console.log(recordFolder1.events);
    exportCSVbyId('1', recordFolder1.events);
  }
  if(id === '2') {
    console.log(recordFolder2.events);
    exportCSVbyId('2', recordFolder2.events);
  }
  if(id === '3') {
    console.log(recordFolder3.events);
    exportCSVbyId('3', recordFolder3.events);
  }
  if(id === '4') {
    console.log(recordFolder4.events);
    exportCSVbyId('4', recordFolder4.events);
  }
  updateBtnText('btn_r' + id, 'Start Record');
  console.log('End Record Controller Id - ' + id);
}

const controllerRecord = (id, props) => {
  if (!recordStates['ctrl' + id]) {
    startRecord(id, null);
  } else {
    EndRecord(id, null);
  }
}

// Controllers data files export
const exportCSVbyId = (id, data) => {
  let v = transferArray(data);
  let fileName = 'Controller ' + id + ' ' + new Date();
  downloadRecordFile(v, fileName, 'txt');
}