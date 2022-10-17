
# ISRO MISSION CONTROL



## Quick Start

To run this app, clone the repository and install dependencies:

```bash
  $ git clone https://github.com/shahab99110/ISRO-Mission-Launch-Dashboard.git
  $ npm run install-server
  $ npm run install-client
```

This app require MondoDb cluster link, after getting one
 add the following environment variables to your .env file which will be on server dir

`MONGO_URL`

## Run Locally

### 1. Start server

```bash
  $ npm run server
```

### 2. Start client

```bash
  $ npm run client
```

navigate to http://localhost:3000



## For Deployment

```bash
  $ npm run deploy
```
naviagate to http://localhost:8000

    
## Tech Stack

**Client:** React, Redux

**Server:** Node, Express

**Database:** MongoDB

**Deployment:** Docker, AWS EC2


## Features

- Schedule Upcoming Launches to one the habitable planets Found by kepler
- View Isro previous missions

## Screenshot
![Launch mission](https://github.com/shahab99110/ISRO-Mission-Launch-Dashboard/blob/master/screenshot/Launch%20mission.png)
![View upcoming mission](https://github.com/shahab99110/ISRO-Mission-Launch-Dashboard/blob/master/screenshot/View%20upcoming%20mission.png)
![Isro Mission History](https://github.com/shahab99110/ISRO-Mission-Launch-Dashboard/blob/master/screenshot/Isro%20Mission%20History.png)



## License

[The Unlicense](https://opensource.org/licenses/unlicense)

