# Bussorakel - React.js demo app

This is a sample web application using React.js on the client side and Express.js on the server side. It provides a lookup service for public transport in Trondheim by wrapping the existing service provided by [atb.no](https://www.atb.no/).

You can see the application here: https://bussorakel.herokuapp.com/

## How does it work?

We serve a React.js app that consumes a REST endpoint from the Express.js server. The server side will then query AtB for upcoming departures matching the users request and serve them to the client. Data is managed using Redux and the client application will re-render when a response is received and the state is updated.

The reason we're querying the server for this data instead of accessing the AtB service directy is to avoid CORS issues as well as it serves as a nice demo of a server side service providing data without the need for a database or sources. We're also parsing the response from AtB using regex to separate the travel proposals and returning them as an array instead of one large text block.

## Run it

To run the application on your machine you need node and npm installed. Then clone this repo and run:

```
npm install
npm start
```

The application should now be available on [localhost:3000](http://localhost:3000)

### Development

For development you want a server that dynamically reloads your application as you save your changes. For now you need to run two shells to obtain this, one for the server side and one that dynamically serves up the client.

The client will be hosted on a separate server, and proxy all traffic to the REST endpoint on the server. It's not optimal, but it works for now. A future improvement would be to add webpack middleware to the express server. Then everything could be reloaded using one server. But for now...

Start your development environment by running these commands in different shells:
```
npm run server-dev
npm run dev
```

Your application is now available with code reloading on [localhost:8080](http://localhost:8080). The server side is running on port 3000 and REST requests are forwarded there. You'll still see the UI if you access port 3000, but it will be a static one from your last build.

NB: Because we're hosting two servers in dev mode, the index.html file is duplicated. One of them clearly states it's a duplicate and it should be kept up to date with changes done in the main one. Until we fix the whole two servers thing.

## Deploying to Heroku

[Heroku](https://www.heroku.com/) is a popular PaaS provider that makes it super easy to get you application up and running in the cloud in no time. To deploy this application there simply install the Heroku toolbelt, do `heroku login` and run these commands:

```
heroku apps:create
git push heroku master
```

You app is now deployed and you can open it using `heroku open`. It will have a randomly generated name, but you can also supply your own name using `heroku apps:create <your-wanted-name>`.

## Running in a Docker container

Assuming you've installed [Docker](https://www.docker.com/) the included Dockerfile will let you build and run the application in a container with using these commands:

```
docker build -t bussorakel .
docker run -d -p 3000:3000 bussorakel
```

Once again the application should be available on [localhost:3000](http://localhost:3000)

## Running on Docker Swarm

So you want to take the next step and run this on a multi-host cluster of nodes using Docker Swarm.

There is an excellent tutorial on [Docker Swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/), but here's a short explanation on how to set up 3 hosts (1 manager, 2 slaves) on [DigitalOcean](https://www.digitalocean.com/), initialize a swarm and run the Bussorakel service on it.

#### Create our servers

First we want to create our servers, this requires that you've installed docker-machine. DigitalOcean also requires an API key for the requests. Set it to your shell environment by running `export DIGITALOCEAN_ACCESS_TOKEN="your-token-here"`. Then create the servers like this:

```
docker-machine create --driver digitalocean --digitalocean-size 2gb swarm-manager1
docker-machine create --driver digitalocean --digitalocean-size 2gb swarm-slave1
docker-machine create --driver digitalocean --digitalocean-size 2gb swarm-slave2
```

We're specifying the server type with 2GB of RAM, default is 512MB. Not really necessary for this application, but for demonstration purposes I like to have a little extra computing power.

#### Set up the Swarm

Check which IP your manager has been assigned by executing `docker-machine ip swarm-manager1`. Then connect to the manager using `docker-machine ssh swarm-manager1`. Once connected, run `docker swarm init --advertise-addr <MANAGER_IP>`. This should initialize the swarm and print a command for you to use to attach worker nodes to it. It looks something like this:

```
docker swarm join \
--token SWMTKN-1-067yvvsgmoq1k9s25bw1d8t67wasd8768s7dg67s8d7c7n-9kn5t2akyzldtauywdyey0o6i \
<MANAGER_IP>:2377
```
Connect to both the slave nodes using `docker-machine ssh ...` and run this command on them. They should print `This node joined a swarm as a worker.` and your swarm is ready! Runing `docker node ls` on the manager should list all members of the swarm.

#### Tag and push your image to the Docker Hub

After building the Docker image, we tag it and push it:

```
docker login
docker tag bussorakel acntechie/bussorakel-react
docker push acntechie/bussorakel-react
```
NB: You should change the repo name to your own, as you probably don't want to push it to the acntechie account.

#### Run the service on your Swarm

Using the image we pushed earlier we now create a service on our swarm.

Still connected to our swarm-manager with `docker-machine ssh swarm-manager1` we run:

```
docker service create --name bussorakel --replicas 5 -p 80:3000 acntechie/bussorakel-react
```

This will create 5 instances of our application distributed on our 3 nodes and load balanced using round robin algorithm. We're binding port 80 of our cluster to the containers port 3000 where the app is running and your application should become available on MANAGER_IP.

The cluster will do service discovery and request routing for you, so you can access any of the host IP's and still reach the service. Even if you choose to only run 1 replica.(!)

## Final comments

I hope that this application and these instructions have given you some insight into the world of cloud deployment. We've deployed to Heroku PaaS and set up our own Docker Swarm cluster using DigitalOcean as IaaS provider. And if this peaked your interest into Docker, you're in for a treat!

If you have any questions or issues, raise a bug and I'll try to get back to you. And if you feel like doing some improvements to further enhance the state of this little demo applications, pull requests are welcomed with open arms! :)