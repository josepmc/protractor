FROM node:10

ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN true
RUN wget -q -O - "https://dl-ssl.google.com/linux/linux_signing_key.pub" | apt-key add -
RUN echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y wget xvfb x11vnc supervisor openjdk-7-jre-headless \
    build-essential git ssh nano firefox-esr google-chrome-stable
RUN mkdir /var/run/sshd
RUN echo 'root:test' | chpasswd
RUN sed -i 's/PermitRootLogin .*$/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
VOLUME /var/log/supervisord
RUN printf \
'[supervisord]\n\
nodaemon=true\n\
childlogdir=/var/log/supervisord\n\
[program:sshd]\n\
command=/usr/sbin/sshd -D\n\
[program:xvfb]\n\
command=Xvfb :99 -screen 0 1920x1080x24+32\n\
[program:x11vnc]\n\
command=x11vnc -display :99\n'\
 > /etc/supervisor/conf.d/supervisord.conf

ENV DISPLAY :99
EXPOSE 22
EXPOSE 5900
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]