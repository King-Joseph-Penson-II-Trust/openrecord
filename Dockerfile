FROM python

WORKDIR /home/app
ADD . /home/app

# Download nodejs and django
RUN apt-get update- y
RUN apt-get install -y vim
RUN apt-get install -y nodejs
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip install django
RUN pip install requirements.txt

ENV LANG en_US.utf8

VOLUME ["/app"]
