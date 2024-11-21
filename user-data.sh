#!/bin/bash
# Update the package manager and install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -aG docker ec2-user

# Pull and run the Docker container
sudo docker run -d -p 80:3000 --name ajnooncstu/cs360_calc_image:latest
