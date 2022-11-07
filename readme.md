# A quick tool for measuring the cognitive discomfort with controllers using Gamepad APIs.

------

## How to get start

- Execute your python:`python -m http.server 8000`
- Open your browser:`localhost:8000`
- Connect your controller(s) - Only Xbox ctrl for now
- Click start/end record for specific controller
- That's it :)



# The R script for visualization

R script: `controller_discomfort_visualization.r`

'RT button' of your controller: `"2022-11-07T09:45:05.094Z",1667814305094,5380.0999999940395,0.29411765933036804`

- standard_time: the timestamp without the time zone of your system
- timestamp: the timestamp in milliseconds
- ctrl_timestamp: the timestamp returned from the controller
- discomfort: the press value returned from the controller

![](https://github.com/yyt1208732230/gamepad-api-dicomfort-measure-demo/blob/discomfort_demo_v1/btn_logs.png)

![](https://github.com/yyt1208732230/gamepad-api-dicomfort-measure-demo/blob/discomfort_demo_v1/fingerPress.png)

![](https://github.com/yyt1208732230/gamepad-api-dicomfort-measure-demo/blob/discomfort_demo_v1/discomfort_visualization_demo_1.png)

#### Keep updating...