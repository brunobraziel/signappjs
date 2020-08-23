# SignApp JS
I developed this app in order to fulfill my Bachelor graduation over my final project TCC (Trabalho de Conclusão de Curso - 2020). 
Its main concern is to graphically represent any sort of signals coming from a Bluetooth connection. 

## Arduino implementation
My project was intended to build an Arduino system able to read signals using muscle sensors and send it to an Android application via Bluetooth.
I will also provide my .ino file into this project, so that you can try it out by yourself. 
**Be aware of which pins you are connecting your modules and make sure they're the same**.

## Android development 
As you can see, I worked React Native, specifically version 0.62.2. Plus, this project was developed using functional and OO programming
I created 5 components and below, you can see its main role and which programming principle I implemented on. 

|Component|Role|Programming Principle|
|----------------|-------------------------------|-----------------------------|
|Home.js|The main screeen|Functional|
|PlotExistingChart.js|Plots readings from both Database and .csv format locations|Functional|
|PlotRealTime.js|Plots readings from the muscle sensor via Bluetooth connection|Functional|
|ReadingsList|Shows all the readings from the app|Functional|
|Settings.js|Handles the Bluetooth connection as well as shows some info about the project|Object Oriented|

### Bluetooth Connection
For starters, I implemented a script able to read the information captured from the sensor and deliver it through Bluetooth.
In the react native project, I used the `react-native-bluetooth-serial-next` library,
which allows us to handle the main iterations between two devices via Bluetooth. 
You can open it using [this link](https://github.com/nuttawutmalee/react-native-bluetooth-serial-next).
This package is **deprecated**, it means that the publisher to longer offers maintenance nor updates.
Therefore, be aware of what you are planning to do before using it. In my case, this package did not present any errors.

### Database
I worked with `realm` as my database package. 
It is quite easy to develop, allowing us to work with querying and offline storage. 
You can [click here](https://realm.io/products/realm-database) to understand how this is implemented.

**OBS:** This whole project has comments in Portuguese in order to document for later studies.
In case of any doubt or suggestions, please contact-me. 
