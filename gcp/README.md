# gcp

Code and configuration for a gcp cloud function that receives a url and returns a screenshot of the full page at that url.

## config

|                 key | value            |
| ------------------: | :--------------- |
|    Memory allocated | 1 GB             |
|             Trigger | HTTP             |
|             Runtime | Node.js 8 (Beta) |
| Function to execute | screenshot       |
|             Timeout | 120              |
