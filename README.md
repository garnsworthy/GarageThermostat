# GarageThermostat

Project to control the temperature in my garage.
Custom HW and a server that runs in a Docker container on my Synology NAS.

Variables:
 - temp, temp in deg C * 100
 - hum, humidity in % *100
 - heat, 0/1 if set to ON
 - heating, 0/1 if furnace is heating
 - setpt, temp in deg C * 100
 - id, the mac address of the device