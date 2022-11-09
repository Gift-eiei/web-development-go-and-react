# web-development-go-and-react

### Front-end 
##### To run docker in local machine for ***React***
doker build -t react-image . \
docker run --rm -p 3000:3000 react-image

### Back-end
##### To run docker in local machine for ***Go***
doker build -t go-image . \
docker run --rm -p 8080:8080 go-image

###  use ***Redis*** as cache
run \
docker pull redis \
docker run --name redis-test-instance -p 6379:6379 -d redis
