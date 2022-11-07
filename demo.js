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
var ctrlMapping = {
  'ctrl1': 'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
  'ctrl2': null,
  'ctrl3': null,
  'ctrl4': null,
}

// Target button events filter
const eventFilter = (id, gamepads, targetButton, targetId=null, props=null) => {
  let values = 0.00000;
  let _id = parseInt(id);
  if (targetButton === 'RT') {
    let btnState = gamepads[_id-1].buttons[7]
    values = [btnState ? btnState.value : 0];
  }

  return [new Date(), Date.now(), ...values];
}

// Gamepad Basic APIs
document.addEventListener('DOMContentLoaded', () => {
  // logger
  const logsContainer = document.querySelector('#logs');
  const logger = (text) => {
    const li = document.createElement('li');
    li.textContent = `[${(new Date).toISOString()}] ${text}`;
    logsContainer.prepend(li);
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
          logger(JSON.stringify(nextState));
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
          console.log(gamepads);
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